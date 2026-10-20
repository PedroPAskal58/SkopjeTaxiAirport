'use client'

import { bookingDateBounds } from '@/lib/booking-validation'

const fieldClass = 'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-gold focus:ring-2 focus:ring-gold/30'

export function BookingScheduleFields({ date, time, passengers, onChange }: {
  date: string; time: string; passengers: string
  onChange: (field: 'date' | 'time' | 'passengers', value: string) => void
}) {
  const bounds = bookingDateBounds()
  return <>
    <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-muted-foreground">Date *</span>
      <input required type="date" min={bounds.min} max={bounds.max} value={date} onChange={e => onChange('date', e.target.value)} className={fieldClass} />
    </label>
    <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-muted-foreground">Time (Skopje) *</span>
      <input required type="time" value={time} onChange={e => onChange('time', e.target.value)} className={fieldClass} />
    </label>
    <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold text-muted-foreground">Passengers *</span>
      <select required value={passengers} onChange={e => onChange('passengers', e.target.value)} className={fieldClass}>
        <option value="">Select passengers</option>
        {[1, 2, 3, 4].map(count => <option key={count} value={String(count)}>{count} {count === 1 ? 'passenger' : 'passengers'}</option>)}
      </select>
      <span className="text-sm text-muted-foreground">Maximum 4 passengers per booking.</span>
    </label>
  </>
}
