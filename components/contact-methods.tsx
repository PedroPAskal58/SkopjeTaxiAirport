import { ArrowUpRight, Clock, Mail, MessageCircle, Phone, PhoneCall } from 'lucide-react'
import { site } from '@/lib/site'

const secondary = [
  { icon: Phone, label: 'Call us', note: 'Any hour, any day', value: site.phoneDisplay, href: site.phoneHref },
  { icon: PhoneCall, label: 'Viber', note: 'Same number', value: site.phoneDisplay, href: site.viber },
  { icon: Mail, label: 'Email', note: 'Quotes & group trips', value: site.email, href: `mailto:${site.email}` },
]

export function ContactMethods() {
  return (
    <div className="flex flex-col gap-4">
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-gold/40 bg-card p-6 luxury-glow transition hover:border-gold md:p-8"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-gold" />
            </span>
            Fastest reply
          </span>
          <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden="true" />
        </div>
        <div className="flex items-end gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold text-gold-foreground">
            <MessageCircle className="size-7" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Chat on WhatsApp</p>
            <p className="font-serif text-2xl font-semibold text-foreground md:text-3xl">{site.phoneDisplay}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Send your flight number and destination — we usually answer within a few minutes, even at night.
        </p>
      </a>

      <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
        {secondary.map(item => (
          <li key={item.label}>
            <a href={item.href} className="flex items-center gap-4 p-4 transition hover:bg-secondary/60 md:px-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-gold">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                <span className="block text-xs text-muted-foreground">{item.note}</span>
              </span>
              <span className="truncate text-right text-sm font-medium text-foreground">{item.value}</span>
            </a>
          </li>
        ))}
        <li className="flex items-center gap-4 p-4 md:px-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-gold">
            <Clock className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">Working hours</span>
            <span className="block text-xs text-muted-foreground">Bookings & pickups</span>
          </span>
          <span className="text-sm font-medium text-gold">24 / 7</span>
        </li>
      </ul>
    </div>
  )
}
