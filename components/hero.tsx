import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Clock,
  HeartHandshake,
  MapPin,
  PlaneLanding,
  Sparkles,
  Star,
} from 'lucide-react'
import { HeroSearch } from '@/components/hero-search'
import { site, tourList } from '@/lib/site'
import { transfers } from '@/lib/transfers'

const promises = [
  { icon: BadgeCheck, title: 'One price. No surprises.', detail: 'Fixed fares, agreed in advance' },
  { icon: PlaneLanding, title: 'We follow your flight.', detail: "Early or late, we'll be there" },
  { icon: HeartHandshake, title: 'Local people. Real care.', detail: 'Friendly, English-speaking drivers' },
  { icon: Clock, title: 'Every hour. Every day.', detail: 'Here for you, around the clock' },
]

export function Hero() {
  const transferOptions = transfers.map(({ slug, from, to, price }) => ({ slug, from, to, price }))
  const tourOptions = tourList.map(({ slug, title, price }) => ({ slug, title, price }))

  return (
    <section id="top" aria-labelledby="hero-title" className="relative bg-background text-foreground">
      <div className="relative isolate overflow-hidden">
        <Image
          src="/images/ohrid-editorial-hero.png"
          alt="The Church of Saint John at Kaneo above Lake Ohrid, North Macedonia"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[65%_center]"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-background/85 via-background/45 to-background/0"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-background/80 to-transparent"
          aria-hidden="true"
        />

        <p
          className="absolute right-5 top-16 hidden text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/70 [writing-mode:vertical-rl] lg:block"
          aria-hidden="true"
        >
          Less ordinary. More Macedonia.
        </p>

        <div className="mx-auto flex min-h-[calc(100svh-61px)] w-full max-w-6xl flex-col justify-center gap-10 px-6 pb-48 pt-16 md:pb-52 md:pt-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/85">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              A local welcome. A world of discovery.
            </p>

            <h1
              id="hero-title"
              className="mt-6 font-serif text-5xl font-normal leading-[0.95] tracking-tight [filter:drop-shadow(0_2px_12px_rgb(0_0_0/0.5))] sm:text-6xl lg:text-7xl"
            >
  <span className="block text-balance">Your journey.</span>
  <span className="mt-2 block italic text-gold-gradient">Our home.</span>
            </h1>

            <p className="mt-7 max-w-md text-pretty text-lg leading-relaxed text-foreground/85">
              Private transfers. Unforgettable day trips. Discover North Macedonia with people who
              call it home.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/tours"
                className="inline-flex h-12 items-center gap-3 rounded-lg bg-gold px-6 text-base font-semibold text-gold-foreground shadow-lg shadow-gold/20 transition hover:brightness-95"
              >
                Explore our day tours
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="#find-transfer"
                className="inline-flex items-center gap-2 border-b border-foreground/50 pb-1 text-sm font-medium transition hover:border-gold hover:text-gold"
              >
                Just need a ride?
                <ArrowDown className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <Link
              href="/reviews"
              className="mt-7 inline-flex items-center gap-3 text-sm transition hover:text-gold"
            >
              <span className="flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-gold text-gold" aria-hidden="true" />
                ))}
              </span>
              <span>
                <strong className="font-semibold">{site.rating}/5</strong> from {site.reviewCount} happy
                travellers
              </span>
            </Link>
          </div>

          <div className="flex max-w-sm flex-col gap-4 lg:items-end">
            <Link
              href="/tours/ohrid"
              className="group flex flex-col gap-3 rounded-2xl border border-foreground/20 bg-foreground/5 p-5 shadow-xl shadow-background/30 ring-1 ring-inset ring-foreground/10 backdrop-blur-xl backdrop-saturate-150 transition hover:border-gold/50 hover:bg-foreground/10"
            >
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Featured tour
              </span>
              <span className="font-serif text-2xl font-semibold leading-tight">Skopje to Ohrid</span>
              <span className="text-sm leading-relaxed text-foreground/80">
                The photo behind you. A private day trip to Lake Ohrid, a UNESCO World Heritage city
                on one of Europe&apos;s oldest lakes, with time at Saint John at Kaneo and the old town.
              </span>
              <span className="flex items-center justify-between gap-4 border-t border-foreground/15 pt-3 text-sm">
                <span className="text-foreground/75">
                  from <strong className="text-base text-foreground">€200</strong>
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-gold">
                  View tour
                  <ArrowUpRight
                    className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </Link>
            <p className="flex flex-col gap-0.5 text-sm lg:items-end lg:text-right">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <MapPin className="size-4 text-gold" aria-hidden="true" />
                Lake Ohrid, North Macedonia
              </span>
              <span className="text-xs text-foreground/70">A little closer to extraordinary.</span>
            </p>
          </div>
        </div>
      </div>

      <div id="find-transfer" className="relative z-10 mx-auto -mt-40 w-full max-w-6xl scroll-mt-24 px-6">
        <HeroSearch transfers={transferOptions} tours={tourOptions} />
      </div>

      <ul className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {promises.map(({ icon: Icon, title, detail }) => (
          <li
            key={title}
            className="flex items-start gap-3 border-border lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
          >
            <Icon className="mt-0.5 size-6 shrink-0 text-gold" aria-hidden="true" />
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold">{title}</span>
              <span className="text-sm text-muted-foreground">{detail}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-10 md:pb-16">
        <div className="hidden max-w-3xl flex-col gap-3 text-base leading-relaxed text-foreground/80 md:flex">
          <p>
            Looking for a reliable taxi from Skopje Airport? We provide fixed-price private transfers
            from Skopje International Airport (SKP) to Skopje, Ohrid, hotels and destinations across
            North Macedonia. Your price is agreed in advance, with no hidden fees or surge pricing.
          </p>
          <p>
            Your English-speaking driver tracks your flight, meets you at arrivals with a name sign
            and takes you directly to your destination. Available 24/7, including late-night and
            early-morning arrivals, with comfortable vehicles for individuals, families and groups.
          </p>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80 md:hidden">
          Fixed-price transfers from Skopje Airport (SKP) across North Macedonia. Your driver tracks
          your flight and meets you at arrivals, 24/7.
        </p>
      </div>
    </section>
  )
}
