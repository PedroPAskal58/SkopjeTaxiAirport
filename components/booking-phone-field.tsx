'use client'

import { useId, useState } from 'react'
import PhoneInput from 'react-phone-number-input/max'
import { isValidPhoneNumber } from 'libphonenumber-js/max'
import 'react-phone-number-input/style.css'

export function BookingPhoneField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = useId()
  const [touched, setTouched] = useState(false)
  const invalid = touched && (!value || !isValidPhoneNumber(value))
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-muted-foreground">Phone / WhatsApp *</label>
      <PhoneInput id={id} name="phone" defaultCountry="MK" international countryCallingCodeEditable={false}
        countrySelectProps={{ 'aria-label': 'Phone country' }}
        value={value} onChange={v => onChange(v ?? '')} onBlur={() => setTouched(true)}
        required autoComplete="tel" placeholder="Phone number" aria-invalid={invalid} aria-describedby={`${id}-help`}
        className="booking-phone rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/30"
      />
      <p id={`${id}-help`} className="text-sm text-muted-foreground">{invalid ? 'Enter a valid number for the selected country.' : 'Select your country, then enter your number.'}</p>
    </div>
  )
}
