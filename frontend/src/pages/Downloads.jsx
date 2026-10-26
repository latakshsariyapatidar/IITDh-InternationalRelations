import HeroSection from '../components/HeroSection'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  RiBookReadLine,
  RiFilePaper2Line,
  RiFilePaperLine,
  RiFileTextLine,
  RiGlobalLine,
  RiDownloadLine
} from '@remixicon/react'
import { fetchAllPages } from '../api/fetchAllPages'
import { resolveMediaUrl } from '../utils/media'

const CATEGORIES = [
  { key: 'ALL', label: 'All Resources' },
  { key: 'ADMISSION_FORM', label: 'Admission Forms' },
  { key: 'VISA_GUIDE', label: 'Visa Guides' },
  { key: 'MOU_DOCUMENT', label: 'MOU Documents' },
  { key: 'BROCHURE', label: 'Brochures' },
  { key: 'OTHER', label: 'General / Other' },
]

export default function Downloads() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'ALL'
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true)
      try {
        const params = {
          isPublic: true,
        }
        if (selectedCategory && selectedCategory !== 'ALL') {
          params.category = selectedCategory
        }
        // Every page: the route returns at most 50 documents at a time
        setDownloads(await fetchAllPages('/downloads', 'downloads', { pageSize: 50, params }))
      } catch (err) {
        console.error('Failed to fetch downloads', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDownloads()
  }, [selectedCategory])

  const handleCategorySelect = (catKey) => {
    setSelectedCategory(catKey)
    if (catKey === 'ALL') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ category: catKey })
    }
  }

  const getCategoryTitle = (category) => {
    const titles = {
      ADMISSION_FORM: 'Admission Forms',
      VISA_GUIDE: 'Visa & Immigration Guides',
      MOU_DOCUMENT: 'Partnership & MOU Documents',
      BROCHURE: 'Brochures & Factsheets',
      OTHER: 'General Resources',
    }
    return titles[category] || 'Resources'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      ADMISSION_FORM: <RiFilePaper2Line size={22} />,
      VISA_GUIDE: <RiGlobalLine size={22} />,
      MOU_DOCUMENT: <RiFilePaperLine size={22} />,
      BROCHURE: <RiBookReadLine size={22} />,
      OTHER: <RiFileTextLine size={22} />,
    }
    return icons[category] || <RiFileTextLine size={22} />
  }

  const groupedDownloads = downloads.reduce((acc, current) => {
    const cat = current.category || 'OTHER'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(current)
    return acc
  }, {})

  const downloadSections = Object.keys(groupedDownloads).map((category) => ({
    category,
    title: getCategoryTitle(category),
    items: groupedDownloads[category].map((item) => ({
      name: item.title,
      desc: item.description,
      icon: getCategoryIcon(category),
      size: item.fileType ? `${item.fileType.toUpperCase()}` : 'PDF',
      fileUrl: item.fileUrl,
    })),
  }))

  return (
    <div>
      <HeroSection
        title="Downloads & Resources"
        subtitle="Official application kits, bilateral agreements, visa guidelines, and institutional factsheets"
        backgroundImage="/institute/institute6.webp"
      />

      {/* Filter Tabs */}
      <div className="sticky top-[var(--site-header-h,140px)] z-20 border-b border-mist bg-porcelain/95 backdrop-blur">
        <div role="group" aria-label="Category" className="scrollbar-hide mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => handleCategorySelect(c.key)}
              aria-pressed={selectedCategory === c.key}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.key
                  ? 'bg-plum text-white'
                  : 'bg-white text-body ring-1 ring-inset ring-mist hover:text-plum-deep hover:ring-plum/30'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        {loading ? (
          <p className="py-16 text-center text-quiet">Loading resources...</p>
        ) : downloadSections.length > 0 ? (
          <div className="space-y-16">
            {downloadSections.map((section, sectionIdx) => (
              <section key={section.category || sectionIdx} aria-labelledby={`dl-${section.category}`}>
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h2 id={`dl-${section.category}`} className="text-3xl font-medium text-plum-deep">{section.title}</h2>
                  <span className="text-sm text-quiet nums-tabular">
                    {section.items.length} {section.items.length === 1 ? 'file' : 'files'}
                  </span>
                </div>
                <ul className="divide-y divide-mist overflow-hidden rounded-2xl border border-mist bg-white">
                  {section.items.map((item, idx) => {
                    const resolvedUrl = resolveMediaUrl(item.fileUrl)
                    return (
                      <li key={idx} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          <span aria-hidden="true" className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-plum-tint text-plum">{item.icon}</span>
                          <div className="min-w-0">
                            <h3 className="text-lg font-medium leading-snug text-plum-deep">{item.name}</h3>
                            {item.desc && <p className="mt-1 text-sm text-quiet line-clamp-2">{item.desc}</p>}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-4 pl-15 sm:pl-0">
                          <span className="text-xs font-semibold text-quiet">{item.size}</span>
                          {resolvedUrl ? (
                            <a
                              href={resolvedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-plum ring-1 ring-inset ring-plum/30 transition-colors hover:bg-plum hover:text-white"
                            >
                              <RiDownloadLine size={16} aria-hidden="true" /> Download
                            </a>
                          ) : (
                            <span className="text-sm text-quiet">File unavailable</span>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-mist bg-white p-12 text-center">
            <p className="text-lg font-medium text-plum-deep">No resources found</p>
            <p className="mt-1 text-sm text-quiet">
              {selectedCategory !== 'ALL'
                ? 'Try selecting "All Resources" to view all available files.'
                : 'No documents are currently available for public download.'}
            </p>
          </div>
        )}
      </div>

      {/* Contact for Custom Requests */}
      <section className="bg-white border-t border-mist py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-12 md:items-end lg:px-8">
          <div className="md:col-span-7">
            <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] text-plum-deep">Can't find what you need?</h2>
            <p className="mt-3 text-lg text-quiet">
              Contact the International Relations Office for customized documentation. We can provide documents and additional resources for your specific academic or administrative needs.
            </p>
          </div>
          <dl className="space-y-2 md:col-span-5 md:text-right">
            <div>
              <dt className="sr-only">Email</dt>
              <dd><a href="mailto:iro@iitdh.ac.in" className="font-heading! text-2xl text-plum underline decoration-saffron underline-offset-[6px] hover:decoration-plum">iro@iitdh.ac.in</a></dd>
            </div>
            <div>
              <dt className="sr-only">Phone</dt>
              <dd><a href="tel:+91-8364-241-200" className="text-body hover:text-plum nums-tabular">+91-8364-241-200</a></dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
