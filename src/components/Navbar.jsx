import { useState } from 'react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Collaboration', path: '/collaboration' },
    { label: 'Admission', path: '/admission' },
    { label: 'Partners', path: '/partners' },
    { label: 'Visa', path: '/visa' },
    { label: 'Downloads', path: '/downloads' },
    { label: 'Life @ IITDH', path: '/life' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-[#FEFBF6] border-b border-[#7F5283]/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-4 text-xs font-medium text-[#7F5283]">
            <div className="flex items-center gap-2">
              <span>✉</span>
              <a href="mailto:iro@iitdh.ac.in" className="hover:text-[#A6D1E6]">iro@iitdh.ac.in</a>
            </div>
            <div className="flex items-center gap-2">
              <span>☎</span>
              <span>+91-836-XXXXXXX</span>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* Main Navbar */}
      <div className="border-b border-[#FEFBF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/IITDh Logo.svg"
                alt="IIT Dharwad"
                className="h-12 w-auto"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold text-[#7F5283]">IRO</span>
                <span className="text-xs font-semibold text-[#7F5283]">IITDH</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {menuItems.slice(0, 5).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-[#A6D1E6] font-semibold text-sm transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A6D1E6] group-hover:w-full transition-all"></span>
                </Link>
              ))}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#FEFBF6] transition-colors"
            >
              <svg className="w-6 h-6 text-[#7F5283]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          {isOpen && (
            <div className="lg:hidden pb-4 border-t border-[#FEFBF6]">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-[#FEFBF6] hover:text-[#7F5283] font-medium transition-colors border-b border-[#FEFBF6]/50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
