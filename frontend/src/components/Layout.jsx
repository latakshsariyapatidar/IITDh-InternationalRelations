import { useLayoutEffect, useRef } from 'react'
import Navbar from './Navbar'
import SubNavigation from './SubNavigation'
import Footer from './Footer'
import AnnouncementsMarquee from './AnnouncementsMarquee'

export default function Layout({ children }) {
  const headerRef = useRef(null)

  // Publish the sticky header's height as --site-header-h so a hero can fill
  // exactly the rest of the screen. The header grows when the announcements
  // banner loads and differs with screen scaling, hence measured, not fixed.
  // A layout effect, so the height is set before the first paint and before
  // any page's effects (e.g. scrolling to a #hash) measure the layout.
  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return undefined
    const root = document.documentElement
    const publish = () => root.style.setProperty('--site-header-h', `${header.offsetHeight}px`)
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(header)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--site-header-h')
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-porcelain text-body">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-plum focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <header ref={headerRef} className="sticky top-0 z-50 flex flex-col w-full shadow-[0_1px_0_rgb(42_21_56/0.08),0_8px_24px_-16px_rgb(42_21_56/0.25)]">
        <Navbar />
        <SubNavigation />
        <AnnouncementsMarquee />
      </header>
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
