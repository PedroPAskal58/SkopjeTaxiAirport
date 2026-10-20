import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { Transfers } from '@/components/transfers'
import { BookingCta } from '@/components/booking-cta'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Airport Transfers | Skopje Airport Taxi',
  description:
    'Fixed-price private transfers from Skopje Airport to Skopje, Ohrid and destinations across North Macedonia and the Balkans.',
}

export default function TransfersPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Transfers showFilters />
        <BookingCta />
      </main>
      <SiteFooter />
    </>
  )
}
