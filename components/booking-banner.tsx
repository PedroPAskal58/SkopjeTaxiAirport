'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, CircleCheck, Clock, Hourglass, MessageCircle, X, XCircle } from 'lucide-react'
import { confirmWhatsAppSent, dismissBookingNotice, formatBookingWhen, trackWhatsAppOpened, useBannerBooking } from '@/lib/booking-memory'
import { buildSavedBookingWhatsAppHref } from '@/lib/whatsapp-message'
import { BookingCountdown } from '@/components/booking-countdown'
import { cn } from '@/lib/utils'

const statusStyles = {
  requested: { label: 'Awaiting confirmation', icon: Hourglass, className: 'booking-status-requested' },
  approved: { label: 'Confirmed', icon: CircleCheck, className: '' },
  rejected: { label: 'Declined · not available', icon: XCircle, className: 'booking-status-declined' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'booking-status-declined' },
  expired: { label: 'Expired · no reply', icon: Clock, className: 'booking-status-declined' },
} as const

const closedMessages = {
  rejected: 'Sorry, we can’t take this booking. Please pick another date or contact us.',
  cancelled: 'This booking has been cancelled.',
  expired: 'We didn’t receive your WhatsApp message within 24 hours, so this request has closed.',
} as const

function PulseDot() {
  return (
    <span className="relative flex size-2" aria-hidden="true">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75 motion-reduce:animate-none" />
      <span className="relative inline-flex size-2 rounded-full bg-current" />
    </span>
  )
}

export function BookingBanner() {
  const booking = useBannerBooking()
  const [marking, setMarking] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)
  if (!booking || booking.status === 'approved') return null

  const status = statusStyles[booking.status]
  const StatusIcon = status.icon
  const closed = booking.status === 'rejected' || booking.status === 'cancelled' || booking.status === 'expired'
  const viaWhatsApp = booking.status === 'requested' && booking.channel === 'whatsapp'
  const awaitingSend = viaWhatsApp && !booking.whatsappSentAt

  async function markSent() {
    if (!booking) return
    setMarking(true)
    setError('')
    try { await confirmWhatsAppSent(booking.id) }
    catch (err) { setError(err instanceof Error ? err.message : 'Please try again.') }
    finally { setMarking(false) }
  }

  return (
    <div
      role="status"
      className={cn('booking-green border-b border-booking/30 bg-booking-surface text-booking-foreground', status.className)}
    >
      <div
        id="booking-banner-body"
        className={cn(
          'mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-2 gap-y-0 px-3 py-1 text-xs sm:gap-3 sm:px-6 sm:py-3 sm:text-sm',
          expanded && 'max-h-[45svh] overflow-y-auto sm:max-h-none sm:overflow-visible',
        )}
      >
        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:flex-1">
        <Link href={`/bookings/${booking.id}`} className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-md outline-offset-4 hover:underline">
          <p className="flex min-w-0 flex-nowrap items-center gap-2 sm:flex-wrap">
            {viaWhatsApp ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-whatsapp px-2 py-0.5 text-[11px] font-semibold text-whatsapp-foreground sm:gap-1.5 sm:px-2.5 sm:text-xs">
                <MessageCircle className="size-3 sm:size-3.5" aria-hidden="true" />
                {awaitingSend ? 'Booked on WhatsApp' : 'Marked as sent'}
                <PulseDot />
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-booking px-2 py-0.5 text-[11px] font-semibold text-booking-surface sm:gap-1.5 sm:px-2.5 sm:text-xs">
                <StatusIcon className="size-3 sm:size-3.5" aria-hidden="true" />
                {status.label}
              </span>
            )}
            <span className={cn('min-w-0 sm:whitespace-normal sm:break-words', expanded ? 'break-words' : 'truncate')}>
              <span className="font-semibold">{booking.title}</span>
              <span className="text-muted-foreground"> · {formatBookingWhen(booking)}{booking.time ? ' · Skopje time' : ''}</span>
            </span>
          </p>
          {closed ? (
            <p className={cn('text-muted-foreground', !expanded && 'hidden sm:block')}>{closedMessages[booking.status as keyof typeof closedMessages]}</p>
          ) : viaWhatsApp ? (
            <p className={cn('text-muted-foreground', !expanded && 'hidden sm:block')}>
              {awaitingSend
                ? 'Awaiting reply on WhatsApp. Didn’t send it yet? Open WhatsApp again.'
                : 'You marked this as sent on WhatsApp. No reply yet? Make sure you tapped Send in WhatsApp, or open it again.'}
            </p>
          ) : (
            <div className={cn(!expanded && 'hidden sm:block')}>
              <BookingCountdown date={booking.date} time={booking.time} compact />
            </div>
          )}
          {error && <p role="alert" className="text-destructive">{error}</p>}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="booking-banner-body"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-booking hover:bg-booking/10 sm:hidden"
        >
          <ChevronDown className={cn('size-4 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
          <span className="sr-only">{expanded ? 'Hide booking details' : 'Show booking details'}</span>
        </button>
        </div>
        <div className="flex w-full shrink-0 flex-wrap items-center gap-x-2 gap-y-1 sm:w-auto sm:gap-1 [&_svg]:size-3.5 sm:[&_svg]:size-4">
          {awaitingSend ? (
            <>
              <button
                type="button"
                onClick={markSent}
                disabled={marking}
                aria-busy={marking}
                className="inline-flex min-h-7 flex-1 items-center justify-center gap-1.5 rounded-md px-3 font-semibold text-booking hover:bg-booking/10 disabled:opacity-60 sm:min-h-11 sm:flex-none"
              >
                <Check className="size-4" aria-hidden="true" />
                {marking ? 'Saving…' : 'I’ve sent it'}
              </button>
              <a
                href={buildSavedBookingWhatsAppHref(booking)}
                target="_blank"
                rel="noreferrer"
                onClick={() => void trackWhatsAppOpened(booking.id)}
                className="inline-flex min-h-7 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-whatsapp px-3 font-semibold sm:px-4 text-whatsapp-foreground hover:bg-whatsapp/90 sm:min-h-11 sm:flex-none"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Open WhatsApp again
              </a>
            </>
          ) : (
            <>
            {viaWhatsApp && (
              <a
                href={buildSavedBookingWhatsAppHref(booking)}
                target="_blank"
                rel="noreferrer"
                className="-ml-1 inline-flex min-h-7 items-center gap-1 rounded-md px-1 font-semibold text-booking hover:bg-booking/10 sm:ml-0 sm:min-h-11 sm:gap-1.5 sm:px-3"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Open WhatsApp
              </a>
            )}
            <Link
              href={closed ? '/tours' : `/bookings/${booking.id}`}
              className={cn('inline-flex min-h-7 items-center gap-1 px-1 font-semibold text-booking hover:underline sm:min-h-11 sm:gap-1.5 sm:px-0', !viaWhatsApp && '-ml-1 sm:ml-0')}
            >
              {closed ? 'Book again' : 'Change booking'} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            </>
          )}
          {closed && (
            <button
              type="button"
              onClick={() => dismissBookingNotice(booking.id)}
              className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-booking hover:bg-booking/10 sm:ml-0 sm:size-11"
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
