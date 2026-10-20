'use client'

import { useActionState, useRef } from 'react'
import Link from 'next/link'
import { Check, Loader2, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sendContactMessage, type ContactState } from '@/app/actions/contact'
import { CONTACT_TOPICS } from '@/lib/contact'
import { site } from '@/lib/site'

const inputClass =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30'

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, { status: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)

  if (state.status === 'sent') {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-6 md:p-8" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-gold/15 text-gold">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <h2 className="font-serif text-2xl font-semibold text-foreground">Message received</h2>
        <p className="leading-relaxed text-muted-foreground">
          Thank you — we&apos;ll get back to you by email or phone shortly. Need an answer right now? Message us on WhatsApp.
        </p>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90">
            <a href={site.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" /> Open WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/book">Book a ride</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:p-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">Write to us</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A question, a quote, a special request — tell us and we&apos;ll reply by email or phone.
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          What is it about?
        </legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((topic, i) => (
            <label key={topic.value} className="cursor-pointer">
              <input type="radio" name="topic" value={topic.value} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground peer-checked:border-gold peer-checked:bg-gold/15 peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-gold/40">
                {topic.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Your name</span>
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Ana Petrova" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Email or phone</span>
          <input name="contact" required minLength={5} maxLength={120} autoComplete="email" placeholder="you@email.com" className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="e.g. We land at SKP on 14 May at 22:10, 3 people with 4 bags, going to Ohrid."
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </label>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {state.status === 'error' && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={pending} className="w-full bg-gold text-gold-foreground hover:bg-gold/90 sm:w-auto">
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
          {pending ? 'Sending…' : 'Send message'}
        </Button>
        <Link href="/book" className="text-sm font-medium text-muted-foreground transition hover:text-gold">
          Ready to book instead? Open the booking form →
        </Link>
      </div>
    </form>
  )
}
