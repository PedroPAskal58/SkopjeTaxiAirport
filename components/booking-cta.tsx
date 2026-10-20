import Link from 'next/link'
import { MessageCircle, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'

export function BookingCta() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground md:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">Ready to Book Your Ride?</h2>
            <p className="mt-4 text-primary-foreground/85">
              Send us your flight details and destination — we&apos;ll confirm your fixed price and
              driver within minutes. Available 24/7, every day of the year.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link href="/book">
                  <MessageCircle className="size-5" aria-hidden="true" />
                  Book Now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <a href={site.phoneHref}>
                  <Phone className="size-5" aria-hidden="true" />
                  Call us
                </a>
              </Button>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition hover:text-gold"
            >
              <Mail className="size-4" aria-hidden="true" />
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
