import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Clock, Info, MapPin, Users } from 'lucide-react'
import { site, transfers, type Transfer } from '@/lib/site'
import { MobileBookingBar } from '@/components/mobile-booking-bar'
import { RouteSection } from '@/components/route-section'
import { Itinerary } from '@/components/itinerary'
import { getTransferTagStyle } from '@/lib/transfer-tags'
import { hasPickupPointChoice } from '@/lib/transfers'
import { PickupChoiceBadge, PickupChoiceCallout } from '@/components/pickup-choice-badge'

export function TransferDetail({ transfer }: { transfer: Transfer }) {
  const otherTransfers = transfers.filter((t) => t.slug !== transfer.slug).slice(0, 3)

  return (
    <article>
      <header className="relative isolate overflow-hidden">
        <Image
          src={transfer.image}
          alt={transfer.alt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="mx-auto flex min-h-[420px] max-w-4xl flex-col justify-end px-6 pb-10 pt-28 md:min-h-[480px]">
          <Link
            href="/transfers"
            className="mb-6 inline-flex items-center gap-1.5 self-start rounded-full bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur transition hover:bg-background"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> All transfers
          </Link>
          <span
            className={`self-start rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getTransferTagStyle(transfer.tag)}`}
          >
            {transfer.tag}
          </span>
          <h1 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            {transfer.from} <span className="text-gold">to</span> {transfer.to}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground md:text-lg">
            {transfer.description}
          </p>
          {hasPickupPointChoice(transfer) && <PickupChoiceBadge className="mt-4 self-start" />}
        </div>
      </header>

      <div className="mx-auto grid max-w-4xl gap-10 px-6 pb-20 md:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4">
            <Stat icon={<MapPin className="size-4" aria-hidden="true" />} label="Distance" value={transfer.distance} />
            <Stat icon={<Clock className="size-4" aria-hidden="true" />} label="Travel time" value={transfer.duration} />
            <Stat icon={<Users className="size-4" aria-hidden="true" />} label="Passengers" value="Up to 4" />
          </dl>

          <RouteSection stopNames={[transfer.from, transfer.to]} />

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground">About this ride</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              {transfer.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground">What you get</h2>
            <ul className="mt-4 space-y-3">
              {transfer.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          <Itinerary steps={transfer.journey} important={transfer.important} />

          <section className="mt-10 rounded-2xl border border-gold/25 bg-gold/5 p-6">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <Info className="size-5 text-gold" aria-hidden="true" /> Good to know
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-gold">
              {transfer.goodToKnow.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div id="detail-booking-card" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Fixed price</p>
            <p className="mt-1 text-4xl font-semibold text-foreground">€{transfer.price}</p>
            <p className="text-sm text-muted-foreground">per car, one way</p>
            {hasPickupPointChoice(transfer) && <PickupChoiceCallout />}
            <Link
              href={`/reserve?transfer=${transfer.slug}`}
                className="mt-5 flex items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground shadow-sm transition hover:brightness-75"
            >
              Book this transfer <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              Ask on WhatsApp
            </a>
          </div>
        </aside>
      </div>

      <section className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-4xl px-6 pb-32 pt-14 md:py-14">
          <h2 className="font-serif text-2xl font-semibold text-foreground">More transfers</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {otherTransfers.map((t) => (
              <Link
                key={t.slug}
                href={`/transfers/${t.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={t.image}
                    alt={t.alt}
                    fill
                    sizes="(min-width: 640px) 280px, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-foreground group-hover:text-gold">{t.route}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.duration} · €{t.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MobileBookingBar
        href={`/reserve?transfer=${transfer.slug}`}
        label="Book transfer"
        priceLabel={`€${transfer.price} fixed`}
      />
    </article>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-gold">{icon}</span>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  )
}
