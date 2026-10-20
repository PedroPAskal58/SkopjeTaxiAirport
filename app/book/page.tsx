import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BookingFlow } from '@/components/booking-flow'
import { vehicles, type VehicleSlug } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Book Now | Skopje Airport Taxi',
  description:
    'Book a car, private tour, or transfer and send your details straight to WhatsApp for a fast, fixed-price confirmation.',
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string }>
}) {
  const { car } = await searchParams
  const initialCar = car && car in vehicles ? (car as VehicleSlug) : undefined

  return (
    <>
      <SiteHeader />
      <main>
        <BookingFlow initialCar={initialCar} />
      </main>
      <SiteFooter />
    </>
  )
}
