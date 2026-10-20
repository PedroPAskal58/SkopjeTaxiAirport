import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { Fleet } from '@/components/fleet'
import { Comfort } from '@/components/comfort'
import { BookingCta } from '@/components/booking-cta'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Our Fleet | Skopje Airport Taxi',
  description:
    'Travel in quiet luxury. A hand-picked, immaculately kept fleet driven by professionals — with complimentary touches on every ride.',
}

export default function FleetPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Fleet />
        <Comfort />
        <BookingCta />
      </main>
      <SiteFooter />
    </>
  )
}
