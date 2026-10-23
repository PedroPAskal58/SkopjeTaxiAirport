'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, MapPin, MessageCircle, Navigation, NotebookPen, Plane, Users } from 'lucide-react'
import { useBookings } from '@/lib/booking-memory'
import { getPickupTimestamp } from '@/lib/booking-time'
import { getBookingFieldRules } from '@/lib/booking-fields'
import { buildBookingChangeHref, type ChangeField } from '@/lib/whatsapp-message'
import type { BookingRecord } from '@/lib/booking-validation'

export function BookingChangeRequest({ id }: { id: string }) {
  const { data, isLoading } = useBookings()
  const booking = data?.find(b => b.id === id)

  return (
    <section className="mx-auto max-w-xl px-4 py-8 sm:px-6 md:py-16">
      <Link href={`/bookings/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to booking
      </Link>
      {isLoading ? (
        <p className="mt-8" role="status">Loading your booking…</p>
      ) : booking ? (
        <ChangeForm booking={booking} />
      ) : (
        <p className="mt-8 text-muted-foreground">Booking not found. Open this page in the browser you used to book.</p>
      )}
    </section>
  )
}

const inputClass = 'h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground'

type FieldConfig = {
  field: ChangeField
  label: string
  icon: typeof Clock
  render: (value: string, set: (v: string) => void) => ReactNode
}

const fields: FieldConfig[] = [
  { field: 'date', label: 'Date', icon: CalendarDays, render: (v, set) => <input type="date" value={v} onChange={e => set(e.target.value)} className={inputClass} /> },
  { field: 'time', label: 'Time', icon: Clock, render: (v, set) => <input type="time" value={v} onChange={e => set(e.target.value)} className={inputClass} /> },
  {
    field: 'passengers',
    label: 'Passengers',
    icon: Users,
    render: (v, set) => (
      <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="New number of passengers">
        {['1', '2', '3', '4'].map(n => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={v === n}
            onClick={() => set(n)}
            className={`h-12 rounded-xl border text-base font-semibold transition ${v === n ? 'border-gold bg-gold/15 text-foreground' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}
          >
            {n}
          </button>
        ))}
      </div>
    ),
  },
  { field: 'pickup', label: 'Pickup', icon: MapPin, render: (v, set) => <input value={v} maxLength={200} onChange={e => set(e.target.value)} placeholder="New pickup address" className={inputClass} /> },
  { field: 'dropoff', label: 'Drop-off', icon: Navigation, render: (v, set) => <input value={v} maxLength={200} onChange={e => set(e.target.value)} placeholder="New drop-off address" className={inputClass} /> },
  { field: 'flight', label: 'Flight number', icon: Plane, render: (v, set) => <input value={v} maxLength={20} onChange={e => set(e.target.value.toUpperCase())} placeholder="e.g. W6 4321" className={inputClass} /> },
  {
    field: 'notes',
    label: 'Notes',
    icon: NotebookPen,
    render: (v, set) => (
      <textarea value={v} maxLength={500} rows={3} onChange={e => set(e.target.value)} placeholder="Luggage, child seat, anything else…" className="w-full rounded-xl border border-input bg-background p-3 text-base leading-relaxed text-foreground" />
    ),
  },
]

function ChangeForm({ booking }: { booking: BookingRecord }) {
  const [selected, setSelected] = useState<Partial<Record<ChangeField, boolean>>>({})
  const [values, setValues] = useState<Record<ChangeField, string>>(() => ({
    date: booking.date ?? '',
    time: booking.time ?? '',
    passengers: booking.passengers ?? '',
    pickup: booking.pickup ?? '',
    dropoff: booking.dropoff ?? '',
    flight: booking.flight ?? '',
    notes: booking.notes ?? '',
  }))

  const rules = getBookingFieldRules(booking)
  const closed = booking.status !== 'requested' && booking.status !== 'approved'
  const past = (getPickupTimestamp(booking.date, booking.time) ?? 0) <= Date.now()

  if (closed || past) {
    return <p className="mt-8 text-muted-foreground">This booking can no longer be changed.</p>
  }

  const changes = Object.fromEntries(
    (Object.keys(selected) as ChangeField[]).filter(f => selected[f]).map(f => [f, values[f]]),
  ) as Partial<Record<ChangeField, string>>
  const { href, count } = buildBookingChangeHref(booking, changes)

  return (
    <div className="mt-6 flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-balance font-serif text-2xl font-semibold sm:text-3xl">What would you like to change?</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tick anything you want to change. We&apos;ll get a short WhatsApp message and update your booking once confirmed.
        </p>
      </header>

      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Changes</legend>
        {fields.filter(({ field }) => {
          if (field === 'dropoff') return rules.showDropoff && !rules.dropoffLocked
          if (field === 'pickup') return !rules.pickupLocked
          if (field === 'flight') return rules.showFlight
          return true
        }).map(({ field, label: defaultLabel, icon: Icon, render }) => {
          const label = field === 'dropoff' ? rules.dropoffLabel : field === 'pickup' ? rules.pickupLabel : defaultLabel
          const on = Boolean(selected[field])
          const current = (booking[field] ?? '').toString().trim()
          return (
            <div key={field} className={`rounded-2xl border bg-card p-4 transition ${on ? 'border-gold/60' : 'border-border'}`}>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={e => setSelected(s => ({ ...s, [field]: e.target.checked }))}
                  className="size-5 shrink-0 accent-gold"
                />
                <Icon className="size-5 shrink-0 text-gold" aria-hidden="true" />
                <span className="font-semibold">{label}</span>
                <span className="ml-auto max-w-[45%] truncate text-sm text-muted-foreground">{current ? `Now ${current}` : 'Not set'}</span>
              </label>
              {on && <div className="mt-4">{render(values[field], v => setValues(prev => ({ ...prev, [field]: v })))}</div>}
            </div>
          )
        })}
      </fieldset>

      {count > 0 ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 text-sm font-semibold text-whatsapp-foreground transition hover:bg-whatsapp/90"
        >
          <MessageCircle className="size-5" aria-hidden="true" /> Send {count === 1 ? 'change' : `${count} changes`} on WhatsApp
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm font-semibold text-muted-foreground"
        >
          <MessageCircle className="size-5" aria-hidden="true" /> Tick and edit what you want to change
        </button>
      )}
    </div>
  )
}
