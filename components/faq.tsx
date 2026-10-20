import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'How do I book a transfer?',
    a: 'Just message us on WhatsApp, Viber, or call — send your flight number, arrival time, number of passengers and destination. We confirm your booking and fixed price right away.',
  },
  {
    q: 'Where will the driver meet me at Skopje Airport?',
    a: 'Your driver waits in the arrivals hall holding a name sign. We track your flight, so even if it is early or delayed, your driver will be there when you land.',
  },
  {
    q: 'Are your prices fixed?',
    a: 'Yes. You get a fixed price confirmed at booking — no meters, no surprises, and no extra charges for luggage, night rides or flight delays.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'You can pay the driver in cash in Euros (€), British Pounds (£) or US Dollars ($), or in crypto — whichever is easiest for you. We do not accept card payments.',
  },
  {
    q: 'Do I need local currency (Macedonian denars)?',
    a: 'No. You can pay for your ride in Euros, British Pounds or US Dollars in cash, so there is no need to exchange money at the airport before you meet your driver.',
  },
  {
    q: 'What happens if my flight is delayed?',
    a: 'Nothing changes for you. We track your flight in real time and adjust the pickup to your actual landing time, at no extra cost.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking as soon as you know your travel details, especially for early-morning, late-night or holiday arrivals. Last-minute requests are often possible — just message us and we will check availability.',
  },
  {
    q: 'Are you available at night and on holidays?',
    a: 'Yes. We operate 24/7, every day of the year, including late-night and early-morning flights.',
  },
  {
    q: 'Do you offer child seats?',
    a: 'Yes, child and baby seats are available free of charge — just let us know your child’s age when you book.',
  },
  {
    q: 'How much luggage can I bring?',
    a: 'Standard suitcases and carry-ons are always included. If you are travelling with a lot of luggage, skis, a bike or other large items, tell us when booking and we will send a vehicle with enough space.',
  },
  {
    q: 'What vehicles do you use?',
    a: 'Clean, comfortable, air-conditioned cars for individuals and couples, and spacious vans for families and larger groups. We choose the right vehicle based on your passengers and luggage.',
  },
  {
    q: 'Do your drivers speak English?',
    a: 'Yes. All of our drivers are professional and speak English, so communication is easy from pickup to drop-off.',
  },
  {
    q: 'Can you drive to destinations outside Skopje?',
    a: 'Absolutely. We offer transfers across Macedonia and to international destinations, plus private day tours to Ohrid, Matka, Stobi and more.',
  },
  {
    q: 'Can I change or cancel my booking?',
    a: 'Yes. Plans change — just message us on WhatsApp, Viber or by phone as early as possible and we will update or cancel your booking.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Good to know</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((faq) => (
            <details key={faq.q} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-foreground">
                {faq.q}
                <Plus
                  className="size-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
