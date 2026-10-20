import Image from 'next/image'
import { Users, Briefcase, Snowflake, Check, Clock } from 'lucide-react'
import { BookButton, WaitlistButton } from '@/components/book-button'

type Car = {
  name: string
  slug: string
  type: string
  seats: string
  luggage: string
  image: string
  alt: string
  perks: string[]
  status: 'available' | 'coming-soon'
}

const fleet: Car[] = [
  {
    name: 'Ford Mondeo 2018',
    slug: 'mondeo',
    type: 'Executive Comfort Sedan',
    seats: 'Up to 4 passengers',
    luggage: '3 large bags',
    image: '/images/fleet-mondeo.png',
    alt: 'White Ford Mondeo 2018 executive comfort sedan',
    perks: [
      'Spacious leather interior with extra legroom',
      'Climate control kept to your preference',
      'Ideal for business travel and couples',
    ],
    status: 'available',
  },
  {
    name: 'Kia Sportage 2017',
    slug: 'kia',
    type: 'Comfort SUV',
    seats: 'Up to 4 passengers',
    luggage: '3 large bags',
    image: '/images/fleet-kia.png',
    alt: 'Black Kia Sportage 2017 comfort SUV',
    perks: [
      'Elevated SUV ride with a smooth, quiet cabin',
      'Great for luggage-heavy airport runs',
      'Sleek black finish, immaculately kept',
    ],
    status: 'available',
  },
  {
    name: 'Premium Passenger Van',
    slug: 'van',
    type: 'Group & Family Van',
    seats: 'Up to 4 passengers',
    luggage: '6 bags',
    image: '/images/fleet-van.png',
    alt: 'White compact passenger van',
    perks: [
      'Comfortable seating for up to 4 passengers',
      'Perfect for families, small groups and day tours',
      'Reserve early to be first in line',
    ],
    status: 'coming-soon',
  },
]

const includedForEveryRide = [
  'Complimentary bottle of chilled water',
  'Phone charging cable on board',
  'Air conditioning & spotless interior',
]

export function Fleet() {
  return (
    <section id="fleet" className="relative border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">The fleet</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Travel in Quiet Luxury
          </h2>
          <p className="mt-3 text-muted-foreground">
            A hand-picked vehicle, immaculately kept and driven by a professional. Every seat comes
            with the little touches that make the journey feel effortless.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {fleet.map((car) => {
            const soon = car.status === 'coming-soon'
            return (
              <article
                key={car.name}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-card ${
                  soon ? 'border-border' : 'border-gold/40 luxury-glow'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <Image
                    src={car.image || '/placeholder.svg'}
                    alt={car.alt}
                    fill
                    className={`object-cover transition duration-700 group-hover:scale-105 ${
                      soon ? 'opacity-40 grayscale' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <span
                    className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
                      soon
                        ? 'bg-background/70 text-muted-foreground ring-1 ring-border'
                        : 'bg-gold text-gold-foreground'
                    }`}
                  >
                    {soon ? (
                      <>
                        <Clock className="size-3.5" aria-hidden="true" /> Coming soon
                      </>
                    ) : (
                      <>
                        <Check className="size-3.5" aria-hidden="true" /> Available now
                      </>
                    )}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                    {car.type}
                  </p>
                  <h3 className="mt-1.5 font-serif text-2xl font-semibold text-foreground">
                    {car.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-4 text-gold" aria-hidden="true" /> {car.seats}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="size-4 text-gold" aria-hidden="true" /> {car.luggage}
                    </span>
                  </div>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {car.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {soon ? (
                      <WaitlistButton />
                    ) : (
                      <BookButton
                        href={`/book?car=${car.slug}`}
                        car={car.slug}
                        className="inline-flex h-9 w-full items-center justify-center rounded-md bg-gold px-4 text-sm font-medium text-gold-foreground transition hover:bg-gold/90"
                        bookedClassName="w-full rounded-md"
                      >
                        Reserve the {car.name.split(' ').slice(0, 2).join(' ')}
                      </BookButton>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Included with every ride */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-gold/25 bg-gradient-to-r from-card to-secondary/60 p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                <Snowflake className="size-5 text-gold" aria-hidden="true" />
                On the house, every single trip
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Small details, done right — because first impressions matter.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {includedForEveryRide.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
