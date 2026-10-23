import { site } from '@/lib/site'
import type { BookingRecord } from '@/lib/booking-validation'

type Detail = [label: string, value: string | undefined | null]

export function buildCustomerMessage({
  intro,
  details,
  name,
  phone,
  bookingId,
}: {
  intro: string
  details: Detail[]
  name: string
  phone: string
  bookingId?: string
}) {
  const filled = details.filter(([, value]) => value && value.trim())
  const lines = [`Hi! ${intro}`, '']

  if (filled.length) {
    lines.push('Here are the details:', ...filled.map(([label, value]) => `• ${label}: ${value!.trim()}`), '')
  }

  const who = [name.trim() && `My name is ${name.trim()}`, phone.trim() && `you can reach me on ${phone.trim()}`]
    .filter(Boolean)
    .join(' and ')
  if (who) lines.push(`${who[0].toUpperCase()}${who.slice(1)}.`, '')

  if (bookingId) {
    const origin = typeof window !== 'undefined' ? window.location.origin : site.url
    lines.push(`Booking reference: ${bookingId}`, `My booking: ${origin}/bookings/${bookingId}`, '')
  }

  lines.push('Could you please confirm availability? Thank you!')
  if (bookingId) lines.push('', '(Sent from the booking form – please send without editing. To change the time, reply after sending and it will be updated on the site.)')
  return lines.join('\n')
}

function buildCancellationText(booking: BookingRecord) {
  const origin = typeof window !== 'undefined' ? window.location.origin : site.url
  return [
    `Hi! I've just cancelled my booking: ${booking.title}.`,
    '',
    `• Reference: #${booking.id.slice(0, 8).toUpperCase()}`,
    `• Date: ${booking.date}`,
    `• Time: ${booking.time}`,
    `• Pickup: ${booking.pickup}`,
    ...(booking.dropoff ? [`• Drop-off: ${booking.dropoff}`] : []),
    `• Name: ${booking.name}`,
    '',
    `Booking link: ${origin}/bookings/${booking.id}`,
    '',
    'Please make sure the driver is not sent. Thank you!',
  ].join('\n')
}

export function buildCancellationWhatsAppHref(booking: BookingRecord) {
  return `${site.whatsapp}?text=${encodeURIComponent(buildCancellationText(booking))}`
}

export function buildCancellationEmailHref(booking: BookingRecord) {
  const subject = `Booking cancelled #${booking.id.slice(0, 8).toUpperCase()} – ${booking.title}`
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildCancellationText(booking))}`
}

function buildChangeRequestText(booking: BookingRecord) {
  const origin = typeof window !== 'undefined' ? window.location.origin : site.url
  return [
    `Hi! I'd like to change my booking: ${booking.title}.`,
    '',
    `• Reference: #${booking.id.slice(0, 8).toUpperCase()}`,
    `• Current date: ${booking.date}`,
    `• Current time: ${booking.time}`,
    `• Pickup: ${booking.pickup}`,
    ...(booking.dropoff ? [`• Drop-off: ${booking.dropoff}`] : []),
    `• Name: ${booking.name}`,
    '',
    `Booking link: ${origin}/bookings/${booking.id}`,
    '',
    'What I would like to change:',
    '',
  ].join('\n')
}

export function buildChangeRequestWhatsAppHref(booking: BookingRecord) {
  return `${site.whatsapp}?text=${encodeURIComponent(buildChangeRequestText(booking))}`
}

export function buildTimePassengerChangeHref(
  booking: BookingRecord,
  change: { time?: string; passengers?: string },
) {
  const requests = [
    change.time && change.time !== booking.time && `I would like to change the time from ${booking.time} to ${change.time}.`,
    change.passengers && change.passengers !== booking.passengers &&
      `I would like to change the passengers from ${booking.passengers} to ${change.passengers}.`,
  ].filter(Boolean)
  const text = [
    `Hi! Booking #${booking.id.slice(0, 8).toUpperCase()} (${booking.date}, ${booking.name}).`,
    ...requests,
  ].join('\n')
  return `${site.whatsapp}?text=${encodeURIComponent(text)}`
}

export type ChangeField = 'date' | 'time' | 'passengers' | 'pickup' | 'dropoff' | 'flight' | 'notes'

export const changeFieldLabels: Record<ChangeField, string> = {
  date: 'date',
  time: 'time',
  passengers: 'passengers',
  pickup: 'pickup',
  dropoff: 'drop-off',
  flight: 'flight number',
  notes: 'notes',
}

export function buildBookingChangeHref(booking: BookingRecord, changes: Partial<Record<ChangeField, string>>) {
  const requests = (Object.keys(changes) as ChangeField[]).flatMap(field => {
    const next = changes[field]?.trim()
    const current = (booking[field] ?? '').trim()
    if (!next || next === current) return []
    const label = changeFieldLabels[field]
    return current
      ? [`I would like to change the ${label} from ${current} to ${next}.`]
      : [`I would like to add ${label}: ${next}.`]
  })
  const text = [`Hi! Booking #${booking.id.slice(0, 8).toUpperCase()} (${booking.date}, ${booking.name}).`, ...requests].join('\n')
  return { href: `${site.whatsapp}?text=${encodeURIComponent(text)}`, count: requests.length }
}

export function buildSavedBookingWhatsAppHref(booking: BookingRecord) {
  return `${site.whatsapp}?text=${encodeURIComponent(buildSavedBookingText(booking))}`
}

export function buildSavedBookingText(booking: BookingRecord) {
  return buildCustomerMessage({
    intro: `I'd like to book ${booking.title}.`,
    details: [
      ['Date', booking.date],
      ['Time', booking.time],
      ['Passengers', booking.passengers],
      ['Pickup', booking.pickup],
      ['Drop-off', booking.dropoff],
      ['Flight', booking.flight],
      ['Notes', booking.notes],
    ],
    name: booking.name,
    phone: booking.phone,
    bookingId: booking.id,
  })
}
