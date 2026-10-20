import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ReserveForm } from '@/components/reserve-form'
import { tours, vehicles, type TourSlug, type VehicleSlug } from '@/lib/site'
import { getTransfer } from '@/lib/transfers'

export const metadata: Metadata = {
  title: 'Reserve Your Vehicle | Skopje Airport Taxi',
  description:
    'Reserve your private transfer or day tour. Send your trip details and we confirm availability and your fixed price.',
}

export default async function ReservePage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string; tour?: string; transfer?: string }>
}) {
  const { car, tour, transfer } = await searchParams

  if (transfer === 'custom') {
    return (
      <>
        <SiteHeader />
        <main>
          <ReserveForm customTransfer />
        </main>
        <SiteFooter />
      </>
    )
  }

  if (transfer && getTransfer(transfer)) {
    const carSlug = car && car in vehicles ? (car as VehicleSlug) : undefined
    return (
      <>
        <SiteHeader />
        <main>
          <ReserveForm transfer={transfer} car={carSlug} />
        </main>
        <SiteFooter />
      </>
    )
  }

  if (tour === 'custom') {
    return (
      <>
        <SiteHeader />
        <main>
          <ReserveForm customTour />
        </main>
        <SiteFooter />
      </>
    )
  }

  if (tour && tour in tours) {
    return (
      <>
        <SiteHeader />
        <main>
          <ReserveForm tour={tour as TourSlug} />
        </main>
        <SiteFooter />
      </>
    )
  }

  const slug: VehicleSlug | undefined = car && car in vehicles ? (car as VehicleSlug) : undefined

  return (
    <>
      <SiteHeader />
      <main>
        <ReserveForm car={slug} />
      </main>
      <SiteFooter />
    </>
  )
}
