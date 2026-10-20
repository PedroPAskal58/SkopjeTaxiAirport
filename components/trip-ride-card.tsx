'use client'

import { ArrowLeftRight, Clock, Compass, Copy, Trash2 } from 'lucide-react'
import { bookingDateBounds } from '@/lib/booking-validation'
import { tourList } from '@/lib/site'
import { RIDE_KINDS, type RideKind, type TripRide } from '@/lib/trip'

const inputCls =
  'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/30'

const kindIcons: Record<RideKind, typeof Compass> = { transfer: ArrowLeftRight, tour: Compass, hourly: Clock }

export function TripRideCard({
  ride,
  index,
  problem,
  canRemove,
  canDuplicate,
  onChange,
  onRemove,
  onDuplicate,
}: {
  ride: TripRide
  index: number
  problem: string | null
  canRemove: boolean
  canDuplicate: boolean
  onChange: (patch: Partial<TripRide>) => void
  onRemove: () => void
  onDuplicate: () => void
}) {
  const bounds = bookingDateBounds()
  const id = (name: string) => `${ride.id}-${name}`

  return (
    <li className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold font-serif text-sm font-semibold text-gold-foreground">
          {index + 1}
        </span>
        <span className="mt-2 w-px flex-1 bg-border" aria-hidden="true" />
      </div>

      <fieldset className="mb-6 min-w-0 flex-1 rounded-2xl border border-border bg-card p-4 md:p-5">
        <legend className="sr-only">Ride {index + 1}</legend>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label={`Ride ${index + 1} type`} className="flex flex-wrap gap-1 rounded-xl bg-secondary/60 p-1">
            {RIDE_KINDS.map(kind => {
              const Icon = kindIcons[kind.value]
              const active = ride.kind === kind.value
              return (
                <button
                  key={kind.value}
                  type="button"
                  aria-pressed={active}
                  title={kind.hint}
                  onClick={() => onChange({ kind: kind.value })}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    active ? 'bg-gold text-gold-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {kind.label}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onDuplicate}
              disabled={!canDuplicate}
              className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-40"
            >
              <Copy className="size-4" aria-hidden="true" />
              <span className="sr-only">Duplicate ride {index + 1}</span>
            </button>
            {canRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                <span className="sr-only">Remove ride {index + 1}</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Label htmlFor={id('date')} text="Date">
            <input id={id('date')} type="date" min={bounds.min} max={bounds.max} value={ride.date} onChange={e => onChange({ date: e.target.value })} className={inputCls} />
          </Label>
          <Label htmlFor={id('time')} text="Pickup time (Skopje)">
            <input id={id('time')} type="time" value={ride.time} onChange={e => onChange({ time: e.target.value })} className={inputCls} />
          </Label>

          {ride.kind === 'tour' && (
            <div className="sm:col-span-2">
              <Label htmlFor={id('tour')} text="Which tour?">
                <select id={id('tour')} value={ride.tour} onChange={e => onChange({ tour: e.target.value })} className={inputCls}>
                  <option value="">I&apos;ll plan my own route</option>
                  {tourList.map(t => (
                    <option key={t.slug} value={t.slug}>
                      {t.title} · from €{t.price}
                    </option>
                  ))}
                </select>
              </Label>
            </div>
          )}

          <Label htmlFor={id('from')} text={ride.kind === 'transfer' ? 'From' : 'Pickup location'}>
            <input id={id('from')} value={ride.from} maxLength={120} onChange={e => onChange({ from: e.target.value })} placeholder="Address, hotel, airport or Google Maps link" className={inputCls} />
          </Label>

          {ride.kind === 'transfer' && (
            <Label htmlFor={id('to')} text="To">
              <input id={id('to')} value={ride.to} maxLength={120} onChange={e => onChange({ to: e.target.value })} placeholder="Where are you going?" className={inputCls} />
            </Label>
          )}
          {ride.kind === 'hourly' && (
            <Label htmlFor={id('hours')} text="How many hours?">
              <select id={id('hours')} value={ride.hours} onChange={e => onChange({ hours: e.target.value })} className={inputCls}>
                {[2, 3, 4, 5, 6, 8, 10, 12].map(h => (
                  <option key={h} value={String(h)}>
                    {h} hours
                  </option>
                ))}
              </select>
            </Label>
          )}
          {ride.kind === 'tour' && <div className="hidden sm:block" aria-hidden="true" />}

          <div className="sm:col-span-2">
            <Label htmlFor={id('stops')} text={ride.kind === 'transfer' ? 'Stops on the way (optional)' : 'Places you want to see (optional)'}>
              <input id={id('stops')} value={ride.stops} maxLength={160} onChange={e => onChange({ stops: e.target.value })} placeholder="e.g. Matka Canyon, lunch in Kruševo" className={inputCls} />
            </Label>
          </div>
        </div>

        {problem && <p className="mt-3 text-sm text-gold">{problem}</p>}
      </fieldset>
    </li>
  )
}

function Label({ htmlFor, text, children }: { htmlFor: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {text}
      </label>
      {children}
    </div>
  )
}
