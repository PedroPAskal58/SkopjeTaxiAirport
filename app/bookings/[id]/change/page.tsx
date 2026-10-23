import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BookingChangeRequest } from '@/components/booking-change-request'

export const metadata: Metadata = { title: 'Request a change | Skopje Airport Taxi', description: 'Ask to change any detail of your booking.', robots: { index: false, follow: false } }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <><SiteHeader /><main><BookingChangeRequest id={id} /></main><SiteFooter /></>
}
