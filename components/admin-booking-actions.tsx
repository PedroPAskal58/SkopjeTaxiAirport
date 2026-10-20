'use client'

import { useActionState, useState } from 'react'
import { Check, X } from 'lucide-react'
import { approveBooking, rejectBooking, type AdminActionState } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

const initialState: AdminActionState = { status: 'idle', message: '' }

export function AdminBookingActions({ id }: { id: string }) {
  const [approveState, approveAction, approving] = useActionState(approveBooking, initialState)
  const [rejectState, rejectAction, rejecting] = useActionState(rejectBooking, initialState)
  const [confirmReject, setConfirmReject] = useState(false)
  const busy = approving || rejecting
  const latest = rejectState.status !== 'idle' ? rejectState : approveState

  return (
    <div className="mt-5 flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <form action={approveAction}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" disabled={busy}>
            <Check data-icon="inline-start" /> {approving ? 'Approving…' : 'Approve booking'}
          </Button>
        </form>
        {confirmReject ? (
          <form action={rejectAction} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="id" value={id} />
            <span className="text-sm text-muted-foreground">Reject this request?</span>
            <Button type="submit" variant="destructive" disabled={busy}>
              {rejecting ? 'Rejecting…' : 'Yes, reject'}
            </Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => setConfirmReject(false)}>
              Keep request
            </Button>
          </form>
        ) : (
          <Button type="button" variant="destructive" disabled={busy} onClick={() => setConfirmReject(true)}>
            <X data-icon="inline-start" /> Reject request
          </Button>
        )}
      </div>
      <p aria-live="polite" className={latest.status === 'error' ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}>
        {latest.message}
      </p>
    </div>
  )
}
