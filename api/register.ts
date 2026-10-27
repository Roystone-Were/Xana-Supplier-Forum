import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isValid, saveAndNotify, toRecord } from '../server/registration.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const record = toRecord(req.body)
  if (!isValid(record)) return res.status(400).json({ error: 'Missing or invalid fields.' })

  try {
    const { duplicate } = await saveAndNotify(record)
    return res.status(duplicate ? 200 : 201).json({ ok: true, duplicate })
  } catch (e) {
    console.error('Could not save registration:', e)
    return res.status(500).json({ error: 'Could not save registration.' })
  }
}
