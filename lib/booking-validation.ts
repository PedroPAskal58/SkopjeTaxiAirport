import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/max'
import { formatInTimeZone } from 'date-fns-tz'
import { BOOKING_TIME_ZONE, getPickupTimestamp } from '@/lib/booking-time'

export type BookingDetails = {
  name: string
  phone: string
  email: string
  pickup: string
  dropoff: string
  date: string
  time: string
  passengers: string
  flight: string
  notes: string
}

export type BookingRecord = BookingDetails & {
  id: string
  key: string
  title: string
  car: string
  status: 'requested' | 'approved' | 'rejected' | 'cancelled' | 'expired'
  channel: 'web' | 'whatsapp'
  whatsappSentAt: string | null
  savedAt: number
  cancelledAt: string | null
  revision: number
}

export function bookingDateBounds(now = Date.now()) {
  return {
    min: formatInTimeZone(now, BOOKING_TIME_ZONE, 'yyyy-MM-dd'),
    max: formatInTimeZone(now + 365 * 86400000, BOOKING_TIME_ZONE, 'yyyy-MM-dd'),
  }
}

export function validateBookingDetails(value: unknown, now = Date.now()): BookingDetails {
  if (!value || typeof value !== 'object') throw new Error('Please fill in your booking details.')
  const v = value as Record<string, unknown>
  const read = (key: string, label: string, max: number, min = 0) => {
    if (typeof v[key] !== 'string') throw new Error(`Please enter ${label}.`)
    const text = v[key].trim()
    if (text.length < min || text.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) {
      throw new Error(`Please enter ${label} (${min}–${max} characters).`)
    }
    return text
  }
  const name = read('name', 'your name', 100, 2)
  if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'’\-]*$/u.test(name) || (name.match(/\p{L}/gu)?.length ?? 0) < 2) {
    throw new Error('Please enter your name using letters, not numbers or symbols.')
  }
  const phone = read('phone', 'a phone number with country code', 30, 6)
  if (!phone.startsWith('+') || !isValidPhoneNumber(phone)) throw new Error('Enter a valid phone number and select the correct country.')
  const email = read('email', 'your email address', 254, 5).toLowerCase()
  if (!/^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i.test(email)) throw new Error('Please enter a valid email address.')
  const date = read('date', 'a pickup date', 10, 10)
  const time = read('time', 'a pickup time', 5, 5)
  const at = getPickupTimestamp(date, time)
  if (at === null) throw new Error('Choose a valid pickup date and time in Skopje time.')
  if (at <= now) throw new Error('Pickup must be in the future (Skopje time).')
  if (at > now + 365 * 86400000) throw new Error('Bookings can be made up to one year ahead.')
  const passengers = read('passengers', 'the number of passengers', 1, 1)
  if (!/^[1-4]$/.test(passengers)) throw new Error('Choose between 1 and 4 passengers.')
  return {
    name, phone: parsePhoneNumber(phone).number, email, date, time, passengers,
    pickup: read('pickup', 'your pickup location', 250, 3),
    dropoff: read('dropoff', 'your drop-off location', 250),
    flight: read('flight', 'a flight number', 30),
    notes: read('notes', 'booking notes', 2000),
  }
}
