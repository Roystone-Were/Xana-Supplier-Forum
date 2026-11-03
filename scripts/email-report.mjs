// Emails the registrations report (summary + full list as CSV attachment).
// Run with `npm run report:email` (sends to Patrick) or
// `npm run report:email -- --to someone@xanalife.com` / `--dry-run`.
import { neon } from '@neondatabase/serverless'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const toIdx = args.indexOf('--to')
const to = toIdx >= 0 ? args[toIdx + 1] : 'patrick@xanalife.com'

const { DATABASE_URL, MG_API_KEY, MG_DOMAIN } = process.env
if (!DATABASE_URL || !MG_API_KEY || !MG_DOMAIN) throw new Error('DATABASE_URL / MG_API_KEY / MG_DOMAIN missing from .env.local')
const sql = neon(DATABASE_URL)

const rows = await sql`
  select full_name, phone, company, job_title,
         to_char(created_at at time zone 'Africa/Nairobi', 'YYYY-MM-DD HH24:MI') as registered
  from forum_registrations order by created_at`

const companies = new Map()
for (const r of rows) companies.set(r.company, (companies.get(r.company) ?? 0) + 1)
const byCompany = [...companies].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
const csv = '﻿' + [
  ['#', 'Full name', 'Phone', 'Company', 'Job title', 'Registered (EAT)'].map(cell).join(','),
  ...rows.map((r, i) => [i + 1, r.full_name, r.phone, r.company, r.job_title, r.registered].map(cell).join(',')),
].join('\r\n') + '\r\n'

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const now = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', dateStyle: 'medium', timeStyle: 'short' })
const td = 'style="padding:6px 10px;border-bottom:1px solid #e5e7eb"'
const th = 'style="padding:6px 10px;border-bottom:2px solid #d1d5db;text-align:left"'

const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111827">
<p>Hi Patrick,</p>
<p>Here is the registrations report for the Supplier Engagement Forum (Thursday 5 Nov, 8:00–10:00am, Xana Plus Ruiru) as of ${esc(now)} EAT.</p>
<p style="font-size:16px"><strong>${rows.length}</strong> registrations from <strong>${companies.size}</strong> companies.</p>
<h3 style="margin:20px 0 8px">By company</h3>
<table style="border-collapse:collapse"><tr><th ${th}>Company</th><th ${th}>Registered</th></tr>
${byCompany.map(([c, n]) => `<tr><td ${td}>${esc(c)}</td><td ${td}>${n}</td></tr>`).join('\n')}
</table>
<h3 style="margin:20px 0 8px">Full list</h3>
<table style="border-collapse:collapse"><tr><th ${th}>#</th><th ${th}>Name</th><th ${th}>Phone</th><th ${th}>Company</th><th ${th}>Job title</th><th ${th}>Registered</th></tr>
${rows.map((r, i) => `<tr><td ${td}>${i + 1}</td><td ${td}>${esc(r.full_name)}</td><td ${td}>${esc(r.phone)}</td><td ${td}>${esc(r.company)}</td><td ${td}>${esc(r.job_title)}</td><td ${td}>${esc(r.registered)}</td></tr>`).join('\n')}
</table>
<p style="margin-top:20px">The full list is also attached as a spreadsheet (CSV).</p>
</div>`

const text = [
  `Supplier Engagement Forum – registrations as of ${now} EAT`,
  `${rows.length} registrations from ${companies.size} companies.`, '',
  ...byCompany.map(([c, n]) => `${String(n).padStart(3)}  ${c}`), '',
  'Full list attached (CSV).',
].join('\n')

const subject = `Supplier Forum registrations: ${rows.length} as of ${now}`
const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' })

if (dryRun) {
  console.log(`[dry run] to: ${to}\nsubject: ${subject}\n\n${text}`)
  process.exit(0)
}

const form = new FormData()
form.append('from', process.env.MG_FROM || `Xana Supplier Forum <noreply@${MG_DOMAIN}>`)
form.append('to', to)
form.append('subject', subject)
form.append('text', text)
form.append('html', html)
form.append('attachment', new Blob([csv], { type: 'text/csv' }), `supplier-forum-registrations-${date}.csv`)

const base = (process.env.MG_API_BASE || 'https://api.mailgun.net').replace(/\/$/, '')
const res = await fetch(`${base}/v3/${MG_DOMAIN}/messages`, {
  method: 'POST',
  headers: { Authorization: `Basic ${Buffer.from(`api:${MG_API_KEY}`).toString('base64')}` },
  body: form,
})
const body = await res.text()
console.log(`${new Date().toISOString()} to=${to} status=${res.status} ${body}`)
if (!res.ok) process.exit(1)
