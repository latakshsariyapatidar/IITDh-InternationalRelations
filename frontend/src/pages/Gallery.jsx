import HeroSection from '../components/HeroSection'
import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import { RiImage2Line } from '@remixicon/react'
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
      <div className="sticky top-[var(--site-header-h,140px)] z-20 border-b border-mist bg-porcelain/95 backdrop-blur">
        <div role="group" aria-label="Category" className="scrollbar-hide mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedCategory(c.key)}
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

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Moments & Memories</h2>

          {loading ? (
            <p className="py-16 text-center text-quiet">Loading gallery photos...</p>
          ) : images.length > 0 ? (
            <>
              {/* Masonry columns keep each photograph at its own proportions */}
              <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                {images.map((item) => {
                  const resolvedUrl = resolveMediaUrl(item.imageUrl)
                  return (
                    <li key={item.id} className="mb-4 break-inside-avoid">
                      <figure className="overflow-hidden rounded-2xl border border-mist bg-white">
                        {resolvedUrl ? (
                          <img
                            src={resolvedUrl}
                            alt={item.title}
                            loading="lazy"
                            className="block w-full bg-mist"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center bg-mist">
                            <RiImage2Line size={32} aria-hidden="true" className="text-quiet" />
                          </div>
                        )}
                        <figcaption className="px-4 py-3">
                          <p className="font-medium leading-snug text-plum-deep">{item.title}</p>
                          {item.caption && (
                            <p className="mt-0.5 text-sm text-quiet line-clamp-2">{item.caption}</p>
                          )}
                          {item.takenAt && (
                            <p className="mt-1 text-xs text-quiet nums-tabular">{formatDay(item.takenAt, 'en-US')}</p>
                          )}
                        </figcaption>
                      </figure>
                    </li>
                  )
                })}
              </ul>

              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex h-11 cursor-pointer items-center rounded-full px-6 text-sm font-semibold text-plum ring-1 ring-inset ring-plum/35 transition-colors hover:bg-plum-tint disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading more photos...' : 'Load More Photos'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-mist bg-white p-12 text-center">
              <p className="text-lg font-medium text-plum-deep">No photos in this category</p>
              <p className="mt-1 text-sm text-quiet">Please choose a different category or check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
