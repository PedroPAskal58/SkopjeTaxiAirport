import { count, desc, eq, inArray } from 'drizzle-orm'
import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { isAdminEmail } from '@/lib/admin'
import { ensureSchema } from '@/lib/db/ensure-schema'
import { cn } from '@/lib/utils'
import { AdminSignOut } from '@/components/admin-sign-out'
import { AdminBookingActions } from '@/components/admin-booking-actions'
import { AdminBookingCard } from '@/components/admin-booking-card'
import { AdminRescheduleForm } from '@/components/admin-reschedule-form'
import { expireStaleWhatsAppBookings } from '@/lib/db/expire-whatsapp'

const REVIEWED = ['approved', 'rejected', 'cancelled', 'expired']
const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'approved', label: 'Confirmed' },
  { value: 'rejected', label: 'Declined' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired', label: 'Expired' },
] as const

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<{ view?: string; status?: string }> }) {
  await ensureSchema()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/sign-in')
  if (!(await isAdminEmail(session.user.email))) redirect('/admin/sign-in?error=not-admin')
  await expireStaleWhatsAppBookings()

  const params = await searchParams
  const view = params.view === 'history' ? 'history' : 'pending'
  const filter = FILTERS.some(f => f.value === params.status) ? params.status! : 'all'

  const [[{ pending }], [{ reviewed }]] = await Promise.all([
    db.select({ pending: count() }).from(bookings).where(eq(bookings.status, 'requested')),
    db.select({ reviewed: count() }).from(bookings).where(inArray(bookings.status, REVIEWED)),
  ])

  const rows = view === 'pending'
    ? await db.select().from(bookings).where(eq(bookings.status, 'requested')).orderBy(desc(bookings.createdAt))
    : await db.select().from(bookings).where(filter === 'all' ? inArray(bookings.status, REVIEWED) : eq(bookings.status, filter)).orderBy(desc(bookings.updatedAt)).limit(100)

  const tab = (active: boolean) => cn('rounded-full px-4 py-2 text-sm font-semibold transition-colors', active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-booking">Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">Bookings</h1>
          <p className="mt-3 text-sm text-muted-foreground">Review customer requests and see every past decision. <Link href="/admin/messages" className="font-medium text-foreground underline underline-offset-4">View contact messages</Link></p>
        </div>
        <AdminSignOut />
      </div>

      <nav aria-label="Booking views" className="mt-8 flex w-fit gap-1 rounded-full border border-border bg-card p-1">
        <Link href="/admin/bookings" aria-current={view === 'pending' ? 'page' : undefined} className={tab(view === 'pending')}>Pending ({pending})</Link>
        <Link href="/admin/bookings?view=history" aria-current={view === 'history' ? 'page' : undefined} className={tab(view === 'history')}>History ({reviewed})</Link>
      </nav>

      {view === 'history' && (
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter history">
          {FILTERS.map(f => (
            <Link
              key={f.value}
              href={f.value === 'all' ? '/admin/bookings?view=history' : `/admin/bookings?view=history&status=${f.value}`}
              aria-current={filter === f.value ? 'true' : undefined}
              className={cn('rounded-full border px-3 py-1 text-xs font-semibold', filter === f.value ? 'border-foreground text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}
            >
              {f.label}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            {view === 'pending' ? 'No booking requests need review.' : 'No reviewed bookings yet.'}
          </p>
        ) : rows.map(row => (
          <AdminBookingCard key={row.id} row={row}>
            {view === 'pending' && <AdminBookingActions id={row.id} />}
            {(row.status === 'requested' || row.status === 'approved') && (
              <AdminRescheduleForm key={`${row.id}:${row.revision}`} id={row.id} date={row.date} time={row.time} />
            )}
          </AdminBookingCard>
        ))}
      </div>
    </main>
  )
}
