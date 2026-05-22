import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import NavigationLinks from '../data/navigationLinks'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const { body, documentElement } = document
    const previousBodyOverflow = body.style.overflow
    const previousHtmlOverflow = documentElement.style.overflow

    body.style.overflow = 'hidden'
    documentElement.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      documentElement.style.overflow = previousHtmlOverflow
    }
  }, [isOpen])

  return (
    <nav className="sticky top-0 z-50 bg-brand-purpleDark text-white">
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
      </div> */
      }

      {/* Main Navbar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/IITDh logo white.svg"
                alt="IIT Dharwad"
                className="h-12 w-auto"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold text-white">International Relations</span>
                <span className="text-xs font-semibold text-brand-purpleLight/80">Indian Institute of Technology, Dharwad</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {NavigationLinks.slice(0, 5).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-brand-purpleLight/85 hover:text-brand-marigold font-semibold text-sm transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-marigold group-hover:w-full transition-all"></span>
                </Link>
              ))}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden border-t border-white/10 bg-brand-purple transition-all duration-500 ease-custom-bezier motion-reduce:transition-none ${
              isOpen
                ? 'max-h-128 opacity-100 translate-y-0 pb-4'
                : 'max-h-0 opacity-0 -translate-y-2 pb-0 border-t-transparent'
            }`}
            aria-hidden={!isOpen}
          >
            <div className="pt-2">
              {NavigationLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-brand-purpleLight/90 hover:bg-white/10 hover:text-brand-marigold font-medium transition-colors border-b border-white/10 last:border-b-0"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
