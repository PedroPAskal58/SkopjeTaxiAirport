'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { formatPickupDate, getPickupTimestamp } from '@/lib/booking-time'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/admin'

export type AdminActionState = { status: 'idle' | 'success' | 'error'; message: string }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function reviewBooking(formData: FormData, decision: 'approved' | 'rejected'): Promise<AdminActionState> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Your admin session has expired. Please sign in again.' }
  }

  const id = String(formData.get('id') ?? '')
  if (!UUID.test(id)) return { status: 'error', message: 'Invalid booking reference.' }

  try {
    const now = new Date()
    const [row] = await db
      .update(bookings)
      .set({
        status: decision,
        updatedAt: now,
        notificationPending: true,
        revision: sql`${bookings.revision} + 1`,
        ...(decision === 'rejected' ? { cancelledAt: now } : {}),
      })
      .where(and(eq(bookings.id, id), eq(bookings.status, 'requested')))
      .returning({ id: bookings.id })

    revalidatePath('/admin/bookings')
    if (!row) return { status: 'error', message: 'This request was already reviewed or cancelled by the customer.' }
    return { status: 'success', message: decision === 'approved' ? 'Booking confirmed. It is now in History.' : 'Request declined. It is now in History.' }
  } catch (error) {
    console.error('[admin] Failed to review booking', error)
    return { status: 'error', message: 'Could not update the booking. Please try again.' }
  }
}

export async function rescheduleBooking(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Your admin session has expired. Please sign in again.' }
  }

  const id = String(formData.get('id') ?? '')
  const date = String(formData.get('date') ?? '')
  const time = String(formData.get('time') ?? '')
  if (!UUID.test(id)) return { status: 'error', message: 'Invalid booking reference.' }
  const at = getPickupTimestamp(date, time)
  if (at === null) return { status: 'error', message: 'Choose a valid date and time (Skopje time).' }
  if (at <= Date.now()) return { status: 'error', message: 'The new pickup time must be in the future.' }

  try {
    const [row] = await db
      .update(bookings)
      .set({
        date,
        time,
        pickupAt: new Date(at),
        updatedAt: new Date(),
        notificationPending: true,
        revision: sql`${bookings.revision} + 1`,
      })
      .where(and(eq(bookings.id, id), inArray(bookings.status, ['requested', 'approved'])))
      .returning({ id: bookings.id })

    revalidatePath('/admin/bookings')
    if (!row) return { status: 'error', message: 'Only pending or confirmed bookings can be rescheduled.' }
    return { status: 'success', message: `Pickup changed to ${formatPickupDate(date, time)}.` }
  } catch (error) {
    console.error('[admin] Failed to reschedule booking', error)
    return { status: 'error', message: 'Could not change the time. Please try again.' }
  }
}

export async function approveBooking(_prev: AdminActionState, formData: FormData) {
  return reviewBooking(formData, 'approved')
}

export async function rejectBooking(_prev: AdminActionState, formData: FormData) {
  return reviewBooking(formData, 'rejected')
}
