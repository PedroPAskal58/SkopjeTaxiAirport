'use client'

import { useEffect, type CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock, X, XCircle } from 'lucide-react'
import { formatBookingWhen, markStatusToastSeen, useStatusToastBooking } from '@/lib/booking-memory'
import { useCountdownLabel } from '@/components/use-countdown-label'
import { cn } from '@/lib/utils'

const REJECTED_VISIBLE_MS = 20_000
const CONFIRMED_VISIBLE_MS = 30_000

export function RejectedToast() {
  const booking = useStatusToastBooking()
  const id = booking?.id
  const status = booking?.status
  const confirmed = status === 'approved'
  const visibleMs = confirmed ? CONFIRMED_VISIBLE_MS : REJECTED_VISIBLE_MS
  const countdown = useCountdownLabel(confirmed ? booking?.date : undefined, confirmed ? booking?.time : undefined)

  useEffect(() => {
    if (!id || !status) return
    const timer = window.setTimeout(() => markStatusToastSeen({ id, status }), visibleMs)
    return () => window.clearTimeout(timer)
  }, [id, status, visibleMs])

  if (!booking) return null

  const Icon = confirmed ? CheckCircle2 : XCircle
  const dismiss = () => markStatusToastSeen(booking)

  return (
    <div
      role={confirmed ? 'status' : 'alert'}
      key={`${booking.id}:${booking.status}`}
      style={{ '--toast-duration': `${visibleMs / 1000}s` } as CSSProperties}
      className={cn(
        'rejected-toast fixed right-4 bottom-4 left-4 z-50 overflow-hidden rounded-2xl shadow-2xl',
        confirmed ? 'bg-emerald-600 text-white sm:left-auto sm:w-[28rem]' : 'bg-destructive text-destructive-foreground sm:left-auto sm:w-96',
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="font-semibold">{confirmed ? 'Booking confirmed' : 'Booking rejected'}</p>
          <p className="text-sm leading-relaxed text-pretty">
            {confirmed
              ? `Great news! ${booking.title} on ${formatBookingWhen(booking)}${booking.time ? ' (Skopje time)' : ''} is confirmed. We look forward to seeing you.`
              : `Sorry, we can't take ${booking.title} on ${formatBookingWhen(booking)}. Please pick another time or contact us.`}
          </p>
          {confirmed && countdown && (
            <p className="mt-1 flex flex-wrap items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              <span className="text-white/80">Pickup in</span>
              <span role="timer" aria-live="off" className="font-semibold tabular-nums">{countdown}</span>
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              href={`/bookings/${booking.id}`}
              onClick={dismiss}
              className="w-fit text-sm font-semibold underline underline-offset-4"
            >
              View details
            </Link>
            {confirmed && (
              <Link
                href={`/bookings/${booking.id}`}
                onClick={dismiss}
                className="inline-flex w-fit items-center gap-1 text-sm font-semibold underline underline-offset-4"
              >
                Change booking <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className={cn(
            '-mt-1 -mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md',
            confirmed ? 'hover:bg-white/15' : 'hover:bg-destructive-foreground/15',
          )}
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Close notification</span>
        </button>
      </div>
      <div
        className={cn('rejected-toast-timer h-1', confirmed ? 'bg-white/40' : 'bg-destructive-foreground/40')}
        aria-hidden="true"
      />
    </div>
  )
}
