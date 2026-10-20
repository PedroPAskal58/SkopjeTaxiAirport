import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Tours } from '@/components/tours'
import { Transfers } from '@/components/transfers'
import { RouteExplorer } from '@/components/route-explorer'
import { Comfort } from '@/components/comfort'
import { Fleet } from '@/components/fleet'
import { Faq } from '@/components/faq'
import { Reviews } from '@/components/reviews'
import { BookingCta } from '@/components/booking-cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Tours />
        <Transfers />
        <RouteExplorer />
        <Comfort />
        <Fleet />
        <Reviews />
        <Faq />
        <BookingCta />
      </main>
      <SiteFooter />
    </>
  )
}
