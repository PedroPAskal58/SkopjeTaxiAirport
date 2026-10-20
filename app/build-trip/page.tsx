import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TripBuilder } from '@/components/trip-builder'

export const metadata: Metadata = {
  title: 'Build Your Trip | Skopje Airport Taxi',
  description:
    'Combine airport pickups, transfers, day tours and a driver by the hour into one trip and get a single fixed price. Free quote, no prepayment.',
}

export default function BuildTripPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <TripBuilder />
      </main>
      <SiteFooter />
    </>
  )
}
