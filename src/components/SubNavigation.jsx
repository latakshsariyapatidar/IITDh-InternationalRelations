import { Link } from 'react-router-dom'

export default function SubNavigation() {
  return (
    <nav className="sticky top-16 z-40 bg-blue-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-8 py-3 text-sm md:text-base">
          <Link to="/admission" className="text-white hover:text-blue-100 whitespace-nowrap font-medium">
            International Admission
          </Link>
          <Link to="/collaboration" className="text-white hover:text-blue-100 whitespace-nowrap font-medium">
            Collaboration & Mobility
          </Link>
          <Link to="/partners" className="text-white hover:text-blue-100 whitespace-nowrap font-medium">
            Our Partners
          </Link>
          <Link to="/visits" className="text-white hover:text-blue-100 whitespace-nowrap font-medium">
            Visits
          </Link>
          <Link to="/visa" className="text-white hover:text-blue-100 whitespace-nowrap font-medium">
            Visa & Immigration
          </Link>
          <Link to="/gallery" className="text-white hover:text-blue-100 whitespace-nowrap font-medium">
            Gallery
          </Link>
          <Link to="/downloads" className="text-white hover:text-blue-100 whitespace-nowrap font-medium">
            Downloads
          </Link>
        </div>
      </div>
    </nav>
  )
}
