import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Footer, Header } from './components/Layout'
import { Hero } from './components/Sections'
import { Confirmation, RegistrationForm, type Registration } from './components/Registration'

export default function App() {
  const [formOpen, setFormOpen] = useState(false)
  const [confirmed, setConfirmed] = useState<Registration | null>(null)
  const modalOpen = formOpen || confirmed !== null
  const open = () => setFormOpen(true)
  const close = () => {
    setFormOpen(false)
    setConfirmed(null)
  }

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [modalOpen])

  return (
    <div className="relative min-h-screen overflow-x-clip bg-cream text-gray-800 selection:bg-brand/20">
      <Header onRegister={open} />
      <main>
        <Hero onRegister={open} />
      </main>
      <Footer />
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm"
              onClick={close}
            />
            {confirmed ? (
              <Confirmation registration={confirmed} onClose={close} />
            ) : (
              <RegistrationForm
                onClose={close}
                onConfirmed={(r) => {
                  setFormOpen(false)
                  setConfirmed(r)
                }}
              />
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
