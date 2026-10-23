'use client'

import { useRef, useState } from 'react'
import { BookingPhoneField } from '@/components/booking-phone-field'
import { BookingScheduleFields } from '@/components/booking-schedule-fields'
import { validateBookingDetails } from '@/lib/booking-validation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Users,
  Briefcase,
  Check,
  Phone,
  MessageCircle,
  ArrowLeft,
  CalendarClock,
  Clock,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { site, vehicles, tours, type VehicleSlug, type TourSlug } from '@/lib/site'
import { buildCustomerMessage } from '@/lib/whatsapp-message'
import {
  getTransfer,
  hasPickupPointChoice,
  hasLockedAirportPickup,
  pickupPointLabels,
  SKOPJE_AIRPORT_PICKUP,
  type PickupPoint,
} from '@/lib/transfers'
import { PickupPointChoice } from '@/components/pickup-point-choice'
import { saveBooking } from '@/lib/booking-memory'

const vehicleImages: Record<VehicleSlug, string> = {
  mondeo: '/images/fleet-mondeo.png',
  kia: '/images/fleet-kia.png',
  van: '/images/fleet-van.png',
}

type Subject =
  | {
      kind: 'vehicle'
      label: string
      title: string
      subtitle: string
      image: string
      seats: string
      luggage: string
    }
  | {
      kind: 'tour'
      label: string
      title: string
      subtitle: string
      image: string
      pax: string
      duration: string
      price: number
      about: string
      highlights: string[]
    }
  | {
      kind: 'custom'
      label: string
      title: string
      subtitle: string
      image: string
    }
  | {
      kind: 'transfer'
      label: string
      title: string
      subtitle: string
      image: string
      from: string
      to: string
      price: number
      distance: string
      duration: string
      description: string
    }
  | {
      kind: 'customTransfer'
      label: string
      title: string
      subtitle: string
      image: string
    }

