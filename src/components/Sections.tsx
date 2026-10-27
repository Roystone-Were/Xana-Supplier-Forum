import { motion } from 'motion/react'
import { ArrowRight, Clock, Handshake, MapPin } from 'lucide-react'
import { EVENT } from '../event'

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

export function Hero({ onRegister }: { onRegister: () => void }) {
  return (
    <section id="top" className="relative flex min-h-[calc(100vh-5rem)] w-full items-center overflow-hidden bg-cream">
      {/* Right-hand brand panel stands in for the hero photo */}
      <div className="absolute inset-0 z-0 hidden justify-end md:flex">
        <div className="relative h-full w-1/2 overflow-hidden bg-brand">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,138,7,0.35),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.12),transparent_40%)]" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-cream via-cream/30 via-15% to-transparent to-45%" />
          <motion.div
            {...rise(0.3)}
            className="absolute top-1/2 right-[8%] z-20 w-80 -translate-y-1/2 rounded-3xl border border-white/15 bg-white/10 p-7 text-white shadow-2xl backdrop-blur-md lg:right-[12%]"
          >
            <p className="text-xs font-bold tracking-wider text-accent uppercase">Save the date</p>
            <p className="mt-2 font-display text-7xl leading-none font-extrabold">05</p>
            <p className="font-display text-2xl font-bold">November 2026</p>
            <p className="text-sm text-white/70">Thursday</p>
            <div className="my-5 h-px w-full bg-white/20" />
            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-accent" />
                {EVENT.hours}
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  {EVENT.venue}
                  <br />
                  <span className="text-white/60">{EVENT.venueDetail}</span>
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Hero copy; the date card below is capped to the left half so it never runs into the green panel */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-10 pb-20">
        <div className="flex max-w-2xl flex-col gap-5">
          <motion.div
            {...rise(0)}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/10 bg-brand-tint px-4 py-2"
          >
            <Handshake className="h-4 w-4 text-brand" />
            <span className="text-xs font-semibold tracking-wider text-brand uppercase">{EVENT.name}</span>
          </motion.div>
          <motion.h1 {...rise(0.1)} className="text-5xl leading-tight font-bold tracking-tight md:text-6xl">
            <span className="text-brand">Stronger Together,</span>
            <br />
            <span className="text-accent">Every Day Better</span>
          </motion.h1>
          <motion.p {...rise(0.2)} className="mt-2 max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl">
            Xana Pharmacy invites our existing suppliers to a forum on the matters affecting Xana and how we grow
            together. Please register each representative attending.
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-6 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={onRegister}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand/20 transition-colors hover:bg-brand-dark"
            >
              <span>Register to Attend</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
          <motion.div
            {...rise(0.4)}
            className="mt-8 flex w-fit max-w-xl flex-col items-start gap-6 rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-md sm:flex-row sm:items-center md:max-w-[calc(50vw-4rem)] md:flex-col md:items-start lg:flex-row lg:items-center"
          >
            <div className="flex shrink-0 flex-col">
              <span className="font-bold whitespace-nowrap text-gray-900">{EVENT.dateLong}</span>
              <span className="text-sm text-gray-500">{EVENT.hours}</span>
            </div>
            <div className="h-px w-full shrink-0 bg-gray-200 sm:h-10 sm:w-px md:h-px md:w-full lg:h-10 lg:w-px" />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">{EVENT.venue}</span>
              <span className="text-sm text-gray-500">{EVENT.venueDetail}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
