import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { EVENT } from '../event'

const LOGO_SIZES = { md: 'h-12 sm:h-14', sm: 'h-12' }

export function Logo({ size = 'md', className = '' }: { size?: 'md' | 'sm'; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img
        src="/img/xana-logo.png"
        alt="Xana Life — Every Day Better"
        className={`${LOGO_SIZES[size]} w-auto object-contain`}
      />
    </div>
  )
}

export function Header({ onRegister }: { onRegister: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="#top" aria-label={`${EVENT.name} — home`}>
          <Logo />
        </a>
        <button
          onClick={onRegister}
          className="hidden rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark md:block"
        >
          Register Now
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="text-brand md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              <button
                onClick={() => {
                  setOpen(false)
                  onRegister()
                }}
                className="rounded-lg bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                Register Now
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-cream px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Logo size="sm" />
          <div className="flex flex-col items-center gap-0.5 text-sm text-gray-500 md:items-start">
            <span>
              {EVENT.venue} — {EVENT.venueDetail}
            </span>
            <span>
              {EVENT.phones.map((p, i) => (
                <span key={p.tel}>
                  {i > 0 && <span className="mx-1.5 text-gray-300">|</span>}
                  <a href={`tel:${p.tel}`} className="transition-colors hover:text-brand">
                    {p.display}
                  </a>
                </span>
              ))}
            </span>
          </div>
        </div>
        <span className="text-center text-sm text-gray-500 md:text-right">
          © 2026 Xana Pharmacy.
          <br className="hidden md:block" /> All rights reserved.
        </span>
      </div>
    </footer>
  )
}
