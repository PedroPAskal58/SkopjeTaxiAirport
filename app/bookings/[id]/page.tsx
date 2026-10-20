import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BookingDetails } from '@/components/booking-details'

export const metadata: Metadata = { title: 'Manage booking | Skopje Airport Taxi', description: 'Review, change or cancel your booking request.', robots: { index: false, follow: false } }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <><SiteHeader /><main><BookingDetails id={id} /></main><SiteFooter /></>
}
