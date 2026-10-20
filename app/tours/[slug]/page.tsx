import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TourDetail } from '@/components/tour-detail'
import { site, tourList, tours, type TourSlug } from '@/lib/site'

function getTour(slug: string) {
  return slug in tours ? tours[slug as TourSlug] : undefined
}

export function generateStaticParams() {
  return tourList.map((tour) => ({ slug: tour.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tour = getTour(slug)
  if (!tour) return {}
  return {
    title: `${tour.title} | Private Tour from Skopje`,
    description: tour.description,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title: tour.title,
      description: tour.description,
      url: `/tours/${tour.slug}`,
      images: [{ url: tour.image, alt: tour.alt }],
      type: 'website',
    },
  }
}

function tourJsonLd(tour: NonNullable<ReturnType<typeof getTour>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    image: `${site.url}${tour.image}`,
    url: `${site.url}/tours/${tour.slug}`,
    touristType: 'Private tour',
    itinerary: {
      '@type': 'ItemList',
      itemListElement: tour.itinerary.map((stop, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: stop.title,
      })),
    },
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${site.url}/tours/${tour.slug}`,
    },
    provider: {
      '@type': 'LocalBusiness',
      name: site.name,
      telephone: site.phoneDisplay,
      email: site.email,
      url: site.url,
    },
  }
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tour = getTour(slug)
  if (!tour) notFound()

  return (
    <>
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(tourJsonLd(tour)).replace(/</g, '\\u003c'),
          }}
        />
        <TourDetail tour={tour} />
      </main>
      <SiteFooter />
    </>
  )
}
