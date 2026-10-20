import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'

export const BOOKING_TIME_ZONE = 'Europe/Skopje'

export function getPickupTimestamp(date: string, time: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null
  const local = `${date}T${time}`
  const pickup = fromZonedTime(local, BOOKING_TIME_ZONE)
  if (!Number.isFinite(pickup.getTime())) return null
  // Reject invalid dates and local times skipped by daylight-saving changes.
  if (formatInTimeZone(pickup, BOOKING_TIME_ZONE, "yyyy-MM-dd'T'HH:mm") !== local) return null
  return pickup.getTime()
}

export function getCountdownParts(target: number, now: number) {
  const total = Math.max(0, Math.ceil((target - now) / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    reached: total === 0,
  }
}

export function makeCountdownPreview() {
  const pickup = new Date(Date.now() + ((2 * 24 + 4) * 60 + 24) * 60_000)
  return {
    date: formatInTimeZone(pickup, BOOKING_TIME_ZONE, 'yyyy-MM-dd'),
    time: formatInTimeZone(pickup, BOOKING_TIME_ZONE, 'HH:mm'),
  }
}

export function formatPickupDate(date: string, time: string) {
  const target = getPickupTimestamp(date, time)
  if (target === null) return null
  return formatInTimeZone(target, BOOKING_TIME_ZONE, 'EEE, d MMM yyyy · HH:mm')
}
