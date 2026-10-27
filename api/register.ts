import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isValid, saveAndNotify, toRecord } from '../server/registration'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const record = toRecord(req.body)
  if (!isValid(record)) return res.status(400).json({ error: 'Missing or invalid fields.' })

  try {
    await saveAndNotify(record)
  } catch (e) {
    console.error('Could not save registration:', e)
    return res.status(500).json({ error: 'Could not save registration.' })
  }
  return res.status(201).json({ ok: true })
}
