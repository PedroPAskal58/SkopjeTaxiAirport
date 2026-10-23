'use client'

import { MessageCircle } from 'lucide-react'
import { trackWhatsAppOpened } from '@/lib/booking-memory'
import { buildSavedBookingWhatsAppHref } from '@/lib/whatsapp-message'
import type { BookingRecord } from '@/lib/booking-validation'

export function BookingWhatsAppCard({ booking }: { booking: BookingRecord }) {
  const confirmed = booking.status === 'approved'
  const sent = Boolean(booking.whatsappSentAt)

  const title = confirmed ? 'Questions about your ride?' : sent ? 'Waiting for our reply' : 'Confirm faster on WhatsApp'
  const body = confirmed
    ? 'We usually reply within minutes.'
    : sent
      ? 'We’ll confirm on WhatsApp shortly. No reply yet? Send it again.'
      : 'Send your booking details and we’ll reply with your fixed price.'

  return (
    <section aria-labelledby="whatsapp-card-title" className="rounded-2xl border border-whatsapp/30 bg-whatsapp/10 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground">
          <MessageCircle className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id="whatsapp-card-title" className="text-sm font-semibold leading-snug sm:text-base">{title}</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{body}</p>
        </div>
      </div>
      {!confirmed && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Please send the message without editing it so it matches your booking.
        </p>
      )}
      <a
        href={buildSavedBookingWhatsAppHref(booking)}
        target="_blank"
        rel="noreferrer"
        onClick={() => void trackWhatsAppOpened(booking.id)}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 text-sm font-semibold text-whatsapp-foreground transition hover:bg-whatsapp/90 sm:inline-flex sm:w-auto sm:rounded-full"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        {confirmed ? 'Message us on WhatsApp' : sent ? 'Open WhatsApp again' : 'Send on WhatsApp'}
      </a>
    </section>
  )
}
