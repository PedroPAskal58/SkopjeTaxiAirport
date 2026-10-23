'use client'

import { useEffect, useState } from 'react'
import { getCountdownParts, getPickupTimestamp } from '@/lib/booking-time'

export function useCountdownLabel(date?: string, time?: string) {
  const target = date ? getPickupTimestamp(date, time ?? '') : null
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    if (target === null) return
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [target])

  if (target === null || now === null) return null
  const parts = getCountdownParts(target, now)
  if (parts.reached) return 'now'
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${parts.days}d ${pad(parts.hours)}h ${pad(parts.minutes)}m ${pad(parts.seconds)}s`
}
