import { count, desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { contactMessages } from '@/lib/db/schema'
import { isAdminEmail } from '@/lib/admin'
import { ensureSchema } from '@/lib/db/ensure-schema'
import { topicLabel } from '@/lib/contact'
import { cn } from '@/lib/utils'
import { setMessageHandled } from '@/app/actions/contact'
import { AdminSignOut } from '@/components/admin-sign-out'

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await ensureSchema()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/sign-in')
  if (!(await isAdminEmail(session.user.email))) redirect('/admin/sign-in?error=not-admin')

  const view = (await searchParams).view === 'done' ? 'done' : 'open'
  const handled = view === 'done'

  const [[{ open }], rows] = await Promise.all([
    db.select({ open: count() }).from(contactMessages).where(eq(contactMessages.handled, false)),
    db.select().from(contactMessages).where(eq(contactMessages.handled, handled)).orderBy(desc(contactMessages.createdAt)).limit(100),
  ])

  const tab = (active: boolean) => cn('rounded-full px-4 py-2 text-sm font-semibold transition-colors', active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')
  const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Skopje' })

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-booking">Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">Messages</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Questions sent from the contact page. <Link href="/admin/bookings" className="font-medium text-foreground underline underline-offset-4">Go to bookings</Link>
          </p>
        </div>
        <AdminSignOut />
      </div>

      <nav aria-label="Message views" className="mt-8 flex w-fit gap-1 rounded-full border border-border bg-card p-1">
        <Link href="/admin/messages" aria-current={!handled ? 'page' : undefined} className={tab(!handled)}>Open ({open})</Link>
        <Link href="/admin/messages?view=done" aria-current={handled ? 'page' : undefined} className={tab(handled)}>Answered</Link>
      </nav>

      <div className="mt-6 flex flex-col gap-4">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            {handled ? 'No answered messages yet.' : 'No new messages.'}
          </p>
        ) : rows.map(row => {
          const isEmail = row.contact.includes('@')
          const digits = row.contact.replace(/[^\d+]/g, '')
          return (
            <article key={row.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-foreground">{row.name}</h2>
                  <a href={isEmail ? `mailto:${row.contact}` : `tel:${digits}`} className="text-sm text-gold underline-offset-4 hover:underline">
                    {row.contact}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-foreground">{topicLabel(row.topic)}</span>
                  <time dateTime={row.createdAt.toISOString()}>{fmt.format(row.createdAt)}</time>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{row.message}</p>
              <form action={setMessageHandled.bind(null, row.id, !handled)}>
                <button type="submit" className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                  {handled ? 'Move back to open' : 'Mark as answered'}
                </button>
              </form>
            </article>
          )
        })}
      </div>
    </main>
  )
}