export function ReserveForm({
  car,
  tour,
  customTour,
  customTransfer,
  transfer: transferSlug,
}: {
  car?: VehicleSlug
  tour?: TourSlug
  customTour?: boolean
  customTransfer?: boolean
  transfer?: string
}) {
  const transfer = transferSlug ? getTransfer(transferSlug) : undefined
  const comfortCars: VehicleSlug[] = ['mondeo', 'kia']
  const carOptions = comfortCars
  const initialCar: VehicleSlug = car && (!transfer || car !== 'van') ? car : 'mondeo'
  const isVehicle = !tour && !customTour && !customTransfer && !transfer
  const canChooseCar = !!transfer || !!tour || !!customTour || !!customTransfer
  const [chosenCar, setChosenCar] = useState<VehicleSlug>(initialCar)
  const [vehicleLocked, setVehicleLocked] = useState(!!car || !isVehicle)

  const subject: Subject = transfer
    ? {
        kind: 'transfer',
        label: 'transfer',
        title: transfer.route,
        subtitle: `Private transfer · ${transfer.tag}`,
        image: transfer.image,
        from: transfer.from,
        to: transfer.to,
        price: transfer.price,
        distance: transfer.distance,
        duration: transfer.duration,
        description: transfer.description,
      }
    : customTransfer
    ? {
        kind: 'customTransfer',
        label: 'custom transfer',
        title: 'Custom Transfer Request',
        subtitle: 'Tailor-made private ride',
        image: '/images/transfer-airport.png',
      }
    : customTour
    ? {
        kind: 'custom',
        label: 'custom tour',
        title: 'Custom Tour Request',
        subtitle: 'Tailor-made day trip',
        image: '/images/tour-matka.png',
      }
    : tour
      ? (() => {
          const t = tours[tour]
          return {
            kind: 'tour',
            label: 'tour',
            title: t.title,
            subtitle: t.tag,
            image: t.image,
            pax: t.pax,
            duration: t.duration,
            price: t.price,
            about: t.about,
            highlights: t.highlights,
          }
        })()
      : (() => {
          const v = vehicles[chosenCar]
          return {
            kind: 'vehicle',
            label: 'vehicle',
            title: v.name,
            subtitle: v.type,
            image: vehicleImages[v.slug],
            seats: v.seats,
            luggage: v.luggage,
          }
        })()

  const isCustom = subject.kind === 'custom'
  const isCustomTransfer = subject.kind === 'customTransfer'
  const isTour = subject.kind === 'tour' || subject.kind === 'custom'
  const isTransfer = subject.kind === 'transfer'
  const isTransferRequest = isTransfer || isCustomTransfer
  const kindWord = isTour ? 'tour' : isTransferRequest ? 'transfer' : 'vehicle'

  const showPickupChoice = hasPickupPointChoice(transfer)
  const pickupLocked = isTransfer && hasLockedAirportPickup(transfer)
  const [pickupPoint, setPickupPoint] = useState<PickupPoint>('city')
  const fromLabel = showPickupChoice ? pickupPointLabels[pickupPoint] : transfer?.from

  function choosePickupPoint(point: PickupPoint) {
    setPickupPoint(point)
    setForm((prev) => ({
      ...prev,
      pickup: point === 'airport' ? SKOPJE_AIRPORT_PICKUP : '',
    }))
  }

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    pickup: showPickupChoice
      ? ''
      : hasLockedAirportPickup(transfer)
        ? SKOPJE_AIRPORT_PICKUP
        : transfer?.from ?? '',
    dropoff: transfer?.to ?? '',
    destination: '',
    date: '',
    time: '',
    passengers: '',
    flight: '',
    notes: '',
  })
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const requestId = useRef<string | null>(null)

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function buildMessage(bookingId?: string) {
    const car = vehicles[chosenCar]
    const vehicle = car ? `${car.name} (${car.type})` : ''
    const common = {
      name: form.name,
      phone: form.phone,
      bookingId: bookingId || undefined,
    }

    if (subject.kind === 'custom') {
      return buildCustomerMessage({
        ...common,
        intro: `I'd like to arrange a custom tour${form.destination.trim() ? ` to ${form.destination.trim()}` : ''}.`,
        details: [
          ['Date', form.date],
          ['Time', form.time],
          ['Passengers', form.passengers],
          ['Pickup / hotel', form.pickup],
          ['Vehicle', vehicle],
          ['Notes', form.notes],
        ],
      })
    }

    if (subject.kind === 'tour') {
      return buildCustomerMessage({
        ...common,
        intro: `I'd like to book the tour "${subject.title}" (from €${subject.price}, ${subject.duration}).`,
        details: [
          ['Date', form.date],
          ['Time', form.time],
          ['Passengers', form.passengers],
          ['Pickup / hotel', form.pickup],
          ['Vehicle', vehicle],
          ['Notes', form.notes],
        ],
      })
    }

    const intro =
      subject.kind === 'transfer'
        ? `I'd like to book a transfer: ${subject.title} (from €${subject.price}).`
        : subject.kind === 'customTransfer'
          ? `I'd like to request a private transfer.`
          : `I'd like to reserve a ${subject.title} (${subject.subtitle}).`

    return buildCustomerMessage({
      ...common,
      intro,
      details: [
        ['Date', form.date],
        ['Time', form.time],
        ['Passengers', form.passengers],
        ['Pickup', form.pickup],
        ['Drop-off', form.dropoff],
        ['Flight', form.flight],
        ['Vehicle', subject.kind === 'transfer' || subject.kind === 'customTransfer' ? vehicle : ''],
        ['Notes', form.notes],
      ],
    })
  }

  const subjectName = subject.title

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void persist('web')
  }

  async function persist(channel: 'web' | 'whatsapp') {
    if (saving) return
    setSubmitError('')
    try {
      const details = validateBookingDetails({ ...form, dropoff: form.destination || form.dropoff })
      requestId.current ??= crypto.randomUUID()
      const id = requestId.current
      // Open the tab synchronously so mobile browsers don't treat it as a blocked popup.
      if (channel === 'whatsapp') window.open(`${site.whatsapp}?text=${encodeURIComponent(buildMessage(id))}`, '_blank', 'noopener,noreferrer')
      setSaving(true)
      const booking = await saveBooking({
        ...details, id, channel,
        key: transferSlug ? `transfer:${transferSlug}` : customTransfer ? 'transfer:custom' : customTour ? 'tour:custom' : tour ? `tour:${tour}` : `car:${chosenCar}`,
        title: subject.title, car: chosenCar,
      })
      router.replace(`/bookings/${booking.id}`)
    } catch (error) { setSubmitError(error instanceof Error ? error.message : 'Please try again.') }
    finally { setSaving(false) }
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <Link
        href={
          transfer
            ? `/transfers/${transfer.slug}`
            : isCustomTransfer
              ? '/transfers'
              : isTour
                ? '/tours'
                : '/fleet'
        }
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {transfer
          ? 'Back to this transfer'
          : isCustomTransfer
            ? 'Back to transfers'
            : isTour
              ? 'Back to tours'
              : 'Back to the fleet'}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Subject summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-gold/40 bg-card luxury-glow">
            <div className="relative aspect-[16/10] bg-secondary">
              <Image
                src={subject.image || '/placeholder.svg'}
                alt={`${subject.title} ${isCustomTransfer ? 'transfer' : isTour ? 'tour' : 'reserved vehicle'}`}
                fill
                className="object-cover"
                priority
              />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                <Check className="size-3.5" aria-hidden="true" />
                {isCustomTransfer
                  ? 'Tell us your route'
                  : isCustom
                    ? 'Tell us your dream trip'
                    : isTour
                      ? 'You are booking this tour'
                    : isTransfer
                      ? 'You are booking this transfer'
                      : 'You are reserving this car'}
              </span>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                {subject.subtitle}
              </p>
              <h2 className="mt-1.5 font-serif text-2xl font-semibold text-foreground">
                {subject.title}
              </h2>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {subject.kind === 'vehicle' ? (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-4 text-gold" aria-hidden="true" /> {subject.seats}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="size-4 text-gold" aria-hidden="true" /> {subject.luggage}
                    </span>
                  </>
                ) : subject.kind === 'transfer' ? (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-gold" aria-hidden="true" /> {subject.distance}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4 text-gold" aria-hidden="true" /> {subject.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      from €{subject.price}
                    </span>
                  </>
                ) : subject.kind === 'tour' ? (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-4 text-gold" aria-hidden="true" /> {subject.pax}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4 text-gold" aria-hidden="true" /> {subject.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-gold" aria-hidden="true" /> from €{subject.price}
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 text-gold" aria-hidden="true" /> Private, fully
                    tailor-made
                  </span>
                )}
              </div>
              {subject.kind === 'transfer' && (
                <div className="mt-5 border-t border-border pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                    Your booking
                  </p>
                  <dl className="mt-3 grid gap-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">From</dt>
                      <dd className="text-right font-medium text-foreground">{fromLabel}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">To</dt>
                      <dd className="text-right font-medium text-foreground">{subject.to}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Vehicle</dt>
                      <dd className="text-right font-medium text-foreground">
                        {vehicles[chosenCar].name}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Price from</dt>
                      <dd className="text-right font-semibold text-gold">€{subject.price}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {subject.description}
                  </p>
                </div>
              )}
              {subject.kind === 'tour' && (
                <div className="mt-5 border-t border-border pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                    About this trip
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {subject.about}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {subject.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-4 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                <CalendarClock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                Prices are fixed on confirmation, but may vary slightly with current fuel prices.
                We&apos;ll confirm your exact fare when we reply.
              </p>
            </div>
          </div>
        </aside>

        {/* Form / confirmation */}
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <>
              <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
                {isCustomTransfer ? (
                  <>
                    Request a <span className="text-gold">private transfer</span>
                  </>
                ) : (
                  <>
                    {isTour || isTransfer ? 'Book ' : 'Reserve the '}
                    {isTour && 'the '}
                    <span className="text-gold">{subjectName}</span>
                  </>
                )}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {isCustomTransfer
                  ? 'Share your pickup and drop-off details and we’ll confirm availability and a fixed price.'
                  : (
                    <>
                      Fill in your trip details below. Your request is tagged to{' '}
                      <strong className="text-foreground">{subjectName}</strong> so we always know exactly
                      which {kindWord} you booked.
                    </>
                  )}
              </p>

              {isVehicle && !car && !vehicleLocked ? (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Choose your car
                  </p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {carOptions.map((slug) => {
                      const v = vehicles[slug]
                      const active = chosenCar === slug
                      return (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => setChosenCar(slug)}
                          aria-pressed={active}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                            active
                              ? 'border-gold bg-gold/10 ring-2 ring-gold/30'
                              : 'border-border bg-background hover:border-gold/50'
                          }`}
                        >
                          <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                            <Image src={vehicleImages[slug]} alt={v.name} fill className="object-cover" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {v.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">{v.type}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">{v.seats}</span>
                          </span>
                          {active && <Check className="ml-auto size-5 shrink-0 text-gold" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                  <Button
                    type="button"
                    onClick={() => setVehicleLocked(true)}
                    className="mt-5 w-full bg-gold text-gold-foreground hover:bg-gold/90"
                  >
                    Lock in {vehicles[chosenCar].name}
                  </Button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                {canChooseCar && (
                  <div className="sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Choose your car
                    </span>
                    <div
                      className={`mt-2 grid gap-3 ${transfer ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
                    >
                      {carOptions.map((slug) => {
                        const v = vehicles[slug]
                        const active = chosenCar === slug
                        return (
                          <button
                            key={slug}
                            type="button"
                            onClick={() => setChosenCar(slug)}
                            aria-pressed={active}
                            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                              active
                                ? 'border-gold bg-gold/10 ring-2 ring-gold/30'
                                : 'border-border bg-background hover:border-gold/50'
                            }`}
                          >
                            <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                              <Image
                                src={vehicleImages[slug] || '/placeholder.svg'}
                                alt={v.name}
                                fill
                                className="object-cover"
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-foreground">
                                {v.name}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {v.type}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {v.seats}
                              </span>
                            </span>
                            {active && (
                              <Check className="ml-auto size-5 shrink-0 text-gold" aria-hidden="true" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                <Field label="Full name" required>
                  <input
                    required
                    value={form.name}
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    onChange={update('name')}
                    className={inputCls}
                    placeholder="Your name"
                  />
                </Field>
                <BookingPhoneField value={form.phone} onChange={phone => setForm(previous => ({ ...previous, phone }))} />
                <Field label="Email address" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    maxLength={254}
                    autoComplete="email"
                    inputMode="email"
                    onChange={update('email')}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </Field>
                {showPickupChoice && (
                  <PickupPointChoice
                    value={pickupPoint}
                    onChange={choosePickupPoint}
                    address={form.pickup}
                    onAddressChange={(pickup) => setForm((prev) => ({ ...prev, pickup }))}
                  />
                )}
                {!showPickupChoice && (
                  <Field label={isTour ? 'Pickup / hotel' : 'Pickup location'} required>
                    <input
                      required
                      readOnly={pickupLocked}
                      aria-readonly={pickupLocked}
                      value={pickupLocked ? SKOPJE_AIRPORT_PICKUP : form.pickup}
                      onChange={pickupLocked ? undefined : update('pickup')}
                      className={
                        pickupLocked
                          ? `${inputCls} cursor-not-allowed border-border bg-secondary text-muted-foreground`
                          : inputCls
                      }
                      placeholder={isTour ? 'e.g. Your hotel in Skopje' : 'e.g. Skopje Airport (SKP)'}
                    />
                  </Field>
                )}
                {!isTour && (
                  <Field label="Drop-off location" required={!isTransfer}>
                    <input
                      required={!isTransfer}
                      readOnly={isTransfer}
                      value={isTransfer ? subject.to : form.dropoff}
                      onChange={isTransfer ? undefined : update('dropoff')}
                      className={
                        isTransfer
                          ? `${inputCls} cursor-not-allowed border-border bg-secondary text-muted-foreground`
                          : inputCls
                      }
                      placeholder="e.g. City center hotel"
                      aria-readonly={isTransfer}
                    />
                  </Field>
                )}
                {isCustom && (
                  <div className="sm:col-span-2">
                    <Field label="Where would you like to go?" required>
                      <input
                        required
                        value={form.destination}
                        onChange={update('destination')}
                        className={inputCls}
                        placeholder="e.g. Ohrid, Bitola & Heraclea, or a multi-day trip"
                      />
                    </Field>
                  </div>
                )}
                <BookingScheduleFields date={form.date} time={form.time} passengers={form.passengers} onChange={(field, value) => setForm(previous => ({ ...previous, [field]: value }))} />
                {!isTour && (
                  <Field label="Flight number">
                    <input
                      value={form.flight}
                      onChange={update('flight')}
                      className={inputCls}
                      placeholder={
                        showPickupChoice && pickupPoint === 'airport'
                          ? 'e.g. W6 4321, so we can track your landing'
                          : 'Optional'
                      }
                    />
                  </Field>
                )}
                <div className="sm:col-span-2">
                  <Field label="Notes">
                    <textarea
                      value={form.notes}
                      onChange={update('notes')}
                      rows={3}
                      className={`${inputCls} resize-y`}
                      placeholder={
                        isTour
                          ? 'Preferred language, dietary needs, anything else...'
                          : showPickupChoice && pickupPoint === 'city'
                            ? 'Your hotel or address in Skopje, child seat, extra luggage...'
                            : 'Child seat, extra luggage, anything else...'
                      }
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2 mt-2 flex flex-col gap-3">
                  {submitError && <p role="alert" className="text-sm text-foreground">{submitError}</p>}
                  <Button type="submit" disabled={saving} aria-busy={saving} className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
                    <MessageCircle className="size-5" aria-hidden="true" />
                    {saving ? 'Saving request…' : isCustomTransfer
                      ? 'Send transfer request'
                      : isTour
                        ? 'Send tour booking request'
                        : isTransfer
                          ? 'Send transfer booking request'
                          : 'Send reservation request'}
                  </Button>
                  <Button
                    type="button"
                    disabled={saving}
                    onClick={(e) => {
                      if (e.currentTarget.form?.reportValidity()) void persist('whatsapp')
                    }}
                    className="w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
                  >
                    <MessageCircle className="size-5" aria-hidden="true" />
                    Send on WhatsApp
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <a href={site.phoneHref}>
                      <Phone className="size-5" aria-hidden="true" />
                      Prefer to call? {site.phoneDisplay}
                    </a>
                  </Button>
                </div>
              </form>
              )}
            </>
        </div>
      </div>
    </section>
  )
}

const inputCls =
  'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/30'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </span>
      {children}
    </label>
  )
}
