import { appendFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { isValid, logLine, toRecord } from './server/registration'

// Lets the form work under `npm run dev`: registrations are logged and appended to registrations.jsonl.
function localRegisterApi(): Plugin {
  return {
    name: 'local-register-api',
    configureServer(server) {
      server.middlewares.use('/api/register', (req, res) => {
        let raw = ''
        req.on('data', (chunk) => (raw += chunk))
        req.on('end', () => {
          let record
          try {
            record = toRecord(JSON.parse(raw || '{}'))
          } catch {
            record = toRecord({})
          }
          res.setHeader('Content-Type', 'application/json')
          if (req.method !== 'POST' || !isValid(record)) {
            res.statusCode = 400
            return res.end(JSON.stringify({ error: 'Missing or invalid fields.' }))
          }
          console.log(logLine(record))
          appendFileSync('registrations.jsonl', JSON.stringify(record) + '\n')
          res.statusCode = 201
          res.end(JSON.stringify({ ok: true }))
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localRegisterApi()],
})
