import { getPickupTimestamp } from '@/lib/booking-time'
import { tourList } from '@/lib/site'

export type RideKind = 'transfer' | 'tour' | 'hourly'

export type TripRide = {
  id: string
  kind: RideKind
  date: string
  time: string
  from: string
  to: string
  stops: string
  tour: string
  hours: string
}

export const MAX_RIDES = 8

export const RIDE_KINDS: { value: RideKind; label: string; hint: string }[] = [
  { value: 'transfer', label: 'Transfer', hint: 'From A to B, door to door' },
  { value: 'tour', label: 'Day tour', hint: 'Sightseeing with your driver' },
  { value: 'hourly', label: 'Driver by the hour', hint: 'Your driver waits for you' },
]

export function newRide(partial: Partial<TripRide> = {}): TripRide {
  return { id: crypto.randomUUID(), kind: 'transfer', date: '', time: '', from: '', to: '', stops: '', tour: '', hours: '4', ...partial }
}

export const TRIP_IDEAS: { label: string; rides: () => TripRide[] }[] = [
  {
    label: 'Airport pickup + day tour',
    rides: () => [
      newRide({ kind: 'transfer', from: 'Skopje Airport (SKP)', to: 'My hotel in Skopje', time: '' }),
      newRide({ kind: 'tour', from: 'My hotel in Skopje', tour: tourList[0]?.slug ?? '' }),
    ],
  },
  {
    label: 'Multi-city road trip',
    rides: () => [
      newRide({ kind: 'transfer', from: 'Skopje', to: 'Ohrid' }),
      newRide({ kind: 'transfer', from: 'Ohrid', to: 'Tirana' }),
      newRide({ kind: 'transfer', from: 'Tirana', to: 'Skopje Airport (SKP)' }),
    ],
  },
  {
    label: 'Transfer with stops on the way',
    rides: () => [newRide({ kind: 'transfer', from: 'Skopje Airport (SKP)', to: 'Ohrid', stops: 'Matka Canyon, Bitola old town' })],
  },
  {
    label: 'Driver on call all day',
    rides: () => [newRide({ kind: 'hourly', from: 'My hotel in Skopje', hours: '8' })],
  },
]

export function rideTitle(ride: TripRide) {
  if (ride.kind === 'tour') return tourList.find(t => t.slug === ride.tour)?.title ?? 'Custom day tour'
  if (ride.kind === 'hourly') return `Driver for ${ride.hours} hours`
  return ride.from && ride.to ? `${ride.from} → ${ride.to}` : 'Transfer'
}

export function rideProblem(ride: TripRide, now = Date.now()) {
  if (!ride.date || !ride.time) return 'Add a date and time.'
  const at = getPickupTimestamp(ride.date, ride.time)
  if (at === null || at <= now) return 'Pick a date and time in the future.'
  if (ride.from.trim().length < 3) return 'Add a pickup location.'
  if (ride.kind === 'transfer' && ride.to.trim().length < 2) return 'Add a drop-off location.'
  return null
}

export function sortRides(rides: TripRide[]) {
  return [...rides].sort((a, b) => (getPickupTimestamp(a.date, a.time) ?? 0) - (getPickupTimestamp(b.date, b.time) ?? 0))
}

export function itineraryText(rides: TripRide[]) {
  return sortRides(rides)
    .map((ride, i) => {
      const lines = [`Ride ${i + 1} · ${ride.date} ${ride.time} · ${RIDE_KINDS.find(k => k.value === ride.kind)?.label}`, `  ${rideTitle(ride)}`]
      if (ride.kind !== 'transfer' || !ride.to) lines.push(`  Pickup: ${ride.from}`)
      if (ride.stops.trim()) lines.push(`  Stops: ${ride.stops.trim()}`)
      return lines.join('\n')
    })
    .join('\n')
}
