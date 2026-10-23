import { getTransfer, hasLockedAirportPickup } from '@/lib/transfers'
import type { BookingRecord } from '@/lib/booking-validation'

export type BookingFieldRules = {
  isTour: boolean
  showDropoff: boolean
  dropoffLabel: string
  dropoffLocked: boolean
  pickupLabel: string
  pickupLocked: boolean
  showFlight: boolean
}

export function getBookingFieldRules(booking: Pick<BookingRecord, 'key'>): BookingFieldRules {
  const key = booking.key ?? ''
  const isTour = key.startsWith('tour:')
  const isCustomTour = key === 'tour:custom'
  const fixedTransfer = key.startsWith('transfer:') && key !== 'transfer:custom' ? getTransfer(key.slice('transfer:'.length)) : undefined

  return {
    isTour,
    showDropoff: !isTour || isCustomTour,
    dropoffLabel: isCustomTour ? 'Destination' : 'Drop-off',
    dropoffLocked: Boolean(fixedTransfer),
    pickupLabel: isTour ? 'Pickup / hotel' : 'Pickup',
    pickupLocked: hasLockedAirportPickup(fixedTransfer),
    showFlight: !isTour,
  }
}
