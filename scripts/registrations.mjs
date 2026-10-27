// Prints registration numbers and writes the full list to registrations-<date>.csv.
// Run with `npm run registrations` (reads DATABASE_URL from .env.local).
import { writeFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set. Run `vercel env pull .env.local --yes` first.')
const sql = neon(process.env.DATABASE_URL)

const rows = await sql`
  select id, full_name, phone, company, job_title,
         to_char(created_at at time zone 'Africa/Nairobi', 'YYYY-MM-DD HH24:MI') as registered
  from forum_registrations order by created_at`

const companies = new Map()
for (const r of rows) companies.set(r.company, (companies.get(r.company) ?? 0) + 1)

console.log(`\nTotal registrations: ${rows.length}`)
console.log(`Companies: ${companies.size}\n`)
for (const [name, n] of [...companies].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${name}`)

const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
const csv = [
  ['#', 'Full name', 'Phone', 'Company', 'Job title', 'Registered (EAT)'].map(cell).join(','),
  ...rows.map((r, i) => [i + 1, r.full_name, r.phone, r.company, r.job_title, r.registered].map(cell).join(',')),
].join('\r\n')
const file = `registrations-${new Date().toISOString().slice(0, 10)}.csv`
// BOM so Excel opens it as UTF-8
writeFileSync(file, '﻿' + csv + '\r\n')
console.log(`\nFull list saved to ${file}\n`)
