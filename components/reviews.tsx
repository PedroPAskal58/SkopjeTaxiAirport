import { Star, Quote } from 'lucide-react'
import { site } from '@/lib/site'

const reviews = [
  {
    name: 'Anna M.',
    origin: 'United Kingdom',
    text: 'Driver was waiting for us at arrivals even though our flight was late. Spotless car, smooth ride to the hotel and a fair fixed price. Booked the return with them too.',
  },
  {
    name: 'Thomas K.',
    origin: 'Germany',
    text: 'Booked the Skopje to Ohrid day trip. Friendly English-speaking driver, comfortable car and a beautiful, relaxed day. Highly recommend for anyone visiting Macedonia.',
  },
  {
    name: 'Sofia R.',
    origin: 'Italy',
    text: 'Easy to book over WhatsApp and quick to reply. Everything was exactly as agreed — no surprises. Will use again on my next trip to Skopje.',
  },
  {
    name: 'David L.',
    origin: 'USA',
    text: 'Professional from start to finish. Child seat was ready as requested and the driver helped with all our luggage. Great value and stress-free after a long flight.',
  },
  {
    name: 'Elena P.',
    origin: 'Greece',
    text: 'The Matka Canyon and Vodno tour was the highlight of our trip. Knowledgeable driver, flexible schedule and a very comfortable vehicle.',
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="border-y border-border bg-secondary/50">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Reviews</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Loved by Travellers
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-gold text-gold" aria-hidden="true" />
              ))}
            </span>
            <span className="text-sm font-semibold text-foreground">{site.rating}</span>
            <span className="text-sm text-muted-foreground">from {site.reviewCount} reviews</span>
          </div>
          <div className="mt-6">
            <a
              href={site.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Star className="size-4 fill-current" aria-hidden="true" />
              Review us on Google
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              Loved your ride? Share your experience on Google — it only takes a minute.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.name} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <Quote className="size-7 text-gold/50" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                {review.text}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {review.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{review.name}</span>
                  <span className="block text-xs text-muted-foreground">{review.origin}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
