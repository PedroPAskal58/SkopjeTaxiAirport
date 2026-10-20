import { Snowflake, ShieldCheck, MessageSquare, Baby, Wifi } from 'lucide-react'

const features = [
  {
    icon: Snowflake,
    title: 'Clean, air-conditioned cars',
    text: 'A modern, well-maintained fleet kept spotless for every ride, hot or cold.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & licensed drivers',
    text: 'Fully licensed, insured, and experienced professional drivers you can trust.',
  },
  {
    icon: MessageSquare,
    title: 'English-speaking drivers',
    text: 'Communicate easily — our drivers speak English and know the routes.',
  },
  {
    icon: Baby,
    title: 'Child seats on request',
    text: 'Travelling with little ones? Request a child seat free of charge when booking.',
  },
  {
    icon: Wifi,
    title: 'Free Wi-Fi & water',
    text: 'Stay connected and refreshed on longer transfers and day trips.',
  },
]

export function Comfort() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Why ride with us</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Your Comfort, Our Priority
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every detail is handled so you can relax from the moment you land.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 transition hover:border-gold/60 hover:bg-card/80"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/20">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
