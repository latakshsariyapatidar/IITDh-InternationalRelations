import { useRef } from 'react'
import { headerOffset } from '../../utils/scroll'

/**
 * A scroll cue at the bottom of a hero, telling visitors the page continues
 * below:
 *
 *    S C R O L L   D O W N
 *            │
 *            │      a purple highlight runs down the line,
 *            ○      and the dot fills as it arrives
 *
 * Place it as a direct child of the (relatively positioned) hero; a click
 * scrolls to whatever follows the hero, just below the header. Text, line and
 * dot share one centre; the text's padding-left equals its letter-spacing,
 * which is otherwise added after the last letter and pulls the text left.
 */
export default function ScrollDownArrow({ className = '' }) {
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
      className={`pointer-events-none absolute inset-x-0 bottom-3 sm:bottom-5 z-10 flex justify-center ${className}`}
    >
      <button
        type="button"
        onClick={scrollPastHero}
        aria-label="Scroll down"
        className="pointer-events-auto flex cursor-pointer flex-col items-center rounded-sm px-2 py-1 text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        <span className="pl-[0.35em] text-[10px] sm:text-[11px] font-semibold uppercase leading-none tracking-[0.35em] drop-shadow-sm">
          Scroll down
        </span>
        <span aria-hidden="true" className="relative mt-2.5 block h-8 sm:h-12 w-0.5 overflow-hidden rounded-full bg-white/35">
          <span className="absolute inset-x-0 top-0 h-1/2 rounded-full bg-gradient-to-b from-transparent via-brand-purple to-neutral-lavenderMuted motion-safe:animate-scroll-line motion-reduce:hidden" />
        </span>
        <span aria-hidden="true" className="mt-1.5 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white/75 motion-safe:animate-scroll-dot" />
      </button>
    </div>
  )
}
