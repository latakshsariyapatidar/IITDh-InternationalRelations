import { Link, useLocation } from 'react-router-dom'
import SubNavigationData from '../data/SubNavigationData'

export default function SubNavigation() {
  const location = useLocation()

  return (
    <nav aria-label="Main sections" className="relative z-40 bg-plum">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-hide -mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:-ml-4">
          {SubNavigationData.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`relative shrink-0 px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-4 bottom-0 h-[3px] rounded-t-full bg-saffron transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
