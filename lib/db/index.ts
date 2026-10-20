import 'server-only'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

// Dev HMR keeps globalThis alive across env reloads, so key the cached pool by URL
// to avoid reusing a pool created before DATABASE_URL was set.
const globalDb = globalThis as unknown as { bookingPool?: Pool; bookingPoolUrl?: string }

function createPool() {
  return new Pool({ connectionString, max: 5, ssl: connectionString?.includes('localhost') ? undefined : { rejectUnauthorized: true } })
}

if (globalDb.bookingPool && globalDb.bookingPoolUrl !== connectionString) {
  void globalDb.bookingPool.end().catch(() => {})
  globalDb.bookingPool = undefined
}

export const pool = globalDb.bookingPool ?? createPool()
if (process.env.NODE_ENV !== 'production') {
  globalDb.bookingPool = pool
  globalDb.bookingPoolUrl = connectionString
}
export const db = drizzle(pool, { schema })
