'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { formatPickupDate, getCountdownParts, getPickupTimestamp } from '@/lib/booking-time'

export function BookingCountdown({ date, time, compact = false }: {
  date: string
  time: string
  compact?: boolean
}) {
  const target = getPickupTimestamp(date, time)
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    if (target === null) return
    setNow(Date.now())
    if (target <= Date.now()) return
    const timer = window.setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= target) window.clearInterval(timer)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [target])

  if (target === null) {
    return <p className="text-sm text-muted-foreground">Add a valid pickup date and time to start your countdown.</p>
  }

  const remaining = now === null ? null : getCountdownParts(target, now)
  const units = [
    ['Days', remaining?.days],
    ['Hours', remaining?.hours],
    ['Minutes', remaining?.minutes],
    ['Seconds', remaining?.seconds],
  ] as const

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
        <Clock className="size-4 shrink-0 text-gold" aria-hidden="true" />
        {remaining?.reached ? (
          <span role="status">Your pickup time has arrived</span>
        ) : (
          <>
            <span className="text-muted-foreground">Pickup in</span>
            <span role="timer" aria-live="off" aria-label="Time until requested pickup" className="font-semibold tabular-nums">
              {remaining ? `${remaining.days}d ${String(remaining.hours).padStart(2, '0')}h ${String(remaining.minutes).padStart(2, '0')}m ${String(remaining.seconds).padStart(2, '0')}s` : 'Calculating…'}
            </span>
          </>
        )}
      </div>
    )
  }

  return (
    <section aria-label="Booking countdown" className="w-full rounded-2xl border border-gold/30 bg-background p-5 text-foreground sm:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-gold">
        <Clock className="size-4" aria-hidden="true" />
        <h2>Countdown to your pickup</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {formatPickupDate(date, time)} · Skopje time
      </p>
      <div className="py-5">
        <div role="timer" aria-live="off" aria-label="Time until requested pickup" className="grid grid-cols-4 gap-2 sm:gap-3">
          {units.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-secondary py-4 text-center text-secondary-foreground">
              <span className="block font-sans text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">{value === undefined ? '—' : String(value).padStart(2, '0')}</span>
              <span className="block text-sm leading-6 text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p role="status" className="text-sm leading-relaxed text-muted-foreground">
        {remaining?.reached
          ? 'Your requested pickup time has arrived. Contact your driver for pickup details.'
          : 'Counting down to your requested time. Your booking still needs confirmation on WhatsApp.'}
      </p>
    </section>
  )
}
