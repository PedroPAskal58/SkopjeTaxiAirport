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
  ArrowRight,
  Clock,
  MapPin,
  Car,
  Compass,
  ArrowLeftRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { site, vehicles, tourList, transfers, type VehicleSlug } from '@/lib/site'
import { buildCustomerMessage } from '@/lib/whatsapp-message'
import { saveBooking } from '@/lib/booking-memory'
import { BookingCountdownPreview } from '@/components/booking-countdown-preview'
import { PickupPointChoice } from '@/components/pickup-point-choice'
import {
  hasPickupPointChoice,
  hasLockedAirportPickup,
  pickupPointLabels,
  SKOPJE_AIRPORT_PICKUP,
  type PickupPoint,
} from '@/lib/transfers'

const vehicleImages: Record<VehicleSlug, string> = {
  mondeo: '/images/fleet-mondeo.png',
  kia: '/images/fleet-kia.png',
  van: '/images/fleet-van.png',
}

const vehicleOrder: VehicleSlug[] = ['mondeo', 'kia', 'van']

type ServiceType = 'tour' | 'transfer'

const inputCls =
  'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/30'

export function BookingFlow({ initialCar }: { initialCar?: VehicleSlug }) {
  const [step, setStep] = useState(initialCar ? 2 : 1)
  const [chosenCar, setChosenCar] = useState<VehicleSlug | null>(initialCar ?? null)
  const [serviceType, setServiceType] = useState<ServiceType>('tour')
  const [tourSlug, setTourSlug] = useState<string | null>(null)
  const [transferSlug, setTransferSlug] = useState<string | null>(null)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const requestId = useRef<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: '',
    flight: '',
    notes: '',
  })

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const selectedTour = tourSlug ? tourList.find((t) => t.slug === tourSlug) : undefined
  const selectedTransfer = transferSlug ? transfers.find((t) => t.slug === transferSlug) : undefined
  const car = chosenCar ? vehicles[chosenCar] : undefined
  const [pickupPoint, setPickupPoint] = useState<PickupPoint>('city')
  const showPickupChoice = serviceType === 'transfer' && hasPickupPointChoice(selectedTransfer)
  const airportPickup = showPickupChoice && pickupPoint === 'airport'
  const pickupLocked = serviceType === 'transfer' && hasLockedAirportPickup(selectedTransfer)

  function choosePickupPoint(point: PickupPoint) {
    setPickupPoint(point)
    setForm((prev) => ({
      ...prev,
      pickup: point === 'airport' ? SKOPJE_AIRPORT_PICKUP : '',
    }))
  }

  const serviceChosen =
    (serviceType === 'tour' && !!selectedTour) || (serviceType === 'transfer' && !!selectedTransfer)

  function buildMessage(bookingId?: string) {
    const isTransferBooking = serviceType === 'transfer'
    const intro = isTransferBooking
      ? `I'd like to book a transfer: ${selectedTransfer?.route ?? ''} (from €${selectedTransfer?.price ?? ''}).`
      : `I'd like to book the tour "${selectedTour?.title ?? ''}" (from €${selectedTour?.price ?? ''}, ${selectedTour?.duration ?? ''}).`

    return buildCustomerMessage({
      intro,
      details: [
        ['Date', form.date],
        ['Time', form.time],
        ['Passengers', form.passengers],
        ['Pickup', form.pickup],
        ['Drop-off', isTransferBooking ? selectedTransfer?.to ?? form.dropoff : ''],
        ['Flight', isTransferBooking ? form.flight : ''],
        ['Vehicle', car ? `${car.name} (${car.type})` : ''],
        ['Notes', form.notes],
      ],
      name: form.name,
      phone: form.phone,
      bookingId: bookingId || undefined,
    })
  }

  const subjectName =
    serviceType === 'tour' ? selectedTour?.title ?? '' : selectedTransfer?.route ?? ''


  async function persist(channel: 'web' | 'whatsapp') {
    if (saving) return
    setSubmitError('')
    try {
      const details = validateBookingDetails({ ...form, dropoff: serviceType === 'transfer' ? selectedTransfer?.to ?? form.dropoff : '' })
      requestId.current ??= crypto.randomUUID()
      const id = requestId.current
      // Open the tab synchronously so mobile browsers don't treat it as a blocked popup.
      if (channel === 'whatsapp') window.open(`${site.whatsapp}?text=${encodeURIComponent(buildMessage(id))}`, '_blank', 'noopener,noreferrer')
      setSaving(true)
      const booking = await saveBooking({
        ...details, id, channel,
        key: serviceType === 'tour' ? `tour:${tourSlug}` : `transfer:${transferSlug}`,
        title: subjectName, car: chosenCar ?? undefined,
      })
      router.replace(`/bookings/${booking.id}`)
    } catch (error) { setSubmitError(error instanceof Error ? error.message : 'Please try again.') }
    finally { setSaving(false) }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void persist('web')
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to home
      </Link>

      <div className="mt-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
          Book your ride
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {initialCar
            ? `Your ${vehicles[initialCar].name} is selected. Choose a tour or transfer, then send us your details.`
            : 'Choose your car, pick a tour or a transfer, and send us the details.'}{' '}
          We&apos;ll confirm availability and your fixed price on WhatsApp within minutes.
        </p>
      </div>

      <BookingCountdownPreview />

      {/* Stepper */}
      {(() => {
        const steps = initialCar
          ? [
              { n: 2, label: 'Tour or transfer' },
              { n: 3, label: 'Your details' },
            ]
          : [
              { n: 1, label: 'Choose your car' },
              { n: 2, label: 'Tour or transfer' },
              { n: 3, label: 'Your details' },
            ]
        const currentIndex = Math.max(
          0,
          steps.findIndex((s) => s.n === step),
        )
        return (
          <nav aria-label="Booking progress" className="mt-8">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Step {currentIndex + 1} of {steps.length}
              </p>
              <p className="text-sm font-medium text-foreground sm:hidden">
                {steps[currentIndex].label}
              </p>
            </div>
            <ol className={`mt-3 grid gap-2 ${steps.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {steps.map((s, i) => {
                const active = i === currentIndex
                const done = i < currentIndex
                return (
                  <li key={s.n} aria-current={active ? 'step' : undefined}>
                    <span
                      className={`block h-1.5 rounded-full transition-colors ${
                        active ? 'bg-gold' : done ? 'bg-gold/50' : 'bg-secondary'
                      }`}
                    />
                    <span
                      className={`mt-2 hidden items-center gap-1.5 text-sm sm:flex ${
                        active ? 'font-medium text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {done && <Check className="size-3.5 text-gold" aria-hidden="true" />}
                      {s.label}
                    </span>
                    <span className="sr-only sm:hidden">
                      {s.label}
                      {done ? ' (completed)' : active ? ' (current)' : ''}
                    </span>
                  </li>
                )
              })}
            </ol>
          </nav>
        )
      })()}

      <div className="mt-8">
        {/* STEP 1 — vehicle */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold">
              <Car className="size-4" aria-hidden="true" /> Step 1 · Choose your car
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vehicleOrder.map((slug) => {
                const v = vehicles[slug]
                const active = chosenCar === slug
                const soon = slug === 'van'
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => !soon && setChosenCar(slug)}
                    disabled={soon}
                    aria-pressed={active}
                    aria-disabled={soon}
                    className={`overflow-hidden rounded-2xl border text-left transition ${
                      soon
                        ? 'cursor-not-allowed border-border opacity-70'
                        : active
                          ? 'border-gold ring-2 ring-gold/30 luxury-glow'
                          : 'border-border hover:border-gold/50'
                    }`}
                  >
                    <span className="relative block aspect-[16/10] bg-secondary">
                      <Image
                        src={vehicleImages[slug] || '/placeholder.svg'}
                        alt={v.name}
                        fill
                        className={`object-cover ${soon ? 'opacity-40 grayscale' : ''}`}
                      />
                      {soon ? (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border backdrop-blur">
                          <Clock className="size-3.5" aria-hidden="true" /> Coming soon
                        </span>
                      ) : (
                        active && (
                          <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-gold text-gold-foreground">
                            <Check className="size-4" aria-hidden="true" />
                          </span>
                        )
                      )}
                    </span>
                    <span className="block p-4">
                      <span className="block font-serif text-lg font-semibold text-foreground">
                        {v.name}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-gold">
                        {v.type}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="size-4 text-gold" aria-hidden="true" /> {v.seats}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="size-4 text-gold" aria-hidden="true" /> {v.luggage}
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                disabled={!chosenCar}
                onClick={() => setStep(2)}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Continue <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 — service */}
        {step === 2 && (
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              What are you booking?
            </h2>

            <div
              role="group"
              aria-label="Booking type"
              className="mt-4 grid grid-cols-2 gap-1 rounded-2xl border border-border bg-secondary/40 p-1"
            >
              {(
                [
                  { value: 'tour', label: 'Day tour', Icon: Compass },
                  { value: 'transfer', label: 'Transfer', Icon: ArrowLeftRight },
                ] as const
              ).map(({ value, label, Icon }) => {
                const active = serviceType === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setServiceType(value)}
                    aria-pressed={active}
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-gold text-gold-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {label}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
              {serviceType === 'tour'
                ? 'Explore North Macedonia with your own private driver. Pick a tour below.'
                : 'Airport or city-to-city, door to door. Pick your route below.'}
            </p>

            {/* Options list */}
            <div className="mt-6 grid grid-cols-1 gap-3">
              {serviceType === 'tour'
                ? tourList.map((tour) => {
                    const active = tourSlug === tour.slug
                    return (
                      <button
                        key={tour.slug}
                        type="button"
                        onClick={() => setTourSlug(tour.slug)}
                        aria-pressed={active}
                        className={`flex w-full min-w-0 items-center gap-4 rounded-2xl border p-3 text-left transition ${
                          active
                            ? 'border-gold bg-gold/10 ring-2 ring-gold/30'
                            : 'border-border hover:border-gold/50'
                        }`}
                      >
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <Image
                            src={tour.image || '/placeholder.svg'}
                            alt={tour.alt}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-medium uppercase tracking-wide text-gold">
                            {tour.tag}
                          </span>
                          <span className="block line-clamp-2 font-semibold leading-snug text-foreground">
                            {tour.title}
                          </span>
                          <span className="mt-0.5 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3.5 text-gold" aria-hidden="true" />
                              {tour.duration}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3.5 text-gold" aria-hidden="true" /> from €
                              {tour.price}
                            </span>
                          </span>
                        </span>
                        {active && (
                          <Check className="size-5 shrink-0 text-gold" aria-hidden="true" />
                        )}
                      </button>
                    )
                  })
                : transfers.map((transfer) => {
                    const active = transferSlug === transfer.slug
                    return (
                      <button
                        key={transfer.slug}
                        type="button"
                        onClick={() => setTransferSlug(transfer.slug)}
                        aria-pressed={active}
                        className={`flex w-full min-w-0 items-center gap-4 rounded-2xl border p-3 text-left transition ${
                          active
                            ? 'border-gold bg-gold/10 ring-2 ring-gold/30'
                            : 'border-border hover:border-gold/50'
                        }`}
                      >
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <Image
                            src={transfer.image || '/placeholder.svg'}
                            alt={transfer.alt}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-medium uppercase tracking-wide text-gold">
                            {transfer.tag}
                          </span>
                          <span className="block line-clamp-2 font-semibold leading-snug text-foreground">
                            {transfer.route}
                          </span>
                          <span className="mt-0.5 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3.5 text-gold" aria-hidden="true" />
                              {transfer.duration}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3.5 text-gold" aria-hidden="true" /> from €
                              {transfer.price}
                            </span>
                          </span>
                        </span>
                        {active && (
                          <Check className="size-5 shrink-0 text-gold" aria-hidden="true" />
                        )}
                      </button>
                    )
                  })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              {initialCar ? (
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/fleet">
                    <ArrowLeft className="size-4" aria-hidden="true" /> Back to fleet
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="bg-transparent"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" /> Back
                </Button>
              )}
              <Button
                type="button"
                disabled={!serviceChosen}
                onClick={() => {
                  const pickupChoice =
                    serviceType === 'transfer' && hasPickupPointChoice(selectedTransfer)
                  if (pickupChoice) setPickupPoint('city')
                  setForm((prev) => ({
                    ...prev,
                          pickup: pickupChoice
                            ? ''
                            : hasLockedAirportPickup(selectedTransfer)
                              ? SKOPJE_AIRPORT_PICKUP
                              : selectedTransfer?.from ?? prev.pickup,
                    dropoff: selectedTransfer?.to ?? prev.dropoff,
                  }))
                  setStep(3)
                }}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Continue <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 — details */}
        {step === 3 && (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-gold/40 bg-card luxury-glow">
                <div className="relative aspect-[16/10] bg-secondary">
                  <Image
                    src={
                      (serviceType === 'tour' ? selectedTour?.image : selectedTransfer?.image) ||
                      '/placeholder.svg'
                    }
                    alt={subjectName}
                    fill
                    className="object-cover"
                    priority
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                    <Check className="size-3.5" aria-hidden="true" />
                    {serviceType === 'tour' ? 'You are booking this tour' : 'You are booking this transfer'}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                    {serviceType === 'tour' ? selectedTour?.tag : selectedTransfer?.tag}
                  </p>
                  <h2 className="mt-1.5 font-serif text-2xl font-semibold text-foreground">
                    {subjectName}
                  </h2>
                  <dl className="mt-4 grid gap-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Vehicle</dt>
                      <dd className="text-right font-medium text-foreground">{car?.name}</dd>
                    </div>
                    {showPickupChoice && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Pickup from</dt>
                        <dd className="text-right font-medium text-foreground">
                          {pickupPointLabels[pickupPoint]}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Duration</dt>
                      <dd className="text-right font-medium text-foreground">
                        {serviceType === 'tour' ? selectedTour?.duration : selectedTransfer?.duration}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Price from</dt>
                      <dd className="text-right font-semibold text-gold">
                        €{serviceType === 'tour' ? selectedTour?.price : selectedTransfer?.price}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="mt-5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Change tour / transfer
                  </button>
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <>
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gold">
                    Step {initialCar ? 2 : 3} · Your details
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                    Book the <span className="text-gold">{subjectName}</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your request is tagged to the <strong className="text-foreground">{car?.name}</strong>{' '}
                    and this {serviceType}, so we always know exactly what you booked and when.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
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
                      <Field label={serviceType === 'tour' ? 'Pickup / hotel' : 'Pickup location'} required>
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
                          placeholder={
                            serviceType === 'tour' ? 'e.g. Your hotel in Skopje' : 'e.g. Skopje Airport (SKP)'
                          }
                        />
                      </Field>
                    )}
                    {serviceType === 'transfer' && selectedTransfer && (
                      <Field label="Drop-off location">
                        <input
                          readOnly
                          aria-readonly="true"
                          value={selectedTransfer.to}
                          className={`${inputCls} cursor-not-allowed border-border bg-secondary text-muted-foreground`}
                        />
                      </Field>
                    )}
                    <BookingScheduleFields date={form.date} time={form.time} passengers={form.passengers} onChange={(field, value) => setForm(previous => ({ ...previous, [field]: value }))} />
                    {serviceType === 'transfer' && (
                      <Field label="Flight number">
                        <input
                          value={form.flight}
                          onChange={update('flight')}
                          className={inputCls}
                          placeholder={
                            airportPickup ? 'e.g. W6 4321, so we can track your landing' : 'Optional'
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
                            serviceType === 'tour'
                              ? 'Preferred language, dietary needs, anything else...'
                              : 'Child seat, extra luggage, anything else...'
                          }
                        />
                      </Field>
                    </div>

                    <div className="sm:col-span-2 mt-2 flex flex-col gap-3">
                      {submitError && <p role="alert" className="text-sm text-foreground">{submitError}</p>}
                      <Button
                        disabled={saving}
                        aria-busy={saving}
                        type="submit"
                        className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                      >
                        <MessageCircle className="size-5" aria-hidden="true" />
                        {saving ? 'Saving request…' : 'Book now'}
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
                </>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

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
