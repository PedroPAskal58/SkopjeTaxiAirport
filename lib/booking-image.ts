import { getTransfer } from '@/lib/transfers'
import { tours, type TourSlug } from '@/lib/site'

const carImages: Record<string, string> = {
  mondeo: '/images/fleet-mondeo.png',
  kia: '/images/fleet-kia.png',
  van: '/images/fleet-van.png',
}

export function getBookingImage(key: string) {
  const [kind, slug = ''] = key.split(':')
  if (kind === 'transfer') return slug === 'custom' ? '/images/transfer-airport.png' : getTransfer(slug)?.image ?? '/images/transfer-airport.png'
  if (kind === 'tour') return slug === 'custom' ? '/images/tour-matka.png' : tours[slug as TourSlug]?.image ?? '/images/tour-matka.png'
  if (kind === 'car') return carImages[slug] ?? '/images/fleet-mondeo.png'
  return '/images/hero-macedonia.png'
}
