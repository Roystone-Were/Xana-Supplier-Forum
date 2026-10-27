// Creates or updates the registrations table. Safe to re-run. Run with `npm run db:setup`.
import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set. Run `vercel env pull .env.local --yes` first.')

const sql = neon(url)
const statements = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8')
  .replace(/--.*$/gm, '')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)
for (const s of statements) await sql.query(s)
console.log('forum_registrations table is ready.')
