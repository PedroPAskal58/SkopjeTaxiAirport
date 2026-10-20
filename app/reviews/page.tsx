import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { Reviews } from '@/components/reviews'
import { BookingCta } from '@/components/booking-cta'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Reviews | Skopje Airport Taxi',
  description:
    'Loved by travellers. Read reviews from guests who booked airport transfers and private day tours across Macedonia.',
}

export default function ReviewsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Reviews />
        <BookingCta />
      </main>
      <SiteFooter />
    </>
  )
}
