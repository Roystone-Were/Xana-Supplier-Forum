import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Briefcase, Building2, CalendarDays, CalendarPlus, Check, Clock, MapPin, Phone, User, X } from 'lucide-react'
import { EVENT } from '../event'
import { Logo } from './Layout'

export type Registration = {
  fullName: string
  company: string
  jobTitle: string
  phone: string
}

type TextField = 'fullName' | 'company' | 'jobTitle' | 'phone'

const FIELDS = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', icon: User },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+254 700 000 000', icon: Phone },
  { name: 'company', label: 'Company', type: 'text', placeholder: 'Acme Pharmaceuticals Ltd', icon: Building2 },
  { name: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Key Account Manager', icon: Briefcase },
] as const satisfies readonly { name: TextField; [k: string]: unknown }[]

const INPUT =
  'w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none'

function validate(f: Registration) {
  const e: Partial<Record<TextField, string>> = {}
  if (!f.fullName.trim()) e.fullName = 'Please enter your full name.'
  if (!f.company.trim()) e.company = 'Please enter your company name.'
  if (!f.jobTitle.trim()) e.jobTitle = 'Please enter your job title.'
  if (!f.phone.trim()) e.phone = 'Please enter your phone number.'
  else if (f.phone.replace(/\D/g, '').length < 9) e.phone = 'Please enter a valid phone number.'
  return e
}

const dialogMotion = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
}

export function RegistrationForm({
  onClose,
  onConfirmed,
}: {
  onClose: () => void
  onConfirmed: (r: Registration) => void
}) {
  const [form, setForm] = useState<Registration>({
    fullName: '',
    company: '',
    jobTitle: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<TextField, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setMessage('Please complete the highlighted fields.')
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('We could not confirm your registration. Please try again.')
      onConfirmed(form)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      {...dialogMotion}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
      className="relative z-10 flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 rounded-full bg-white p-2 text-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-colors hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="border-b border-gray-100 px-8 pt-10 pb-6">
        <Logo size="sm" className="mb-6" />
        <h2 id="register-title" className="mb-1 text-2xl font-bold text-brand">
          Register to Attend
        </h2>
        <p className="text-sm text-gray-500">
          {EVENT.name} · {EVENT.dateShort}. Register each representative separately.
        </p>
      </div>
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto px-8 py-6">
          {FIELDS.map(({ name, label, type, placeholder, icon: Icon }) => (
            <div key={name} className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor={name}>
                {label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Icon className="h-4 w-4" />
                </div>
                <input
                  id={name}
                  type={type}
                  required
                  aria-required="true"
                  aria-invalid={errors[name] ? true : undefined}
                  aria-describedby={errors[name] ? `${name}-error` : undefined}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={(e) => {
                    setForm({ ...form, [name]: e.target.value })
                    if (errors[name]) setErrors({ ...errors, [name]: undefined })
                  }}
                  className={`${INPUT} ${errors[name] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                />
              </div>
              {errors[name] && (
                <p id={`${name}-error`} className="text-xs font-medium text-red-500">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}



          {message && (
            <p role="alert" className="pt-2 text-sm font-medium text-red-500">
              {message}
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-cream px-8 py-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border-2 border-gray-800 px-8 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-brand bg-brand px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {submitting ? 'Registering...' : 'Confirm Registration'}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

function icsTime(hhmm: string) {
  const [y, m, d] = EVENT.date.split('-').map(Number)
  const [h, min] = hhmm.split(':').map(Number)
  return new Date(Date.UTC(y, m - 1, d, h - EVENT.utcOffsetHours, min))
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

const icsEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/[;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')

function downloadCalendar() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Xana Pharmacy//Supplier Engagement Forum//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${EVENT.date}-supplier-engagement-forum@xanalife.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${icsTime(EVENT.start)}`,
    `DTEND:${icsTime(EVENT.end)}`,
    `SUMMARY:${icsEscape(EVENT.summary)}`,
    `LOCATION:${icsEscape(`${EVENT.venue}, ${EVENT.venueDetail}`)}`,
    `DESCRIPTION:${icsEscape(`Xana Pharmacy ${EVENT.name}.\nQuestions? Call ${EVENT.phones[0].display}.`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics + '\r\n'], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'supplier-engagement-forum.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function Confirmation({ registration, onClose }: { registration: Registration; onClose: () => void }) {
  const facts = [
    { icon: CalendarDays, label: 'Date', value: EVENT.dateShort },
    { icon: Clock, label: 'Time', value: EVENT.hours },
    { icon: MapPin, label: 'Venue', value: EVENT.venue },
  ]

  return (
    <motion.div
      {...dialogMotion}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col items-center overflow-y-auto rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
    >
      <Logo size="sm" className="mb-8" />
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand ring-8 ring-brand/10">
        <Check className="h-10 w-10 stroke-[3] text-white" />
      </div>
      <h2 id="confirmation-title" className="mb-3 text-3xl font-bold text-brand">
        You're Registered!
      </h2>
      <p className="mb-8 max-w-sm text-base text-gray-500">
        Thank you, {registration.fullName.split(' ')[0]}. Your seat for {registration.company} at the{' '}
        {EVENT.name} is confirmed. We look forward to seeing you.
      </p>
      <div className="mb-8 flex w-full divide-x divide-gray-200 rounded-2xl border border-gray-100 bg-cream p-6 text-left">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-1 flex-col px-4 first:pl-2">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
              <Icon className="h-3.5 w-3.5" /> {label}
            </span>
            <span className="text-sm font-bold text-gray-900">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <button
          onClick={downloadCalendar}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-brand bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          <CalendarPlus className="h-4 w-4" />
          Add to Calendar
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border-2 border-gray-800 px-6 py-3.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
        >
          Back to Home
        </button>
      </div>
    </motion.div>
  )
}
