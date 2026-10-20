import type { Metadata } from 'next'
import { MapPin } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ContactMethods } from '@/components/contact-methods'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact | Skopje Airport Taxi',
  description:
    'Contact Skopje Airport Taxi 24/7 by WhatsApp, Viber, phone or email. Ask about airport transfers, day tours and prices across Macedonia.',
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact</p>
          <h1 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            Talk to a real driver, <span className="text-gold">day or night</span>
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Questions about a transfer, a tour or a price? We&apos;re a small local team at Skopje
            International Airport and we answer every message ourselves.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-gold" aria-hidden="true" />
            Skopje International Airport (SKP), North Macedonia
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <ContactMethods />
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
