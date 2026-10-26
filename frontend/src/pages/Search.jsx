import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiSearchLine, RiArrowRightLine } from '@remixicon/react'
import SectionHeader from '../components/ui/SectionHeader'
import NavigationLinks from '../data/NavigationLinks'
import SubNavigationData from '../data/SubNavigationData'

const pageMetaByPath = {
  '/': {
    description: 'International Relations Office overview and highlights.',
    keywords: ['home', 'iro', 'overview', 'campus'],
  },
  '/about': {
    description: 'Leadership, faculty advisors, and the international relations team.',
    keywords: ['team', 'leadership', 'faculty'],
  },
  '/life': {
    description: 'Campus life, accommodation, dining, and student experience.',
    keywords: ['campus', 'hostel', 'food', 'student life'],
  },
  '/contact': {
    description: 'Contact the International Relations Office and send a message.',
    keywords: ['email', 'phone', 'address'],
  },
  '/international-admissions': {
    description: 'Admissions and degree application guidance for international students.',
    keywords: ['apply', 'admission', 'degree', 'international admissions'],
  },
  '/international-mobility': {
    description: 'International mobility, exchange programs, and research internships.',
    keywords: ['exchange', 'mobility', 'internship', 'visiting', 'programs'],
  },
  '/admission': {
    description: 'Admissions and application guidance for international students.',
    keywords: ['apply', 'admission', 'international'],
  },
  '/collaboration': {
    description: 'International mobility opportunities for students and faculty.',
    keywords: ['exchange', 'mobility', 'programs'],
  },
  '/partners': {
    description: 'Global partner universities and organizations.',
    keywords: ['partners', 'mou', 'collaboration'],
  },
  '/visa': {
    description: 'Visa and immigration information for visitors and students.',
    keywords: ['visa', 'frro', 'immigration'],
  },
  '/visits': {
    description: 'International delegations, visits, and guest information.',
    keywords: ['delegation', 'guesthouse', 'visit'],
  },
  '/downloads': {
    description: 'Documents, guides, and downloadable resources.',
    keywords: ['documents', 'forms', 'resources'],
  },
  '/gallery': {
    description: 'Photo and video gallery of IIT Dharwad.',
    keywords: ['photos', 'videos', 'campus'],
  },
}

const quickLinks = [
  {
    title: 'FAQs',
    path: '/international-admissions#faqs',
    description: 'Common questions on admissions and programs.',
    keywords: ['faq', 'questions'],
  },
  {
    title: 'Campus Map',
    path: '/contact#campus-map',
    description: 'Find the International Relations Office on campus.',
    keywords: ['map', 'location'],
  },
  {
    title: 'Feedback',
    path: '/contact#feedback',
    description: 'Share feedback with the International Relations Office.',
    keywords: ['feedback', 'message'],
  },
  {
    title: 'Students Council',
    path: '/life',
    description: 'Student life and campus community updates.',
    keywords: ['student council', 'community'],
  },
  {
    title: 'Buy & Cell @ IITDH',
    path: '/life',
    description: 'Campus community services and resources.',
    keywords: ['buy', 'sell', 'cell'],
  },
  {
    title: 'Guesthouse',
    path: '/visits#visitor-info',
    description: 'Visitor information and guesthouse details.',
    keywords: ['guesthouse', 'stay'],
  },
]

const buildItem = (title, path, overrides = {}) => {
  const meta = pageMetaByPath[path] || {}
  const description = overrides.description || meta.description || 'Learn more about this section.'
  const keywords = [...(meta.keywords || []), ...(overrides.keywords || [])]

  return {
    title,
    path,
    description,
    keywords,
  }
}

export default function Search() {
  const [query, setQuery] = useState('')

  const items = useMemo(() => {
    const navItems = NavigationLinks
      .filter((item) => item.path !== '/search')
      .map((item) => buildItem(item.label, item.path))

    const subNavItems = SubNavigationData.map((item) => buildItem(item.label, item.to))

    const extraItems = [buildItem('Gallery', '/gallery')]

    const combined = [...navItems, ...subNavItems, ...extraItems, ...quickLinks.map((item) => buildItem(item.title, item.path, item))]
    const unique = new Map()

    combined.forEach((item) => {
      const key = `${item.title}|${item.path}`
      if (!unique.has(key)) {
        unique.set(key, item)
      }
    })

    return Array.from(unique.values())
  }, [])

  const normalizedQuery = query.trim().toLowerCase()
  const hasQuery = normalizedQuery.length > 0

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return []
    }

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean)

    return items.filter((item) => {
      const searchable = `${item.title} ${item.description} ${item.keywords.join(' ')} ${item.path}`.toLowerCase()
      return tokens.every((token) => searchable.includes(token))
    })
  }, [items, normalizedQuery])

  const popularItems = useMemo(() => {
    const popularPaths = ['/international-admissions', '/international-mobility', '/visa', '/partners', '/downloads', '/visits']
    return items.filter((item) => popularPaths.includes(item.path))
  }, [items])

  return (
    <div>
      {/* Search is a tool, not a story: the field sits in the header itself. */}
      <div className="bg-porcelain border-b border-mist">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-20">
          <h1 className="text-[2.6rem] sm:text-5xl font-medium leading-[1.05] tracking-[-0.02em] text-plum-deep">Search</h1>
          <p className="mt-3 text-lg text-body">Find pages, resources, and contacts across the International Relations site</p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
            role="search"
          >
            <div className="relative flex-1">
              <RiSearchLine size={22} aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-quiet" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for admissions, mobility, partners..."
                aria-label="Search the International Relations site"
                autoFocus
                className="h-14 w-full rounded-full border border-mist bg-white pl-14 pr-5 text-lg text-plum-deep placeholder:text-quiet focus:border-plum focus:outline-none focus:ring-4 focus:ring-plum/10"
              />
            </div>
            <button
              type="submit"
              className="h-14 cursor-pointer rounded-full bg-plum px-8 font-semibold text-white transition-colors hover:bg-plum-deep"
            >
              Search
            </button>
          </form>
          <p className="mt-4 text-sm text-quiet" aria-live="polite">
            {hasQuery
              ? `Showing ${results.length} result${results.length === 1 ? '' : 's'} for "${query.trim()}".`
              : 'Start typing to see results instantly.'}
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-16">
        <SectionHeader
          title={hasQuery ? `Results (${results.length})` : 'Popular pages'}
          subtitle={hasQuery ? 'Click a result to open the page.' : 'Quick access to frequently visited sections.'}
        />

        {hasQuery && results.length === 0 && (
          <p className="rounded-2xl border border-dashed border-mist bg-white p-8 text-center text-quiet">
            No results found. Try a different keyword such as "visa", "admissions", or "partners".
          </p>
        )}

        <ul className="divide-y divide-mist border-y border-mist">
          {(hasQuery ? results : popularItems).map((item) => (
            <li key={`${item.title}-${item.path}`}>
              <Link to={item.path} className="group flex items-start justify-between gap-6 py-5 hover:bg-white">
                <div>
                  <h3 className="text-xl font-medium text-plum-deep group-hover:text-plum">{item.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-quiet">{item.description}</p>
                </div>
                <RiArrowRightLine size={20} aria-hidden="true" className="mt-1.5 shrink-0 text-saffron-deep transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
