import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-700">IRO</span>
            <span className="ml-2 text-sm text-gray-600 hidden sm:block">IITDH</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-700 font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-700 font-medium">
              About Us
            </Link>
            <Link to="/life" className="text-gray-700 hover:text-blue-700 font-medium">
              Life @ IITDH
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-700 font-medium">
              Contact Us
            </Link>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded">
              Home
            </Link>
            <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded">
              About Us
            </Link>
            <Link to="/life" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded">
              Life @ IITDH
            </Link>
            <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded">
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
