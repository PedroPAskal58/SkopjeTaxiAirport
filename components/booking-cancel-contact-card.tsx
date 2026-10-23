'use client'

import { Check, Mail, MessageCircle } from 'lucide-react'
import { buildCancellationEmailHref, buildCancellationWhatsAppHref } from '@/lib/whatsapp-message'
import type { BookingRecord } from '@/lib/booking-validation'

export function BookingCancelContactCard({ booking }: { booking: BookingRecord }) {
  return (
    <section aria-labelledby="cancel-contact-title" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-semibold sm:text-base">
        <Check className="size-5 text-booking" aria-hidden="true" /> Your cancellation is recorded
      </p>
      <h2 id="cancel-contact-title" className="mt-3 text-pretty text-lg font-semibold leading-snug">
        Let us know so we don&apos;t send a driver
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Send us a quick message with your booking reference. It&apos;s already written for you — just press send.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={buildCancellationWhatsAppHref(booking)}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 text-sm font-semibold text-whatsapp-foreground transition hover:bg-whatsapp/90 sm:rounded-full"
        >
          <MessageCircle className="size-5" aria-hidden="true" /> Tell us on WhatsApp
        </a>
        <a
          href={buildCancellationEmailHref(booking)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-secondary sm:rounded-full"
        >
          <Mail className="size-5" aria-hidden="true" /> Tell us by email
        </a>
      </div>
    </section>
  )
}
