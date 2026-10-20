import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BookingHistory } from '@/components/booking-history'

export const metadata: Metadata = { title: 'My bookings | Skopje Airport Taxi', description: 'Manage upcoming requests, past bookings and cancellations.', robots: { index: false, follow: false } }

export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  return <><SiteHeader /><main><BookingHistory view={view === 'past' || view === 'cancelled' ? view : 'upcoming'} /></main><SiteFooter /></>
}
