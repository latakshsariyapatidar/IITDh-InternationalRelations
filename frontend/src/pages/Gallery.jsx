import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import { RiImage2Line, RiCalendarLine, RiFilter3Line } from '@remixicon/react'
import { resolveMediaUrl } from '../utils/media'
import { formatDay } from '../utils/formatDay'

const CATEGORIES = [
  { key: 'ALL', label: 'All Photos' },
  { key: 'CAMPUS', label: 'Campus' },
  { key: 'EVENTS', label: 'Events' },
  { key: 'STUDENT_LIFE', label: 'Student Life' },
  { key: 'COLLABORATIONS', label: 'Collaborations & Visits' },
  { key: 'OTHER', label: 'Other' },
]

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchGallery = async (pageNum = 1, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    try {
      const params = {
        isPublic: true,
        limit: 24,
        page: pageNum,
      }
      if (selectedCategory !== 'ALL') {
        params.category = selectedCategory
      }
      const res = await apiClient.get('/gallery', { params })
      const fetched = res.data?.data?.images || []
      const total = res.data?.data?.total || 0

      if (append) {
        setImages((prev) => [...prev, ...fetched])
      } else {
        setImages(fetched)
      }
      setHasMore(pageNum * 24 < total)
    } catch (err) {
      console.error('Failed to fetch gallery images', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchGallery(1, false)
  }, [selectedCategory])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchGallery(nextPage, true)
  }

  return (
    <div>
      <HeroSection
        title="Gallery"
        subtitle="Explore vibrant campus life, landmark delegations, and research at IIT Dharwad"
        backgroundImage="/institute/institute9.webp"
      />

      {/* Category Filter Bar */}
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
                onClick={() => setSelectedCategory(c.key)}
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

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Moments & Memories"
            subtitle="Campus vistas, academic symposiums, and cultural engagements"
          />

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-purple border-t-transparent mb-3" />
              <p className="text-sm font-medium text-gray-500">Loading gallery photos...</p>
            </div>
          ) : images.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((item) => {
                  const resolvedUrl = resolveMediaUrl(item.imageUrl)
                  return (
                    <div
                      key={item.id}
                      className="bg-brand-purpleLight/10 rounded-xl aspect-square flex flex-col justify-end hover:shadow-lg transition-all group overflow-hidden relative border border-gray-100"
                    >
                      {resolvedUrl ? (
                        <>
                          <img
                            src={resolvedUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                            <h3 className="text-white font-bold text-sm leading-snug mb-1">{item.title}</h3>
                            {item.caption && (
                              <p className="text-white/80 text-xs line-clamp-2 mb-2">{item.caption}</p>
                            )}
                            {item.takenAt && (
                              <p className="text-white/70 text-[11px] flex items-center gap-1 font-medium">
                                <RiCalendarLine size={13} className="text-brand-marigold" />
                                <span>{formatDay(item.takenAt, 'en-US')}</span>
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 my-auto">
                          <RiImage2Line size={32} className="mx-auto text-brand-purple/50 mb-2" />
                          <p className="text-gray-700 font-semibold text-sm">{item.title}</p>
                          {item.takenAt && (
                            <p className="text-gray-400 text-xs mt-1">
                              {formatDay(item.takenAt, 'en-US')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-purple bg-white px-6 py-2.5 text-sm font-bold text-brand-purple shadow-xs hover:bg-brand-purple hover:text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading more photos...' : 'Load More Photos'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center text-gray-500">
              <p className="font-semibold text-base mb-1">No photos in this category</p>
              <p className="text-xs text-gray-400">Please choose a different category or check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
