import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiSearchLine, RiMenuLine, RiCloseLine } from '@remixicon/react'
// import LanguageSelector from './LanguageSelector'
import NavigationLinks from '../data/NavigationLinks'
import SubNavigationData from '../data/SubNavigationData'
import { useSiteContent } from '../contexts/SiteContentContext'

const isCurrent = (pathname, path) =>
  path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { getContent } = useSiteContent()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    // Lock scrolling on <html> only. Setting overflow on <body> as well stops
    // it propagating to the viewport, so <body> becomes its own scroll box and
    // the sticky header snaps back to the top of the document: opened from
    // halfway down a page, the menu appeared far above the screen with
    // scrolling locked, and the site looked frozen.
    const { documentElement } = document
    const previousHtmlOverflow = documentElement.style.overflow

    documentElement.style.overflow = 'hidden'

    return () => {
      documentElement.style.overflow = previousHtmlOverflow
    }
  }, [isOpen])

  // The search page gets an icon of its own; the other links are listed as text.
  const textLinks = NavigationLinks.filter((item) => item.path !== '/search')
  const searchLink = NavigationLinks.find((item) => item.path === '/search')

  return (
    <nav aria-label="Site" className="relative z-50 bg-white text-plum-deep">
      {/* In future uncomment this code if you want to display the contact information and language selector */}
      {/* <div className="bg-white border-b border-brand-purple/10">
        <div className="max-w-7xl mx-auto px-4 py-1 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-4 text-xs font-medium text-brand-purple">
            <div className="flex items-center gap-2">
              <span>Email</span>
              <a href="mailto:iro@iitdh.ac.in" className="hover:text-brand-marigold">iro@iitdh.ac.in</a>
            </div>
            <div className="flex items-center gap-2">
              <span>Phone</span>
              <span>+91-836-XXXXXXX</span>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </div> */}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[4.5rem] gap-3 lg:gap-6">
          {/* Logo. On narrow phones it shrinks and the title wraps; held at
              full width it pushed the menu button off the right edge. */}
          <Link to="/" className="flex min-w-0 items-center gap-3 lg:shrink-0 rounded-md">
            <img
              src={getContent("site.logoUrl", "/IITDh Logo.svg")}
              alt="IIT Dharwad"
              className="h-10 sm:h-12 w-auto shrink-0"
            />
            <span className="flex min-w-0 flex-col border-l border-mist pl-3">
              <span className="font-heading! text-[0.98rem] sm:text-lg font-medium leading-tight text-plum-deep">International Relations Office</span>
              <span className="hidden sm:block text-xs text-quiet leading-tight mt-0.5">Indian Institute of Technology Dharwad</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {textLinks.map((item) => {
              const current = isCurrent(pathname, item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={current ? 'page' : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    current ? 'bg-plum-tint text-plum-deep' : 'text-body hover:text-plum-deep hover:bg-porcelain'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {searchLink && (
              <Link
                to={searchLink.path}
                aria-label={searchLink.label}
                className={`ml-2 inline-flex h-10 items-center gap-2 rounded-full pl-3.5 pr-4 text-sm font-medium ring-1 ring-inset transition-colors ${
                  isCurrent(pathname, searchLink.path)
                    ? 'bg-plum text-white ring-plum'
                    : 'text-body ring-mist hover:ring-plum/40 hover:text-plum-deep'
                }`}
              >
                <RiSearchLine size={17} aria-hidden="true" />
                <span>{searchLink.label}</span>
              </Link>
            )}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            {searchLink && (
              <Link
                to={searchLink.path}
                aria-label={searchLink.label}
                className="p-2.5 rounded-full text-plum-deep hover:bg-plum-tint transition-colors"
              >
                <RiSearchLine size={22} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="p-2.5 rounded-full text-plum-deep hover:bg-plum-tint transition-colors"
            >
              {isOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu: everything in one place, the six main sections first */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-y-auto border-t border-mist bg-white transition-all duration-500 ease-custom-bezier motion-reduce:transition-none ${
          isOpen
            ? 'max-h-[calc(100dvh-4.5rem)] opacity-100 translate-y-0'
            : 'max-h-0 opacity-0 -translate-y-2 border-t-transparent'
        }`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid gap-6 sm:grid-cols-2">
          <ul>
            {SubNavigationData.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 font-heading! text-xl text-plum-deep hover:text-plum"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="border-t border-mist pt-4 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
            {textLinks.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2.5 text-[0.95rem] font-medium ${isCurrent(pathname, item.path) ? 'text-plum' : 'text-body hover:text-plum-deep'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
