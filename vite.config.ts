import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { isValid, saveAndNotify, toRecord } from './server/registration.js'

// Lets the form work under `npm run dev` against the same database and email as production.
function localRegisterApi(): Plugin {
  return {
    name: 'local-register-api',
    configureServer(server) {
      server.middlewares.use('/api/register', (req, res) => {
        let raw = ''
        req.on('data', (chunk) => (raw += chunk))
        req.on('end', async () => {
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
          try {
            await saveAndNotify(record)
          } catch (e) {
            console.error('Could not save registration:', e)
            res.statusCode = 500
            return res.end(JSON.stringify({ error: 'Could not save registration.' }))
          }
          res.statusCode = 201
          res.end(JSON.stringify({ ok: true }))
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Server-side secrets from .env.local (vercel env pull); never exposed to the browser bundle.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return { plugins: [react(), tailwindcss(), localRegisterApi()] }
})
