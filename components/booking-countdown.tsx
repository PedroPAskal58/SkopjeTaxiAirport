'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { formatPickupDate, getCountdownParts, getPickupTimestamp } from '@/lib/booking-time'

export function BookingCountdown({ date, time, compact = false, action }: {
  date: string
  time: string
  compact?: boolean
  action?: React.ReactNode
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
    <section aria-label="Booking countdown" className="w-full rounded-2xl border border-border bg-card p-4 text-foreground sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="size-4 shrink-0 text-gold" aria-hidden="true" />
            Pickup in
          </h2>
          <p className="truncate text-xs text-muted-foreground">{formatPickupDate(date, time)}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {remaining?.reached ? (
        <p role="status" className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Your requested pickup time has arrived. Contact your driver for pickup details.
        </p>
      ) : (
        <div role="timer" aria-live="off" aria-label="Time until requested pickup" className="mt-4 grid grid-cols-4 gap-1.5 sm:gap-3">
          {units.map(([label, value]) => (
            <div key={label} className="flex flex-col items-center rounded-xl bg-secondary px-1 py-2.5 text-secondary-foreground sm:py-4">
              <span className="font-sans text-2xl font-semibold tabular-nums tracking-tight sm:text-4xl">{value === undefined ? '—' : String(value).padStart(2, '0')}</span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
