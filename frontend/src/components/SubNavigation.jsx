import { Link, useLocation } from 'react-router-dom'
import SubNavigationData from '../data/SubNavigationData'

export default function SubNavigation() {
  const location = useLocation()

  return (
    <nav 
      className="relative z-40 bg-brand-purpleDark/90 backdrop-blur-md border-b border-brand-marigold/15" 
    >
      <div className="max-w-7xl flex justify-center mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-0 scrollbar-hide">
          {SubNavigationData.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`shrink-0 px-4 py-3 whitespace-nowrap font-semibold text-xs md:text-sm transition-colors border-b-2 ${
                  isActive
                    ? 'text-brand-marigold border-brand-marigold bg-white/5 font-bold'
                    : 'text-brand-purpleLight/90 hover:bg-white/10 hover:text-white border-transparent hover:border-brand-marigold'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  )
}