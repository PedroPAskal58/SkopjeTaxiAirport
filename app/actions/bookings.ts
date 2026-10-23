'use server'

import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { and, asc, eq, gt, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { expireStaleWhatsAppBookings } from '@/lib/db/expire-whatsapp'
import { getPickupTimestamp } from '@/lib/booking-time'
import { validateBookingDetails, type BookingRecord } from '@/lib/booking-validation'
import { tourList, transfers, vehicles } from '@/lib/site'

const COOKIE = 'sat-guest-bookings'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function guestId(create = false) {
  const jar = await cookies()
  let token = jar.get(COOKIE)?.value
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    if (!create) return null
    token = randomBytes(32).toString('hex')
    jar.set(COOKIE, token, { httpOnly: true, secure: true, sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
  }
  // A random guest capability grants access only to this browser's records; never accept ownership from input.
  return createHash('sha256').update(token).digest('hex')
}

function serialize(row: typeof bookings.$inferSelect): BookingRecord {
  return {
    id: row.id, key: row.key, title: row.title, car: row.car, name: row.name, phone: row.phone, email: row.email,
    pickup: row.pickup, dropoff: row.dropoff, date: row.date, time: row.time,
    passengers: String(row.passengers), flight: row.flight, notes: row.notes,
    status: row.status as BookingRecord['status'], savedAt: row.createdAt.getTime(),
    cancelledAt: row.cancelledAt?.toISOString() ?? null, revision: row.revision,
    channel: row.channel === 'whatsapp' ? 'whatsapp' : 'web',
    whatsappSentAt: row.whatsappSentAt?.toISOString() ?? null,
  }
}

export async function listBookings() {
  const userId = await guestId()
  if (!userId) return []
  await expireStaleWhatsAppBookings(userId)
  const rows = await db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(asc(bookings.pickupAt))
  return rows.map(serialize)
}

function serviceTitle(key: string, car: string) {
  if (car !== 'mondeo' && car !== 'kia') throw new Error('Please choose an available car.')
  if (key === 'trip:custom') return 'Custom trip'
  if (key === 'tour:custom') return 'Custom private tour'
  if (key === 'transfer:custom') return 'Custom transfer'
  if (key === `car:${car}`) return vehicles[car].name
  const tour = tourList.find(t => `tour:${t.slug}` === key)
  const transfer = transfers.find(t => `transfer:${t.slug}` === key)
  if (!tour && !transfer) throw new Error('Please choose a valid tour or transfer.')
  return tour?.title ?? transfer!.route
}

export async function createBooking(input: unknown) {
  let details
  let id: string
  let key: string
  let car: string
  let title: string
  let channel: 'web' | 'whatsapp'
  try {
    details = validateBookingDetails(input)
    const v = input as Record<string, unknown>
    channel = v.channel === 'whatsapp' ? 'whatsapp' : 'web'
    id = typeof v.id === 'string' ? v.id : ''
    key = typeof v.key === 'string' ? v.key : ''
    car = typeof v.car === 'string' ? v.car : ''
    if (!UUID.test(id)) throw new Error('Invalid request. Please reload and try again.')
    title = serviceTitle(key, car)
    if ((key.startsWith('transfer:') || key.startsWith('car:')) && details.dropoff.length < 3) throw new Error('Please enter your drop-off location.')
  } catch (error) { return { error: error instanceof Error ? error.message : 'Please check your details.' } }
  try {
    const userId = (await guestId(true))!
    const [existing] = await db.select().from(bookings).where(and(eq(bookings.userId, userId), eq(bookings.id, id)))
    if (existing) return { booking: serialize(existing) }
    const upcoming = await db.select({ id: bookings.id }).from(bookings).where(and(eq(bookings.userId, userId), eq(bookings.status, 'requested'), gt(bookings.pickupAt, new Date())))
    if (upcoming.length >= 10) return { error: 'You already have 10 upcoming requests. Please manage an existing booking first.' }
    const [row] = await db.insert(bookings).values({ ...details, id, userId, key, car, title, channel, passengers: Number(details.passengers), pickupAt: new Date(getPickupTimestamp(details.date, details.time)!) }).onConflictDoNothing().returning()
    if (!row) {
      const [retry] = await db.select().from(bookings).where(and(eq(bookings.userId, userId), eq(bookings.id, id)))
      if (retry) return { booking: serialize(retry) }
      return { error: 'Request could not be saved. Please reload and try again.' }
    }
    return { booking: serialize(row) }
  } catch { return { error: 'We could not save your request. Please try again; no confirmation has been issued.' } }
}

const CUSTOMER_EDITS_ENABLED = false

export async function updateBooking(id: string, revision: number, input: unknown) {
  // Customers must request changes on WhatsApp; only the admin reschedules bookings.
  if (!CUSTOMER_EDITS_ENABLED) return { error: 'To change your booking, please message us on WhatsApp.' }
  let details
  try { details = validateBookingDetails(input) }
  catch (error) { return { error: error instanceof Error ? error.message : 'Please check your details.' } }
  const userId = await guestId()
  if (!userId || !UUID.test(id) || !Number.isInteger(revision)) return { error: 'Booking not found in this browser.' }
  try {
    const [current] = await db.select().from(bookings).where(and(eq(bookings.id, id), eq(bookings.userId, userId)))
    if (!current) return { error: 'Booking not found.' }
    if ((current.key.startsWith('transfer:') || current.key.startsWith('car:')) && details.dropoff.length < 3) return { error: 'Please enter your drop-off location.' }
    // Changing a confirmed ride sends it back to 'requested' so the driver re-confirms the new details.
    const [row] = await db.update(bookings).set({ ...details, status: 'requested', passengers: Number(details.passengers), pickupAt: new Date(getPickupTimestamp(details.date, details.time)!), updatedAt: new Date(), revision: revision + 1, notificationPending: true }).where(and(eq(bookings.id, id), eq(bookings.userId, userId), eq(bookings.revision, revision), inArray(bookings.status, ['requested', 'approved']), gt(bookings.pickupAt, new Date()))).returning()
    if (!row) return { error: 'This booking changed or its pickup time has passed. Refresh to see its latest status.' }
    return { booking: serialize(row) }
  } catch { return { error: 'Changes were not saved. Please try again.' } }
}

export async function cancelBooking(id: string, revision: number) {
  const userId = await guestId()
  if (!userId || !UUID.test(id) || !Number.isInteger(revision)) return { error: 'Booking not found in this browser.' }
  try {
    const [row] = await db.update(bookings).set({ status: 'cancelled', cancelledAt: new Date(), updatedAt: new Date(), revision: revision + 1, notificationPending: true }).where(and(eq(bookings.id, id), eq(bookings.userId, userId), eq(bookings.revision, revision), inArray(bookings.status, ['requested', 'approved']), gt(bookings.pickupAt, new Date()))).returning()
    if (!row) return { error: 'This booking changed or its pickup time has passed. Refresh to see its latest status.' }
    return { booking: serialize(row) }
  } catch { return { error: 'Cancellation was not saved. Please try again.' } }
}

async function updateWhatsAppState(id: string, sent: boolean) {
  const userId = await guestId()
  if (!userId || !UUID.test(id)) return { error: 'Booking not found in this browser.' }
  try {
    const [row] = await db
      .update(bookings)
      .set(sent ? { channel: 'whatsapp', whatsappSentAt: new Date(), updatedAt: new Date() } : { channel: 'whatsapp', updatedAt: new Date() })
      .where(and(eq(bookings.id, id), eq(bookings.userId, userId), eq(bookings.status, 'requested')))
      .returning()
    if (!row) return { error: 'This booking was already reviewed or closed.' }
    return { booking: serialize(row) }
  } catch { return { error: 'Could not update your booking. Please try again.' } }
}

export async function markWhatsAppOpened(id: string) {
  return updateWhatsAppState(id, false)
}

export async function markWhatsAppSent(id: string) {
  return updateWhatsAppState(id, true)
}
