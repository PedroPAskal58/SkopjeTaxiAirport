import Link from 'next/link'
import { PlaneTakeoff, Mail, Phone, MessageCircle, MapPin } from 'lucide-react'
import { site, footerNav } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-gold text-gold-foreground">
              <PlaneTakeoff className="size-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-lg font-semibold">
              Skopje Airport <span className="text-gold">Taxi</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
            Reliable private airport transfers and day tours across Macedonia. Fixed prices,
            professional drivers and 24/7 availability — your comfortable ride starts the moment you
            land.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-primary-foreground/75">
            <MapPin className="size-4 text-gold" aria-hidden="true" />
            Skopje International Airport (SKP), North Macedonia
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-primary-foreground/75 transition hover:text-primary-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">Contact & Booking</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-2 text-primary-foreground/75 transition hover:text-primary-foreground">
                <Phone className="size-4" aria-hidden="true" /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary-foreground/75 transition hover:text-primary-foreground">
                <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp / Viber
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-primary-foreground/75 transition hover:text-primary-foreground">
                <Mail className="size-4" aria-hidden="true" /> {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-primary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Skopje Airport Taxi. All rights reserved.</p>
          <p>Available 24/7 · Fixed prices · Licensed drivers</p>
        </div>
      </div>
    </footer>
  )
}
