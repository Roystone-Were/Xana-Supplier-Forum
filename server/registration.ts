import { neon } from '@neondatabase/serverless'
import { registrationEmail } from './email.js'

const NOTIFY = ['patrick@xanalife.com']

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export type RegistrationRecord = ReturnType<typeof toRecord>

export function toRecord(body: any) {
  return {
    receivedAt: new Date().toISOString(),
    fullName: clean(body?.fullName),
    company: clean(body?.company),
    jobTitle: clean(body?.jobTitle),
    phone: clean(body?.phone, 40),
  }
}

export function isValid(r: RegistrationRecord) {
  return Boolean(r.fullName && r.company && r.jobTitle && r.phone)
}

// One line per registration, prefixed so it is easy to filter in the Vercel logs.
export const logLine = (r: RegistrationRecord) => `REGISTRATION ${JSON.stringify(r)}`

// Same Mailgun setup as the World Pharmacists Day site: MG_API_KEY, MG_DOMAIN,
// MG_API_BASE (https://api.eu.mailgun.net for EU accounts), optional MG_FROM.
async function notify(r: RegistrationRecord) {
  const key = process.env.MG_API_KEY
  const domain = process.env.MG_DOMAIN
  const base = (process.env.MG_API_BASE || 'https://api.mailgun.net').replace(/\/$/, '')
  if (!key || !domain) return console.error('Email not sent: MG_API_KEY / MG_DOMAIN missing')

  const { subject, text, html } = registrationEmail(r)
  const form = new URLSearchParams({
    from: process.env.MG_FROM || `Xana Supplier Forum <noreply@${domain}>`,
    to: NOTIFY.join(','),
    subject,
    text,
    html,
  })
  const res = await fetch(`${base}/v3/${domain}/messages`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString('base64')}` },
    body: form,
  })
  if (!res.ok) console.error(`Email failed (${res.status}): ${await res.text()}`)
}

// Saving is what confirms the seat; a failed email is logged but never blocks the registration.
export async function saveAndNotify(r: RegistrationRecord) {
  console.log(logLine(r))
  const sql = neon(process.env.DATABASE_URL!)
  await sql`
    insert into forum_registrations (full_name, phone, company, job_title)
    values (${r.fullName}, ${r.phone}, ${r.company}, ${r.jobTitle})
    `
  await notify(r).catch((e) => console.error('Email failed:', e))
}
