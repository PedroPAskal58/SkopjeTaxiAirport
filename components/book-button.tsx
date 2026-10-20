'use client'

import Link from 'next/link'
import { CalendarCheck, Check } from 'lucide-react'
import {
  formatBookingWhen,
  isBookingFor,
  joinVanWaitlist,
  useActiveBooking,
  useVanWaitlisted,
} from '@/lib/booking-memory'
import { cn } from '@/lib/utils'

export function BookButton({
  href,
  bookingKey,
  car,
  className,
  bookedClassName,
  children,
}: {
  href: string
  bookingKey?: string
  car?: string
  className?: string
  bookedClassName?: string
  children: React.ReactNode
}) {
  const booking = useActiveBooking()

  if (booking && isBookingFor(booking, { bookingKey, car })) {
    return (
      <Link
        href={`/bookings/${booking.id}`}
        className={cn(
          'relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-booking-surface px-4 py-2.5 text-sm font-semibold text-booking ring-1 ring-booking/30 hover:underline',
          bookedClassName,
        )}
      >
        <CalendarCheck className="size-4 shrink-0" aria-hidden="true" />
        Requested · {formatBookingWhen(booking)}
      </Link>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function BookedBadge({ bookingKey }: { bookingKey: string }) {
  const booking = useActiveBooking()
  if (!booking || !isBookingFor(booking, { bookingKey })) return null
  return (
    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
      <CalendarCheck className="size-3.5" aria-hidden="true" />
      Requested · {formatBookingWhen(booking)}
    </span>
  )
}

export function WaitlistButton() {
  const joined = useVanWaitlisted()

  return (
    <button
      type="button"
      onClick={joinVanWaitlist}
      disabled={joined}
      aria-pressed={joined}
      className={cn(
        'inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition',
        joined
          ? 'cursor-default border-gold/40 bg-gold/15 text-gold'
          : 'border-border bg-transparent text-foreground hover:bg-secondary',
      )}
    >
      {joined ? (
        <>
          <Check className="size-4" aria-hidden="true" /> You&apos;re on the waitlist
        </>
      ) : (
        'Join the waitlist'
      )}
    </button>
  )
}
