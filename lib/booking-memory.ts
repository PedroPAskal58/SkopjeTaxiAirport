'use client'

import { useSyncExternalStore } from 'react'
import useSWR, { mutate } from 'swr'
import { getPickupTimestamp } from '@/lib/booking-time'
import { createBooking, markWhatsAppOpened, markWhatsAppSent } from '@/app/actions/bookings'
import type { BookingDetails, BookingRecord } from '@/lib/booking-validation'
import { celebrateBooking } from '@/components/leaf-celebration'

export type SavedBooking = BookingRecord

const BOOKINGS_URL = '/api/bookings'
const WAITLIST_KEY = 'sat-van-waitlist'
const CHANGE_EVENT = 'sat-storage-change'
const ONE_DAY = 24 * 60 * 60 * 1000

function bookingEndsAt(booking: SavedBooking) {
  if (booking.date) {
    const at = getPickupTimestamp(booking.date, booking.time || '23:59')
    if (at !== null) return at
  }
  return booking.savedAt + ONE_DAY
}

function readRaw(key: string) {
  try {
    return localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

export function useBookings() {
  return useSWR<BookingRecord[]>(BOOKINGS_URL, async (url: string) => {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) throw new Error('Could not load your bookings.')
    return response.json()
  }, { refreshInterval: 30_000 })
}

export async function refreshBookings() {
  await mutate(BOOKINGS_URL)
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  // Re-check periodically so the booking clears itself once its date and time pass.
  const timer = window.setInterval(onChange, 30_000)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.clearInterval(timer)
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function upsertCached(booking: BookingRecord) {
  return mutate(BOOKINGS_URL, (current: BookingRecord[] = []) => [...current.filter(item => item.id !== booking.id), booking].sort((a, b) => bookingEndsAt(a) - bookingEndsAt(b)), { revalidate: false })
}

export async function saveBooking(booking: BookingDetails & { id: string; key: string; title: string; car?: string; channel?: 'web' | 'whatsapp' }) {
  const result = await createBooking(booking)
  if (result.error || !result.booking) throw new Error(result.error || 'Booking could not be saved.')
  await upsertCached(result.booking)
  celebrateBooking()
  return result.booking
}

export async function trackWhatsAppOpened(id: string) {
  const result = await markWhatsAppOpened(id)
  if (result.booking) await upsertCached(result.booking)
}

export async function confirmWhatsAppSent(id: string) {
  const result = await markWhatsAppSent(id)
  if (result.error || !result.booking) throw new Error(result.error || 'Could not update your booking.')
  await upsertCached(result.booking)
}

export function useActiveBooking(): SavedBooking | null {
  const { data } = useBookings()
  return data?.find(booking => (booking.status === 'requested' || booking.status === 'approved') && bookingEndsAt(booking) > Date.now()) ?? null
}

const DISMISSED_KEY = 'sat-dismissed-booking-notices'

export function useBannerBooking(): SavedBooking | null {
  const { data } = useBookings()
  const dismissed = useSyncExternalStore(subscribe, () => readRaw(DISMISSED_KEY), () => '')
  const upcoming = data?.filter(booking => bookingEndsAt(booking) > Date.now()) ?? []
  return (
    upcoming.find(booking => booking.status === 'requested' || booking.status === 'approved') ??
    upcoming.find(booking => (booking.status === 'rejected' || booking.status === 'cancelled' || booking.status === 'expired') && !dismissed.split(',').includes(booking.id)) ??
    null
  )
}

export function dismissBookingNotice(id: string) {
  const ids = readRaw(DISMISSED_KEY).split(',').filter(Boolean)
  write(DISMISSED_KEY, [...new Set([...ids, id])].join(','))
}

const REJECTED_TOAST_KEY = 'sat-seen-rejection-toasts'

const TOAST_STATUSES = ['rejected', 'approved'] as const

// Rejections keep the bare id so toasts already dismissed before approvals were added stay dismissed.
function toastToken(booking: Pick<SavedBooking, 'id' | 'status'>) {
  return booking.status === 'rejected' ? booking.id : `${booking.id}:${booking.status}`
}

export function useStatusToastBooking(): SavedBooking | null {
  const { data } = useBookings()
  const seen = useSyncExternalStore(subscribe, () => readRaw(REJECTED_TOAST_KEY), () => null)
  if (seen === null) return null
  const seenTokens = seen.split(',')
  return (
    data?.find(
      booking =>
        (TOAST_STATUSES as readonly string[]).includes(booking.status) &&
        !seenTokens.includes(toastToken(booking)),
    ) ?? null
  )
}

export function markStatusToastSeen(booking: Pick<SavedBooking, 'id' | 'status'>) {
  const tokens = readRaw(REJECTED_TOAST_KEY).split(',').filter(Boolean)
  write(REJECTED_TOAST_KEY, [...new Set([...tokens, toastToken(booking)])].join(','))
}

export function isBookingFor(
  booking: SavedBooking | null,
  { bookingKey, car }: { bookingKey?: string; car?: string },
) {
  if (!booking) return false
  return (!!bookingKey && booking.key === bookingKey) || (!!car && booking.car === car)
}

export function formatBookingWhen(booking: SavedBooking) {
  if (!booking.date) return 'Request sent'
  const date = new Date(`${booking.date}T${booking.time || '00:00'}`)
  if (Number.isNaN(date.getTime())) return booking.date
  const day = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  return booking.time ? `${day} · ${booking.time}` : day
}

export function joinVanWaitlist() {
  write(WAITLIST_KEY, '1')
}

export function useVanWaitlisted() {
  return useSyncExternalStore(subscribe, () => readRaw(WAITLIST_KEY) === '1', () => false)
}
