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
