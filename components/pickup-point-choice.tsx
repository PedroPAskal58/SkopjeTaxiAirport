'use client'

import { Building2, Check, Plane } from 'lucide-react'
import { pickupPointLabels, type PickupPoint } from '@/lib/transfers'

const options = [
  { value: 'airport', Icon: Plane, hint: 'Meet & greet at arrivals' },
  { value: 'city', Icon: Building2, hint: 'Your hotel or address' },
] as const

export function PickupPointChoice({
  value,
  onChange,
}: {
  value: PickupPoint
  onChange: (value: PickupPoint) => void
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Where should we pick you up?
        <span className="ml-0.5 text-gold">*</span>
      </legend>
      <div role="radiogroup" className="mt-2 grid grid-cols-2 gap-3">
        {options.map(({ value: option, Icon, hint }) => {
          const active = value === option
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                active
                  ? 'border-gold bg-gold/10 ring-2 ring-gold/30'
                  : 'border-border bg-background hover:border-gold/50'
              }`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                  active ? 'bg-gold text-gold-foreground' : 'bg-secondary text-gold'
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  From {pickupPointLabels[option]}
                </span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </span>
              {active && <Check className="ml-auto size-5 shrink-0 text-gold" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
