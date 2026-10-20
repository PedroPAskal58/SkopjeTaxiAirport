import { TriangleAlert } from 'lucide-react'

export type ItineraryItem = {
  title: string
  text: string
}

export function Itinerary({ steps, important }: { steps: ItineraryItem[]; important?: string }) {
  return (
    <section className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">Step by step</p>
      <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground">Itinerary</h2>
      <ol className="mt-5">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
            {index < steps.length - 1 && (
              <span aria-hidden="true" className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-border" />
            )}
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/10 text-sm font-semibold text-gold ring-1 ring-gold/30"
            >
              {index + 1}
            </span>
            <div className="pt-1">
              <p className="font-semibold leading-snug text-foreground">{step.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      {important && (
        <p className="mt-6 flex gap-3 rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm leading-relaxed text-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
          <span>
            <span className="font-semibold text-gold">Important:</span> {important}
          </span>
        </p>
      )}
    </section>
  )
}
