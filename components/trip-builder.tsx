'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, MessageCircle, Phone, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingPhoneField } from '@/components/booking-phone-field'
import { TripCarPicker } from '@/components/trip-car-picker'
import { TripRideCard } from '@/components/trip-ride-card'
import { validateBookingDetails } from '@/lib/booking-validation'
import { saveBooking, trackWhatsAppOpened } from '@/lib/booking-memory'
import { site, vehicles, type VehicleSlug } from '@/lib/site'
import { buildCustomerMessage } from '@/lib/whatsapp-message'
import { MAX_RIDES, TRIP_IDEAS, itineraryText, newRide, rideProblem, rideTitle, sortRides, type TripRide } from '@/lib/trip'

const inputCls =
  'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/30'

const STEPS = ['Choose your car', 'Build your trip', 'Your details']

export function TripBuilder() {
  const [step, setStep] = useState(0)
  const [car, setCar] = useState<VehicleSlug | null>(null)
  const [rides, setRides] = useState<TripRide[]>(() => [newRide()])
  const [showProblems, setShowProblems] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', passengers: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState('')
  const requestId = useRef<string | null>(null)

  const problems = rides.map(ride => rideProblem(ride))
  const ridesReady = problems.every(p => !p)
  const vehicle = car ? vehicles[car] : undefined
  const ordered = sortRides(rides)
  const itinerary = itineraryText(rides)

  function goTo(next: number) {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateRide(id: string, patch: Partial<TripRide>) {
    setRides(current => current.map(r => (r.id === id ? { ...r, ...patch } : r)))
  }

  function addRide(from = '') {
    setRides(current => (current.length >= MAX_RIDES ? current : [...current, newRide({ from })]))
  }

  const message = buildCustomerMessage({
    intro: `I'd like to plan a custom trip with ${rides.length} ${rides.length === 1 ? 'ride' : 'rides'}:\n\n${itinerary}`,
    details: [
      ['Passengers', form.passengers],
      ['Vehicle', vehicle ? `${vehicle.name} (${vehicle.type})` : ''],
      ['Notes', form.notes],
    ],
    name: form.name,
    phone: form.phone,
    bookingId: savedId || undefined,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setError('')
    const first = ordered[0]
    const last = ordered[ordered.length - 1]
    const notes = `CUSTOM TRIP (${rides.length} ${rides.length === 1 ? 'ride' : 'rides'})\n${itinerary}${form.notes.trim() ? `\n\nNotes: ${form.notes.trim()}` : ''}`
    if (notes.length > 2000) {
      setError('Your trip is a bit long for one request. Please shorten the notes or stops.')
      return
    }
    try {
      const details = validateBookingDetails({
        name: form.name,
        phone: form.phone,
        email: form.email,
        passengers: form.passengers,
        date: first.date,
        time: first.time,
        pickup: first.from,
        dropoff: last.kind === 'transfer' ? last.to : last.from,
        flight: '',
        notes,
      })
      setSaving(true)
      requestId.current ??= crypto.randomUUID()
      const booking = await saveBooking({
        ...details,
        id: requestId.current,
        key: 'trip:custom',
        title: `Custom trip · ${rides.length} ${rides.length === 1 ? 'ride' : 'rides'}`,
        car: car ?? undefined,
      })
      setSavedId(booking.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to home
      </Link>

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Custom tours &amp; transfers</p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">Build your trip</h1>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Pick your car, then add every ride you need: airport pickups, city-to-city transfers, day tours or a driver by the hour, across as many days as you like. We reply with one fixed price for the whole trip. No prepayment, no card.
        </p>
      </header>

      <nav aria-label="Trip progress" className="mt-8">
        <ol className="grid grid-cols-3 gap-2">
          {STEPS.map((label, i) => (
            <li key={label} aria-current={i === step ? 'step' : undefined}>
              <span className={`block h-1.5 rounded-full transition-colors ${i === step ? 'bg-gold' : i < step ? 'bg-gold/50' : 'bg-secondary'}`} />
              <span className={`mt-2 flex items-center gap-1.5 text-xs sm:text-sm ${i === step ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                {i < step && <Check className="size-3.5 text-gold" aria-hidden="true" />}
                {label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10">
        {step === 0 && (
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">Which car would you like?</h2>
            <p className="mt-1 text-sm text-muted-foreground">The same car and driver stay with you for every ride in your trip.</p>
            <div className="mt-6">
              <TripCarPicker value={car} onChange={setCar} />
            </div>
            <div className="mt-8 flex justify-end">
              <Button type="button" disabled={!car} onClick={() => goTo(1)} className="bg-gold text-gold-foreground hover:bg-gold/90">
                Continue <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">Your rides</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Any location works, even a pasted Google Maps link.</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="size-4 text-gold" aria-hidden="true" /> Start from an idea
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TRIP_IDEAS.map(idea => (
                    <button
                      key={idea.label}
                      type="button"
                      onClick={() => {
                        setRides(idea.rides())
                        setShowProblems(false)
                      }}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:border-gold hover:text-foreground"
                    >
                      {idea.label}
                    </button>
                  ))}
                </div>
              </div>

              <ol className="mt-6">
                {rides.map((ride, i) => (
                  <TripRideCard
                    key={ride.id}
                    ride={ride}
                    index={i}
                    problem={showProblems ? problems[i] : null}
                    canRemove={rides.length > 1}
                    canDuplicate={rides.length < MAX_RIDES}
                    onChange={patch => updateRide(ride.id, patch)}
                    onRemove={() => setRides(current => current.filter(r => r.id !== ride.id))}
                    onDuplicate={() => setRides(current => {
                      if (current.length >= MAX_RIDES) return current
                      const at = current.findIndex(r => r.id === ride.id)
                      const { id: _id, ...rest } = ride
                      const copy = newRide({ ...rest, date: '' })
                      return [...current.slice(0, at + 1), copy, ...current.slice(at + 1)]
                    })}
                  />
                ))}
              </ol>

              <button
                type="button"
                disabled={rides.length >= MAX_RIDES}
                onClick={() => {
                  const last = rides[rides.length - 1]
                  addRide(last?.kind === 'transfer' ? last.to : last?.from ?? '')
                }}
                className="ml-13 flex w-[calc(100%-3.25rem)] items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition hover:border-gold hover:text-foreground disabled:opacity-50"
              >
                <Plus className="size-4" aria-hidden="true" />
                {rides.length >= MAX_RIDES ? `Up to ${MAX_RIDES} rides per request` : 'Add another ride'}
              </button>

              <div className="mt-8 flex items-center justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => goTo(0)} className="bg-transparent">
                  <ArrowLeft className="size-4" aria-hidden="true" /> Back
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (ridesReady) goTo(2)
                    else setShowProblems(true)
                  }}
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                >
                  Continue <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <TripSummary vehicleName={vehicle?.name} rides={ordered} onChangeCar={() => goTo(0)} />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              {savedId ? (
                <div className="flex flex-col items-start gap-4">
                  <span className="grid size-12 place-items-center rounded-full bg-gold/15 text-gold">
                    <Check className="size-6" aria-hidden="true" />
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">Trip request saved</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We&apos;ll check your routes and reply with one fixed price for the whole trip, usually within 30 minutes. Send it on WhatsApp too for the fastest answer.
                  </p>
                  <div className="flex w-full flex-col gap-3 sm:flex-row">
                    <Button asChild className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90">
                      <a href={`${site.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" onClick={() => void trackWhatsAppOpened(savedId)}>
                        <MessageCircle className="size-5" aria-hidden="true" /> Send on WhatsApp
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <a href={`mailto:${site.email}?subject=${encodeURIComponent('Custom trip request')}&body=${encodeURIComponent(message)}`}>Send by email instead</a>
                    </Button>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/bookings/${savedId}`}>View or change request</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">Where should we send your price?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Free quote. You only confirm if you like the price.</p>
                  <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field id="trip-name" label="Full name">
                      <input id="trip-name" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className={inputCls} />
                    </Field>
                    <BookingPhoneField value={form.phone} onChange={phone => setForm(f => ({ ...f, phone }))} />
                    <Field id="trip-email" label="Email address">
                      <input id="trip-email" required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className={inputCls} />
                    </Field>
                    <Field id="trip-passengers" label="Passengers">
                      <select id="trip-passengers" required value={form.passengers} onChange={e => setForm(f => ({ ...f, passengers: e.target.value }))} className={inputCls}>
                        <option value="">Select passengers</option>
                        {[1, 2, 3, 4].map(n => (
                          <option key={n} value={String(n)}>
                            {n} {n === 1 ? 'passenger' : 'passengers'}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <div className="sm:col-span-2">
                      <Field id="trip-notes" label="Anything else? (optional)" optional>
                        <textarea id="trip-notes" rows={3} maxLength={600} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Child seat, flight numbers, extra luggage, language..." className={`${inputCls} resize-y`} />
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3 sm:col-span-2">
                      {error && <p role="alert" className="text-sm text-gold">{error}</p>}
                      <Button type="submit" disabled={saving} aria-busy={saving} className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
                        {saving ? 'Sending request…' : 'Get my free quote'}
                      </Button>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button type="button" variant="outline" onClick={() => goTo(1)} className="flex-1 bg-transparent">
                          <ArrowLeft className="size-4" aria-hidden="true" /> Edit rides
                        </Button>
                        <Button asChild variant="outline" className="flex-1 bg-transparent">
                          <a href={site.phoneHref}>
                            <Phone className="size-4" aria-hidden="true" /> {site.phoneDisplay}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>

            <TripSummary vehicleName={vehicle?.name} rides={ordered} onChangeCar={savedId ? undefined : () => goTo(0)} />
          </div>
        )}
      </div>
    </section>
  )
}

function TripSummary({ vehicleName, rides, onChangeCar }: { vehicleName?: string; rides: TripRide[]; onChangeCar?: () => void }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Trip summary">
      <div className="rounded-3xl border border-gold/40 bg-card p-5 luxury-glow">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">Your trip</p>
        <div className="mt-3 flex items-center justify-between gap-3 border-b border-border pb-3 text-sm">
          <span className="text-muted-foreground">Car</span>
          <span className="flex items-center gap-2 font-medium text-foreground">
            {vehicleName}
            {onChangeCar && (
              <button type="button" onClick={onChangeCar} className="text-xs font-normal text-muted-foreground underline underline-offset-4 hover:text-foreground">
                Change
              </button>
            )}
          </span>
        </div>
        <ol className="mt-3 flex flex-col gap-3">
          {rides.map((ride, i) => (
            <li key={ride.id} className="flex gap-3 text-sm">
              <span className="font-serif font-semibold text-gold">{i + 1}</span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-foreground">{rideTitle(ride)}</span>
                <span className="text-xs text-muted-foreground">{ride.date && ride.time ? `${ride.date} · ${ride.time}` : 'Date not set yet'}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
          One fixed price for everything: fuel, tolls, border crossings and waiting time included. Pay the driver on the day.
        </p>
      </div>
    </aside>
  )
}

function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
        {!optional && <span className="ml-0.5 text-gold">*</span>}
      </label>
      {children}
    </div>
  )
}
