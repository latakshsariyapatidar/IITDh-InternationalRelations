import { useRef } from 'react'
import { RiArrowDownLine } from '@remixicon/react'
import { headerOffset } from '../../utils/scroll'

const TONES = {
  light: 'text-quiet hover:text-plum-deep focus-visible:ring-plum/40',
  dark: 'text-white/60 hover:text-white focus-visible:ring-white/60',
}

/**
 * A quiet cue at the bottom of a hero that the page continues below: the
 * word "Scroll" over a small arrow that drifts a few pixels. `tone` matches
 * the hero behind it: "light" on porcelain, "dark" on plum.
 *
 * Place it as a direct child of the (relatively positioned) hero; a click
 * scrolls to whatever follows the hero, just below the header.
 */
export default function ScrollDownArrow({ tone = 'light', className = '' }) {
  const wrapperRef = useRef(null)

  const scrollPastHero = () => {
    const hero = wrapperRef.current?.parentElement
    if (!hero) return
    const top = hero.getBoundingClientRect().bottom + window.scrollY - headerOffset()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-none absolute inset-x-0 bottom-3 z-10 hidden justify-center md:flex ${className}`}
    >
      <button
        type="button"
        onClick={scrollPastHero}
        aria-label="Scroll to content"
        className={`pointer-events-auto flex cursor-pointer flex-col items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${TONES[tone]}`}
      >
        Scroll
        <RiArrowDownLine size={16} aria-hidden="true" className="motion-safe:animate-scroll-nudge" />
      </button>
    </div>
  )
}
