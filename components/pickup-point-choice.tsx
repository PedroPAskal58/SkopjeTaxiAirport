'use client'

import { useState } from 'react'
import { Building2, Check, LocateFixed, MapPin, Plane } from 'lucide-react'
import { pickupPointLabels, type PickupPoint } from '@/lib/transfers'

const options = [
  { value: 'airport', Icon: Plane, hint: 'Meet & greet at arrivals' },
  { value: 'city', Icon: Building2, hint: 'Your hotel or address' },
] as const

export function PickupPointChoice({
  value,
  onChange,
  address,
  onAddressChange,
}: {
  value: PickupPoint
  onChange: (value: PickupPoint) => void
  address: string
  onAddressChange: (address: string) => void
}) {
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState('')

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setLocateError('Location is not available in this browser. Please type your address.')
      return
    }
    setLocating(true)
    setLocateError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = coords.latitude.toFixed(6)
        const lng = coords.longitude.toFixed(6)
        onAddressChange(`My location: https://maps.google.com/?q=${lat},${lng}`)
        setLocating(false)
      },
      () => {
        setLocateError('We could not get your location. Please type your address instead.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Where should we pick you up?
        <span className="ml-0.5 text-gold">*</span>
      </legend>
      <div role="radiogroup" className="mt-2 grid grid-cols-2 gap-3">
        {options.map(({ value: option, Icon, hint }) => {
          const active = value === option
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                active
                  ? 'border-gold bg-gold/10 ring-2 ring-gold/30'
                  : 'border-border bg-background hover:border-gold/50'
              }`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                  active ? 'bg-gold text-gold-foreground' : 'bg-secondary text-gold'
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  From {pickupPointLabels[option]}
                </span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </span>
              {active && <Check className="ml-auto size-5 shrink-0 text-gold" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {value === 'city' && (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-gold/30 bg-gold/5 p-4">
          <label htmlFor="city-pickup-address" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="size-4 text-gold" aria-hidden="true" />
            Pickup address in Skopje
            <span className="text-gold">*</span>
          </label>
          <input
            id="city-pickup-address"
            required
            minLength={5}
            maxLength={250}
            autoComplete="street-address"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Hotel name or street & number, e.g. Hotel Marriott, Plostad Makedonija 7"
            aria-describedby="city-pickup-hint"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p id="city-pickup-hint" className="text-xs text-muted-foreground">
              Tell us exactly where the driver should meet you.
            </p>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold transition hover:bg-gold/10 disabled:opacity-60"
            >
              <LocateFixed className="size-3.5" aria-hidden="true" />
              {locating ? 'Locating…' : 'Use my current location'}
            </button>
          </div>
          {locateError && <p role="alert" className="text-xs text-destructive">{locateError}</p>}
        </div>
      )}
    </fieldset>
  )
}
