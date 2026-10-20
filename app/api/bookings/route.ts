import { listBookings } from '@/app/actions/bookings'

export async function GET() {
  try {
    return Response.json(await listBookings(), { headers: { 'Cache-Control': 'private, no-store' } })
  } catch {
    return Response.json({ error: 'Could not load bookings. Please try again.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
