'use client'

import Link from 'next/link'
import { ArrowRight, CircleCheck, Hourglass, X, XCircle } from 'lucide-react'
import { dismissBookingNotice, formatBookingWhen, useBannerBooking } from '@/lib/booking-memory'
import { BookingCountdown } from '@/components/booking-countdown'
import { cn } from '@/lib/utils'

const statusStyles = {
  requested: { label: 'Awaiting confirmation', icon: Hourglass, className: 'booking-status-requested' },
  approved: { label: 'Confirmed', icon: CircleCheck, className: '' },
  rejected: { label: 'Declined · not available', icon: XCircle, className: 'booking-status-declined' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'booking-status-declined' },
} as const

export function BookingBanner() {
  const booking = useBannerBooking()
  if (!booking) return null

  const status = statusStyles[booking.status]
  const StatusIcon = status.icon
  const closed = booking.status === 'rejected' || booking.status === 'cancelled'

  return (
    <div
      role="status"
      className={cn('booking-green border-b border-booking/30 bg-booking-surface text-booking-foreground', status.className)}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
        <Link href={`/bookings/${booking.id}`} className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-md outline-offset-4 hover:underline">
          <p className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-booking px-2.5 py-0.5 text-xs font-semibold text-booking-surface">
              <StatusIcon className="size-3.5" aria-hidden="true" />
              {status.label}
            </span>
            <span className="min-w-0 break-words">
              <span className="font-semibold">{booking.title}</span>
              <span className="text-muted-foreground"> · {formatBookingWhen(booking)}{booking.time ? ' · Skopje time' : ''}</span>
            </span>
          </p>
          {closed ? (
            <p className="text-muted-foreground">
              {booking.status === 'rejected'
                ? 'Sorry, we can’t take this booking. Please pick another date or contact us.'
                : 'This booking has been cancelled.'}
            </p>
          ) : (
            <BookingCountdown date={booking.date} time={booking.time} compact />
          )}
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={closed ? '/tours' : `/bookings/${booking.id}`}
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-booking hover:underline"
          >
            {closed ? 'Book again' : 'Change booking'} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          {closed && (
            <button
              type="button"
              onClick={() => dismissBookingNotice(booking.id)}
              className="inline-flex size-11 items-center justify-center rounded-md text-booking hover:bg-booking/10"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Dismiss notice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
