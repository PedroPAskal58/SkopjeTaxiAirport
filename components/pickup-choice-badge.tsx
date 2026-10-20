import { Building2, Plane } from 'lucide-react'

export function PickupChoiceBadge({ className = '' }: { className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold ${className}`}
    >
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        <Plane className="size-3.5" />
        <span className="text-gold/50">/</span>
        <Building2 className="size-3.5" />
      </span>
      Pickup at Skopje Airport or in the city
    </p>
  )
}

export function PickupChoiceCallout() {
  return (
    <div className="mt-5 rounded-xl border border-gold/30 bg-gold/5 p-4">
      <p className="text-sm font-semibold text-foreground">Two pickup options</p>
      <ul className="mt-3 space-y-2.5 text-sm">
        <li className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
            <Plane className="size-4" aria-hidden="true" />
          </span>
          <span className="leading-tight text-muted-foreground">
            <span className="block font-medium text-foreground">Skopje Airport</span>
            Meet & greet at arrivals
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
            <Building2 className="size-4" aria-hidden="true" />
          </span>
          <span className="leading-tight text-muted-foreground">
            <span className="block font-medium text-foreground">Skopje City</span>
            From your hotel or address
          </span>
        </li>
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">Same price. Choose when you book.</p>
    </div>
  )
}
