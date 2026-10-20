'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, MapPin, Navigation, Plane } from 'lucide-react'
import { transfers } from '@/lib/site'
import { places, toStops } from '@/lib/route-places'
import { JourneyMap } from '@/components/journey-map'
import { cn } from '@/lib/utils'

const destinations = transfers.filter((transfer) => places[transfer.to])

export function RouteExplorer() {
  const [selectedSlug, setSelectedSlug] = useState('skopje-ohrid')
  const transfer = destinations.find((item) => item.slug === selectedSlug) ?? destinations[0]
  const fromName = 'Skopje Airport'
  const stops = useMemo(() => toStops([fromName, transfer.to]), [transfer.to])

  return (
    <section id="routes" className="scroll-mt-16 border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Route map</p>
          <h2 className="mt-2 text-balance font-serif text-3xl font-semibold text-foreground md:text-4xl">
            See Exactly Where You&apos;re Going
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Pick a destination to see the road your driver will take, from the arrivals hall to your door.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pickup from</p>
              <p className="mt-2 flex items-center gap-2.5 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-semibold text-foreground">
                <Plane className="size-4 text-gold" aria-hidden="true" />
                {fromName}
              </p>
            </div>

            <div>
              <p id="destination-label" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Going to
              </p>
              <ul
                aria-labelledby="destination-label"
                className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
              >
                {destinations.map((item) => {
                  const active = item.slug === transfer.slug
                  return (
                    <li key={item.slug} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedSlug(item.slug)}
                        aria-pressed={active}
                        className={cn(
                          'flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition',
                          active
                            ? 'border-gold bg-gold/10 text-foreground'
                            : 'border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground',
                        )}
                      >
                        <span className="flex items-center gap-2.5 whitespace-nowrap text-sm font-semibold">
                          <MapPin className={cn('size-4', active ? 'text-gold' : 'text-muted-foreground')} aria-hidden="true" />
                          {item.to}
                        </span>
                        <span className="whitespace-nowrap text-sm font-semibold text-gold">€{item.price}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <JourneyMap stops={stops} className="h-[360px] md:h-[460px]" />

            <div className="flex flex-col gap-4 border-t border-border p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex flex-wrap items-center gap-2 font-serif text-lg font-semibold text-foreground">
                  {fromName}
                  <ArrowRight className="size-4 text-gold" aria-hidden="true" />
                  {transfer.to}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Navigation className="size-3.5 text-gold" aria-hidden="true" /> {transfer.distance}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-gold" aria-hidden="true" /> {transfer.duration}
                  </span>
                  <span className="font-semibold text-foreground">€{transfer.price} per car</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/transfers/${transfer.slug}`}
                  className="text-sm font-semibold text-gold hover:underline"
                >
                  Route details
                </Link>
                <Link
                  href={`/reserve?transfer=${transfer.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-sm transition hover:gap-2.5 hover:brightness-90"
                >
                  Book this ride <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
