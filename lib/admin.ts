import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { pool } from '@/lib/db'
import { ensureSchema } from '@/lib/db/ensure-schema'

function configuredAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean)
}

// With ADMIN_EMAILS set, only those emails are admins. Without it (e.g. a fresh copy of
// the project), the first account ever created becomes the admin so the panel still works.
export async function isAdminEmail(email: string) {
  const allowed = configuredAdminEmails()
  if (allowed.length > 0) return allowed.includes(email.toLowerCase())

  await ensureSchema()
  const { rows } = await pool.query<{ email: string }>('SELECT "email" FROM "user" ORDER BY "createdAt" ASC, "id" ASC LIMIT 1')
  return rows[0]?.email.toLowerCase() === email.toLowerCase()
}

export async function requireAdmin() {
  await ensureSchema()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !(await isAdminEmail(session.user.email))) throw new Error('Unauthorized')
  return session.user
}
