import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { Faq } from '@/components/faq'
import { BookingCta } from '@/components/booking-cta'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'FAQ | Skopje Airport Taxi',
  description:
    'Answers to common questions about booking, airport pickup, fixed prices, payment, child seats and destinations across Macedonia.',
}

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Faq />
        <BookingCta />
      </main>
      <SiteFooter />
    </>
  )
}
