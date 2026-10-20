import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { RouteExplorer } from '@/components/route-explorer'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Routes | Skopje Airport Taxi',
  description:
    'See exactly where you will go. Explore private transfer routes from Skopje Airport and Skopje to Ohrid, Tirana, Sofia, Thessaloniki and more.',
}

export default function RoutesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <RouteExplorer />
      </main>
      <SiteFooter />
    </>
  )
}
