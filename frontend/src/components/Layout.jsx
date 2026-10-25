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
    <div className="flex flex-col min-h-screen bg-white">
      <header ref={headerRef} className="sticky top-0 z-50 flex flex-col w-full shadow-md">
        <Navbar />
        <SubNavigation />
        <AnnouncementsMarquee />
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
