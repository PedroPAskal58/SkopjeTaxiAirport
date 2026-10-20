'use client'

import Image from 'next/image'
import { Briefcase, Check, Clock, Users } from 'lucide-react'
import { vehicles, type VehicleSlug } from '@/lib/site'

const vehicleImages: Record<VehicleSlug, string> = {
  mondeo: '/images/fleet-mondeo.png',
  kia: '/images/fleet-kia.png',
  van: '/images/fleet-van.png',
}

const vehicleOrder: VehicleSlug[] = ['mondeo', 'kia', 'van']

export function TripCarPicker({ value, onChange }: { value: VehicleSlug | null; onChange: (car: VehicleSlug) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicleOrder.map(slug => {
        const v = vehicles[slug]
        const active = value === slug
        const soon = slug === 'van'
        return (
          <button
            key={slug}
            type="button"
            onClick={() => !soon && onChange(slug)}
            disabled={soon}
            aria-pressed={active}
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
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
              <span className="block font-serif text-lg font-semibold text-foreground">{v.name}</span>
              <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-gold">{v.type}</span>
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
  )
}
