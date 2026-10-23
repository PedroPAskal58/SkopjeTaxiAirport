'use client'

import { useActionState, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { rescheduleBooking, type AdminActionState } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

const initialState: AdminActionState = { status: 'idle', message: '' }

export function AdminRescheduleForm({ id, date, time }: { id: string; date: string; time: string }) {
  const [state, action, saving] = useActionState(rescheduleBooking, initialState)
  const [open, setOpen] = useState(false)
  const inputClass = 'h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
      {open ? (
        <form action={action} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={id} />
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            New date
            <input type="date" name="date" defaultValue={date} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            New time (Skopje)
            <input type="time" name="time" defaultValue={time} required className={inputClass} />
          </label>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save new time'}</Button>
          <Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(false)}>Close</Button>
        </form>
      ) : (
        <Button type="button" variant="outline" className="w-fit" onClick={() => setOpen(true)}>
          <CalendarClock data-icon="inline-start" /> Change date / time
        </Button>
      )}
      <p className="text-xs leading-relaxed text-muted-foreground">Use this when the customer asks for a new time on WhatsApp. Their booking page updates automatically.</p>
      {state.message && (
        <p aria-live="polite" className={state.status === 'error' ? 'text-sm text-destructive' : 'text-sm text-booking'}>{state.message}</p>
      )}
    </div>
  )
}
