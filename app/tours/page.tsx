import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { Tours } from '@/components/tours'
import { FeaturedTour } from '@/components/featured-tour'
import { BookingCta } from '@/components/booking-cta'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Tours & Day Trips | Skopje Airport Taxi',
  description:
    'Private day tours from Skopje — Matka Canyon, Ohrid, Stobi, wineries and more. Professional driver, flexible schedule, fixed prices.',
}

export default function ToursPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <FeaturedTour />
        <Tours />
        <BookingCta />
      </main>
      <SiteFooter />
    </>
  )
}
