import { Clock, Tag, PlaneTakeoff, Award, Globe, Star, BadgeCheck } from 'lucide-react'

const items = [
  { icon: Clock, label: 'Available 24/7' },
  { icon: Tag, label: 'Fixed Prices — From €30' },
  { icon: PlaneTakeoff, label: 'Flight Tracking Included' },
  { icon: Award, label: '15+ Years Experience' },
  { icon: Globe, label: 'International Routes' },
  { icon: Star, label: '5-Star Rated Service' },
  { icon: BadgeCheck, label: 'Professional Licensed Drivers' },
]

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-4 px-6 py-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold ring-1 ring-gold/20">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium leading-tight text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
