import { Link } from 'react-router-dom'

export default function SubNavigation() {
  return (
    <nav className="sticky z-40 bg-[#7F5283] shadow-md" style={{ top: 'var(--nav-height, 64px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-0 scrollbar-hide">
          {[
            { label: '🎓 Incoming Students', to: '/admission' },
            { label: '✈️ Outgoing Students', to: '/collaboration' },
            { label: '🤝 Our Partners', to: '/partners' },
            { label: '📋 Visa & Immigration', to: '/visa' },
            { label: '🖼️ Gallery', to: '/gallery' },
            { label: '📥 Downloads', to: '/downloads' },
            { label: '🏢 Life @ IITDH', to: '/life' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex-shrink-0 px-4 py-3 text-white hover:bg-[#A6D1E6] hover:text-[#2d0a1e] whitespace-nowrap font-semibold text-xs md:text-sm transition-colors border-b-2 border-transparent hover:border-[#A6D1E6]"
            >
              {item.label}
            </Link>
          ))}
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
