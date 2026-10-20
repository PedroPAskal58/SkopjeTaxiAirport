'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, ArrowRight, ArrowLeftRight, MapPinPlus } from 'lucide-react'
import { transfers } from '@/lib/site'
import { getTransferTagStyle } from '@/lib/transfer-tags'
import { BookButton } from '@/components/book-button'
import { PickupChoiceBadge } from '@/components/pickup-choice-badge'
import { hasPickupPointChoice } from '@/lib/transfers'

type Transfer = (typeof transfers)[number]

const filters: { id: string; label: string; match: (t: Transfer) => boolean }[] = [
  { id: 'all', label: 'All routes', match: () => true },
  {
    id: 'airport',
    label: 'Airport',
    match: (t) => t.from.includes('Airport') || t.to.includes('Airport'),
  },
  { id: 'domestic', label: 'Domestic', match: (t) => t.tag !== 'Border crossing' },
  { id: 'border', label: 'Border crossing', match: (t) => t.tag === 'Border crossing' },
]

export function Transfers({ showFilters = false }: { showFilters?: boolean }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const matcher = filters.find((f) => f.id === activeFilter)?.match ?? (() => true)
  const visibleTransfers = transfers.filter(matcher)

  return (
    <section id="transfers" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Private transfers</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Fixed-Price Routes & Airport Pickups
          </h2>
          <p className="mt-3 text-muted-foreground">
            Door-to-door private rides across the Balkans — one clear price per car, no hidden fees.
          </p>
        </div>

        {showFilters && (
          <div
            role="group"
            aria-label="Filter routes"
            className="mt-10 flex flex-wrap justify-center gap-2"
          >
            {filters.map((filter) => {
              const active = filter.id === activeFilter
              const count = transfers.filter(filter.match).length
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                    active
                      ? 'bg-gold text-gold-foreground ring-gold'
                      : 'bg-card text-muted-foreground ring-border hover:text-foreground hover:ring-gold/40'
                  }`}
                >
                  {filter.label}
                  <span
                    className={`rounded-full px-1.5 text-xs ${
                      active ? 'bg-gold-foreground/15' : 'bg-secondary'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <div className={`${showFilters ? 'mt-8' : 'mt-12'} grid gap-5 sm:grid-cols-2 lg:grid-cols-3`}>
          {visibleTransfers.map((transfer) => (
            <article
              key={transfer.slug}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                    getTransferTagStyle(transfer.tag)
                  }`}
                >
                  {transfer.tag}
                </span>
                <div className="text-right leading-tight">
                  <span className="text-xl font-semibold text-foreground">€{transfer.price}</span>
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    per car
                  </span>
                </div>
              </div>

              <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-gold">
                <Link
                  href={`/transfers/${transfer.slug}`}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                >
                  {transfer.route.split('–').map((place, index) => (
                    <span key={place} className="inline-flex items-center gap-2">
                      {index > 0 && (
                        <ArrowLeftRight className="size-4 shrink-0 text-gold" aria-hidden="true" />
                      )}
                      {place.trim()}
                    </span>
                  ))}
                </Link>
              </h3>

              <Link
                href={`/transfers/${transfer.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="relative isolate mt-4 block aspect-[2/1] cursor-pointer overflow-hidden rounded-xl bg-secondary"
              >
                <Image
                  src={transfer.image}
                  alt={transfer.alt}
                  fill
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end gap-2 p-3 text-xs font-medium text-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/75 px-2.5 py-1 backdrop-blur-sm">
                    <MapPin className="size-3.5 text-gold" aria-hidden="true" /> {transfer.distance}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/75 px-2.5 py-1 backdrop-blur-sm">
                    <Clock className="size-3.5 text-gold" aria-hidden="true" /> {transfer.duration}
                  </span>
                </div>
              </Link>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {transfer.description}
              </p>

              {hasPickupPointChoice(transfer) && <PickupChoiceBadge className="mt-4 self-start" />}

              <div className="mt-5 flex items-center justify-between gap-3">
                <BookButton
                  href={`/reserve?transfer=${transfer.slug}`}
                  bookingKey={`transfer:${transfer.slug}`}
                  className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-sm transition hover:gap-2.5 hover:brightness-75"
                >
                  Book transfer <ArrowRight className="size-4" aria-hidden="true" />
                </BookButton>
                <span className="text-sm font-semibold text-gold group-hover:underline">
                  Read more
                </span>
              </div>
            </article>
          ))}

          <Link
            href="/reserve?transfer=custom"
            className="group flex min-h-[250px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gold/40 bg-card/50 p-8 text-center transition hover:border-gold hover:bg-card"
          >
            <span className="grid size-14 place-items-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/20 transition group-hover:bg-gold/25">
              <MapPinPlus className="size-7" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Need a different route?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Tell us your pickup and drop-off locations and we&apos;ll arrange a private transfer.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition group-hover:gap-2.5">
              Request a transfer <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
