import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
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
    path: '/admission#faqs',
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
    title: 'Faculty Research Profiles',
    path: '/downloads',
    description: 'Directory of IITDH faculty research profiles.',
    keywords: ['faculty', 'research'],
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
    const popularPaths = ['/admission', '/collaboration', '/visa', '/partners', '/downloads', '/visits']
    return items.filter((item) => popularPaths.includes(item.path))
  }, [items])

  return (
    <div>
      <HeroSection
        title="Search"
        subtitle="Find pages, resources, and contacts across the International Relations site"
      />

      <section className="max-w-5xl mx-auto px-4 py-16">
        <SectionHeader
          title="Search the site"
          subtitle="Type a keyword to explore"
        />
        <Card>
          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for admissions, mobility, partners..."
              aria-label="Search the International Relations site"
              className="flex-1 px-4 py-3 border border-brand-purpleLight rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition"
            />
            <button
              type="submit"
              className="bg-brand-purpleDark text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-purple transition-colors"
            >
              Search
            </button>
          </form>
          <p className="text-sm text-neutral-textDark/70 mt-4">
            {hasQuery
              ? `Showing ${results.length} result${results.length === 1 ? '' : 's'} for "${query.trim()}".`
              : 'Start typing to see results instantly.'}
          </p>
        </Card>

        <div className="mt-10">
          <SectionHeader
            title={hasQuery ? `Results (${results.length})` : 'Popular pages'}
            subtitle={hasQuery ? 'Click a result to open the page.' : 'Quick access to frequently visited sections.'}
          />

          {hasQuery && results.length === 0 && (
            <Card className="text-center" hover={false}>
              <p className="text-sm text-neutral-textDark/70">
                No results found. Try a different keyword such as "visa", "admissions", or "partners".
              </p>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {(hasQuery ? results : popularItems).map((item) => (
              <Link key={`${item.title}-${item.path}`} to={item.path} className="block">
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-brand-purpleDark mb-2">{item.title}</h3>
                      <p className="text-sm text-neutral-textDark/70">{item.description}</p>
                    </div>
                    <span className="text-xs text-brand-purple font-semibold">Open</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
