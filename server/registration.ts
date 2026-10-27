import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'

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

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

async function notify(id: number, r: RegistrationRecord) {
  const key = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  if (!key || !domain) return console.error('Email not sent: RESEND_API_KEY / RESEND_EMAIL_DOMAIN missing')

  const rows = [
    ['Name', r.fullName],
    ['Phone', r.phone],
    ['Company', r.company],
    ['Job title', r.jobTitle],
  ]
  // The Resend SDK returns { error } rather than throwing.
  const { error } = await new Resend(key).emails.send(
    {
      from: `Xana Supplier Forum <forum@${domain}>`,
      to: NOTIFY,
      subject: `New forum registration: ${r.fullName} (${r.company})`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<p>A new supplier has registered for the Supplier Engagement Forum.</p><table cellpadding="4">${rows
        .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escape(v)}</td></tr>`)
        .join('')}</table>`,
    },
    { idempotencyKey: `forum-registration/${id}` },
  )
  if (error) console.error(`Email for registration ${id} failed: ${error.message}`)
}

// Saving is what confirms the seat; a failed email is logged but never blocks the registration.
export async function saveAndNotify(r: RegistrationRecord) {
  console.log(logLine(r))
  const sql = neon(process.env.DATABASE_URL!)
  const [row] = await sql`
    insert into forum_registrations (full_name, phone, company, job_title)
    values (${r.fullName}, ${r.phone}, ${r.company}, ${r.jobTitle})
    returning id`
  await notify(row.id as number, r).catch((e) => console.error('Email failed:', e))
}
