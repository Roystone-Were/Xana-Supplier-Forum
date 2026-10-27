import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isValid, logLine, toRecord } from '../server/registration'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const record = toRecord(req.body)
  if (!isValid(record)) return res.status(400).json({ error: 'Missing or invalid fields.' })

  console.log(logLine(record))
  return res.status(201).json({ ok: true })
}
