import { auth } from '@/lib/auth'
import { ensureSchema } from '@/lib/db/ensure-schema'
import { toNextJsHandler } from 'better-auth/next-js'

const handler = toNextJsHandler(auth)

export async function GET(request: Request) {
  await ensureSchema()
  return handler.GET(request)
}

export async function POST(request: Request) {
  await ensureSchema()
  return handler.POST(request)
}
