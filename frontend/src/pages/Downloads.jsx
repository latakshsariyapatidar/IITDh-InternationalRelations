import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  RiBookReadLine,
  RiFilePaper2Line,
  RiFilePaperLine,
  RiFileTextLine,
  RiGlobalLine,
  RiDownloadCloud2Line,
  RiFilter3Line
} from '@remixicon/react'
import apiClient from '../api/client'
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
          limit: 50,
        }
        if (selectedCategory && selectedCategory !== 'ALL') {
          params.category = selectedCategory
        }
        const res = await apiClient.get('/downloads', { params })
        setDownloads(res.data?.data?.downloads || [])
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
      ADMISSION_FORM: <RiFilePaper2Line size={32} className="text-brand-purple" />,
      VISA_GUIDE: <RiGlobalLine size={32} className="text-brand-purple" />,
      MOU_DOCUMENT: <RiFilePaperLine size={32} className="text-brand-purple" />,
      BROCHURE: <RiBookReadLine size={32} className="text-brand-purple" />,
      OTHER: <RiFileTextLine size={32} className="text-brand-purple" />,
    }
    return icons[category] || <RiFileTextLine size={32} className="text-brand-purple" />
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
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <RiFilter3Line size={16} />
            <span>Category:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => handleCategorySelect(c.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.key
                    ? 'bg-brand-purple text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-purple border-t-transparent mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading resources...</p>
        </div>
      ) : downloadSections.length > 0 ? (
        downloadSections.map((section, sectionIdx) => (
          <section key={section.category || sectionIdx} className={sectionIdx % 2 === 0 ? '' : 'bg-gray-50'}>
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-brand-purpleDark">{section.title}</h2>
                <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                  {section.items.length} {section.items.length === 1 ? 'file' : 'files'}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, idx) => {
                  const resolvedUrl = resolveMediaUrl(item.fileUrl)
                  return (
                    <Card key={idx} className="hover:border-brand-purpleLight/60 border border-gray-100 flex flex-col h-full bg-white shadow-xs hover:shadow-md transition-all">
                      <div className="flex items-start gap-4 h-full flex-col p-2">
                        <div className="flex items-start gap-4 w-full">
                          <div className="flex-shrink-0 mt-1 bg-brand-purpleLight/20 p-3 rounded-xl">{item.icon}</div>
                          <div className="flex-grow">
                            <h3 className="text-base font-bold text-brand-purpleDark mb-1.5 leading-snug">{item.name}</h3>
                            {item.desc && <p className="text-xs text-gray-600 mb-3 line-clamp-3">{item.desc}</p>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-100">
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {item.size}
                          </span>
                          {resolvedUrl ? (
                            <a
                              href={resolvedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-purple hover:text-brand-purpleDark font-semibold text-xs flex items-center gap-1.5 bg-brand-purpleLight/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <RiDownloadCloud2Line size={16} /> Download
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">File unavailable</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>
        ))
      ) : (
        <div className="py-24 text-center text-gray-500">
          <p className="font-semibold text-base mb-1">No resources found</p>
          <p className="text-xs text-gray-400">
            {selectedCategory !== 'ALL'
              ? 'Try selecting "All Resources" to view all available files.'
              : 'No documents are currently available for public download.'}
          </p>
        </div>
      )}

      {/* Contact for Custom Requests */}
      <section className="bg-neutral-canvas py-16 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <SectionHeader
            title="Can't Find What You Need?"
            subtitle="Contact the International Relations Office for customized documentation"
          />
          <Card className="text-center max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-gray-200">
            <p className="text-sm text-gray-700 mb-4">
              We can provide customized documents and additional resources for your specific academic or administrative needs.
            </p>
            <div className="space-y-1.5 text-sm text-gray-700">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:iro@iitdh.ac.in" className="text-brand-purple hover:underline">
                  iro@iitdh.ac.in
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+91-8364-241-200" className="text-brand-purple hover:underline">
                  +91-8364-241-200
                </a>
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
