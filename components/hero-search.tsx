'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ChevronDown, Compass, MapPin, PlaneLanding, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

type TransferOption = { slug: string; from: string; to: string; price: number }
type TourOption = { slug: string; title: string; price: number }

type Mode = 'transfer' | 'tour'

const selectClass =
  'w-full cursor-pointer appearance-none truncate bg-transparent pr-8 text-base font-medium text-foreground outline-none [&>option]:bg-card [&>option]:text-foreground'

function Field({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string
  label: string
  icon: typeof MapPin
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col gap-1 px-5 py-4 transition focus-within:bg-secondary/60">
      <label htmlFor={id} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </label>
      <div className="relative">
        {children}
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export function HeroSearch({ transfers, tours }: { transfers: TransferOption[]; tours: TourOption[] }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('transfer')

  const pickups = useMemo(() => Array.from(new Set(transfers.map((t) => t.from))), [transfers])
  const [from, setFrom] = useState(pickups[0] ?? '')
  const destinations = useMemo(() => transfers.filter((t) => t.from === from), [transfers, from])
  const [transferSlug, setTransferSlug] = useState(destinations[0]?.slug ?? '')
  const [tourSlug, setTourSlug] = useState(tours[0]?.slug ?? '')

  const selectedTransfer = transfers.find((t) => t.slug === transferSlug)
  const selectedTour = tours.find((t) => t.slug === tourSlug)

  function handlePickupChange(value: string) {
    setFrom(value)
    const first = transfers.find((t) => t.from === value)
    setTransferSlug(first?.slug ?? '')
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mode === 'transfer') {
      router.push(`/reserve?transfer=${encodeURIComponent(transferSlug || 'custom')}`)
    } else {
      router.push(`/reserve?tour=${encodeURIComponent(tourSlug || 'custom')}`)
    }
  }

  const tabs: { id: Mode; label: string; icon: typeof MapPin }[] = [
    { id: 'transfer', label: 'Private transfers', icon: PlaneLanding },
    { id: 'tour', label: 'Day tours', icon: Compass },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Find your transfer or tour"
      className="overflow-hidden rounded-2xl border border-gold/25 bg-card text-card-foreground shadow-2xl shadow-background/60"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5">
        <div role="tablist" aria-label="Booking type" className="flex gap-6">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = mode === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(id)}
                className={cn(
                  '-mb-px inline-flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition',
                  active
                    ? 'border-gold text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className={cn('size-4', active && 'text-gold')} aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>
        <p className="hidden items-center gap-2 text-sm text-muted-foreground md:inline-flex">
          <ShieldCheck className="size-4 text-gold" aria-hidden="true" />
          Your plans. Your pace. Your private driver.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border md:flex-row md:items-stretch md:divide-x md:divide-y-0">
        {mode === 'transfer' ? (
          <>
            <Field id="hero-pickup" label="Pickup location" icon={PlaneLanding}>
              <select
                id="hero-pickup"
                value={from}
                onChange={(e) => handlePickupChange(e.target.value)}
                className={selectClass}
              >
                {pickups.map((p) => (
                  <option key={p} value={p}>
                    {p === 'Skopje Airport' ? 'Skopje Airport (SKP)' : p}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="hero-destination" label="Where to?" icon={MapPin}>
              <select
                id="hero-destination"
                value={transferSlug}
                onChange={(e) => setTransferSlug(e.target.value)}
                className={selectClass}
              >
                {destinations.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.to}
                  </option>
                ))}
                <option value="custom">Somewhere else</option>
              </select>
            </Field>
          </>
        ) : (
          <Field id="hero-tour" label="Choose a day tour" icon={Compass}>
            <select
              id="hero-tour"
              value={tourSlug}
              onChange={(e) => setTourSlug(e.target.value)}
              className={selectClass}
            >
              {tours.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.title}
                </option>
              ))}
              <option value="custom">Plan a custom tour</option>
            </select>
          </Field>
        )}

        <div className="flex items-center p-4 md:pl-5">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 text-base font-semibold text-gold-foreground shadow-lg shadow-gold/20 transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-card md:w-auto"
          >
            {mode === 'transfer' ? 'Find my transfer' : 'Book this tour'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-secondary/40 px-5 py-3 text-xs text-muted-foreground">
        <span>No prepayment needed. Just a little planning.</span>
        <span>
          {mode === 'transfer'
            ? selectedTransfer
              ? <>{selectedTransfer.from} to {selectedTransfer.to} <strong className="text-foreground">from €{selectedTransfer.price}</strong> / car</>
              : 'We quote custom routes with a fixed price'
            : selectedTour
              ? <>This tour <strong className="text-foreground">from €{selectedTour.price}</strong></>
              : 'Tell us your ideas and we plan the day'}
        </span>
      </div>
    </form>
  )
}
