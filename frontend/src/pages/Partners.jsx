import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import {
  RiSearchLine,
  RiExternalLinkLine,
  RiFileDownloadLine,
  RiCheckDoubleLine,
  RiRefreshLine,
  RiCloseLine,
  RiLockLine
} from '@remixicon/react'
import apiClient from '../api/client'
import { fetchAllPages } from '../api/fetchAllPages'
import { useAuth } from '../contexts/AuthContext'
import { useStudentAuth } from '../contexts/StudentAuthContext'
import { formatDay } from '../utils/formatDay';

const countryCodeMap = {
  Australia: 'au',
  Canada: 'ca',
  France: 'fr',
  Germany: 'de',
  Japan: 'jp',
  Singapore: 'sg',
  Switzerland: 'ch',
  'United Kingdom': 'gb',
  'United States': 'us',
  USA: 'us',
  Italy: 'it',
  Norway: 'no',
  Finland: 'fi',
  Taiwan: 'tw',
  India: 'in',
  Spain: 'es',
  Sweden: 'se',
  Netherlands: 'nl',
}

const resolveCountryCode = (country, countryCode) => {
  if (countryCode && countryCode.trim()) {
    return countryCode.trim().toLowerCase()
  }
  return countryCodeMap[country]?.toLowerCase() || ''
}

const resolveLogoUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  const backendOrigin = (apiClient.defaults?.baseURL || '').replace('/api/v1', '')
  return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`
}

const mouFileName = (name, mouId) => `MOU_${(name || mouId).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`

const saveFile = (url, fileName) => {
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// Asked for as a blob, so an error body arrives as a Blob too; the backend's
// message is the JSON inside it.
const blobErrorMessage = async (err) => {
  const data = err?.response?.data
  if (data instanceof Blob) {
    try {
      return JSON.parse(await data.text())?.message
    } catch {
      return undefined
    }
  }
  return data?.message
}

function FlagIcon({ country, code, className = "h-3.5 w-auto rounded-[2px] ring-1 ring-black/5" }) {
  if (!code) {
    return null
  }

  return (
    <img
      src={`https://flagcdn.com/h80/${code}.png`}
      srcSet={`https://flagcdn.com/h160/${code}.png 2x, https://flagcdn.com/h240/${code}.png 3x`}
      height="80"
      alt={`${country || 'Country'} flag`}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.target.style.display = 'none'
      }}
    />
  )
}

// How the office partners, from the MoU Partners page.
const AGREEMENT_TYPES = [
  ['General MoU', 'Facilitates research activities and other forms of academic cooperation.'],
  ['Bilateral MoU or agreement', 'Facilitates joint degrees, dual degrees, cotutelle and semester exchange programmes, inbound and outbound.'],
]
const NETWORKS = ["TU9 German universities and the IITs", "Finnish universities and the IITs", "French universities and the IITs"]
const PROJECTS = ['Erasmus mobility programmes', 'Erasmus capacity building projects', 'SPARC']

function PartnerLogo({ name, logoUrl, size = 'h-11 w-11' }) {
  return (
    <div className={`${size} shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-inset ring-mist flex items-center justify-center font-heading! text-lg text-ink`}>
      {logoUrl ? (
        <img
          src={resolveLogoUrl(logoUrl)}
          alt=""
          className="h-full w-full object-contain p-1.5"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            if (e.currentTarget.nextElementSibling) {
              e.currentTarget.nextElementSibling.style.display = 'flex'
            }
          }}
        />
      ) : null}
      <span
        className="items-center justify-center w-full h-full text-center"
        style={{ display: logoUrl ? 'none' : 'flex' }}
      >
        {name.charAt(0)}
      </span>
    </div>
  )
}

function StatusBadge({ status, label }) {
  const active = status === 'ACTIVE'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-emerald-50 text-emerald-800' : 'bg-saffron-tint text-saffron-deep'}`}>
      {active && <RiCheckDoubleLine size={13} aria-hidden="true" />}
      {label}
    </span>
  )
}

export default function Partners() {
  const navigate = useNavigate()
  const [partners, setPartners] = useState([])
  const [mous, setMous] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters and UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('all') // 'all' | 'universities' | 'organizations' | 'mous'
  const [selectedCountry, setSelectedCountry] = useState('ALL')
  const [showAllUniversities, setShowAllUniversities] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)

  // The MOU document loaded for authenticated viewing
  const [readyMou, setReadyMou] = useState(null)

  const { isAdminAuthenticated, loading: adminAuthLoading } = useAuth()
  const { isStudentAuthenticated, loading: campusAuthLoading } = useStudentAuth()
  const authLoading = adminAuthLoading || campusAuthLoading
  const signedIn = isAdminAuthenticated || isStudentAuthenticated

  const [searchParams, setSearchParams] = useSearchParams()
  const returnMouId = searchParams.get('mou')
  const returnHandledRef = useRef(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1.9 Stop swallowing errors so error banner can appear
      const [fetchedPartners, fetchedMous] = await Promise.all([
        fetchAllPages('/partners', 'partners', { pageSize: 100 }),
        fetchAllPages('/mous', 'mous', { pageSize: 100 }),
      ])

      setPartners(fetchedPartners)
      setMous(fetchedMous)
    } catch (err) {
      console.error('Error in fetching partner and MOU data:', err)
      setError('Unable to load partner and MOU information at this time. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // The signed PDF is restricted to IIT Dharwad accounts (campus sign-in or admin).
  // If not signed in, redirect directly to the student login page.
  const handleDownloadMou = useCallback(async (mouId, partnerName, { afterSignIn = false } = {}) => {
    if (!authLoading && !signedIn) {
      navigate(`/students?next=${encodeURIComponent(`/partners?mou=${mouId}`)}`)
      return
    }
    try {
      setDownloadingId(mouId)
      const res = await apiClient.get(`/mous/${mouId}/document`, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const fileName = mouFileName(partnerName, mouId)

      // Open in a new tab so the student can immediately see it
      if (!afterSignIn) {
        const opened = window.open(url, '_blank')
        if (!opened) {
          saveFile(url, fileName)
        }
      }
      setReadyMou({ url, fileName, partnerName })
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate(`/students?next=${encodeURIComponent(`/partners?mou=${mouId}`)}`)
      } else {
        const msg = (await blobErrorMessage(err)) || err.message || 'MOU document unavailable'
        alert('MOU document unavailable: ' + msg)
      }
    } finally {
      setDownloadingId(null)
    }
  }, [authLoading, signedIn, navigate])

  const handleMouClick = useCallback((mou, partnerName) => {
    if (!mou.hasDocument) {
      alert('No signed document has been uploaded for this MOU yet.')
      return
    }
    handleDownloadMou(mou.id, partnerName)
  }, [handleDownloadMou])

  // Back from signing in (/partners?mou=<id>): download the MOU that asked for it.
  useEffect(() => {
    if (!returnMouId || returnHandledRef.current || loading || authLoading) return
    returnHandledRef.current = true
    setSearchParams((params) => {
      params.delete('mou')
      return params
    }, { replace: true })
    const mou = mous.find((m) => m.id === returnMouId)
    handleDownloadMou(returnMouId, mou?.partner?.name || mou?.title, { afterSignIn: true })
  }, [returnMouId, loading, authLoading, mous, handleDownloadMou, setSearchParams])

  useEffect(() => {
    if (!readyMou) return undefined
    return () => window.URL.revokeObjectURL(readyMou.url)
  }, [readyMou])

  // Segment partners into categories
  const universities = useMemo(
    () => partners.filter((p) => p.type === 'UNIVERSITY' && p.isActive !== false),
    [partners]
  )

  const organizations = useMemo(
    () => partners.filter((p) => p.type !== 'UNIVERSITY' && p.isActive !== false),
    [partners]
  )

  // Unique country list
  const countries = useMemo(() => {
    const set = new Set()
    partners.forEach((p) => {
      if (p.country) set.add(p.country)
    })
    return Array.from(set).sort()
  }, [partners])

  // Filtered lists based on search and country filter
  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (uni.focus && uni.focus.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCountry = selectedCountry === 'ALL' || uni.country === selectedCountry
      return matchesSearch && matchesCountry
    })
  }, [universities, searchQuery, selectedCountry])

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.focus && org.focus.toLowerCase().includes(searchQuery.toLowerCase())) ||
        org.type.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCountry = selectedCountry === 'ALL' || org.country === selectedCountry
      return matchesSearch && matchesCountry
    })
  }, [organizations, searchQuery, selectedCountry])

  const filteredMous = useMemo(() => {
    return mous.filter((mou) => {
      const partnerName = mou.partner?.name || mou.title || ''
      const country = mou.partner?.country || ''
      const scope = mou.scope || ''

      const matchesSearch =
        searchQuery.trim() === '' ||
        partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scope.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCountry = selectedCountry === 'ALL' || country === selectedCountry
      return matchesSearch && matchesCountry
    })
  }, [mous, searchQuery, selectedCountry])

  // Count active MOUs per partner
  const partnerMouMap = useMemo(() => {
    const map = {}
    mous.forEach((m) => {
      if (m.partnerId) {
        if (!map[m.partnerId]) map[m.partnerId] = []
        map[m.partnerId].push(m)
      }
    })
    return map
  }, [mous])

  // Display subset of universities or all
  const displayedUniversities = showAllUniversities
    ? filteredUniversities
    : filteredUniversities.slice(0, 6)

  const tabs = [
    { id: 'all', label: 'All collaborations', count: partners.length },
    { id: 'universities', label: 'Universities', count: universities.length },
    { id: 'organizations', label: 'Organizations & consortia', count: organizations.length },
    { id: 'mous', label: 'Active MOUs', count: mous.filter(m => m.status === 'ACTIVE').length },
  ]

  return (
    <div>
      <HeroSection
        title="Global Partners & Collaborations"
        subtitle="A vibrant worldwide network of partner universities, research consortia, and bilateral agreements connecting IIT Dharwad to the world"
        backgroundImage="/institute/Institute4.jpg"
        tone="ink"
        cta={{
          label: 'Explore Active MOUs',
          onClick: () => {
            const el = document.getElementById('active-mous-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          },
        }}
      />

      {/* How we partner */}
      <section aria-labelledby="how-we-partner" className="bg-white border-b border-mist py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <h2 id="how-we-partner" className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] text-ink-deep">How we partner</h2>
            <p className="mt-3 text-lg text-quiet">Agreements with individual institutions, membership of national networks, and international projects.</p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
            <dl className="space-y-5 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-8 sm:space-y-0">
              {AGREEMENT_TYPES.map(([term, text]) => (
                <div key={term} className="border-l-2 border-ink pl-4">
                  <dt className="font-heading! text-xl text-ink-deep">{term}</dt>
                  <dd className="mt-1 text-[0.95rem] text-body">{text}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="text-lg font-medium text-ink-deep">Networks</h3>
              <ul className="mt-2 space-y-1.5 text-[0.95rem] text-body">
                {NETWORKS.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-ink-deep">International projects</h3>
              <ul className="mt-2 space-y-1.5 text-[0.95rem] text-body">
                {PROJECTS.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Navigation Bar */}
      <div className="sticky top-[var(--site-header-h,140px)] z-30 border-b border-mist bg-porcelain/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          {/* Tab buttons */}
          <div role="group" aria-label="Show" className="scrollbar-hide -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                aria-pressed={selectedTab === tab.id}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-ink text-white'
                    : 'bg-white text-body ring-1 ring-inset ring-mist hover:text-ink-deep hover:ring-ink/30'
                }`}
              >
                {tab.label} <span className={`nums-tabular ${selectedTab === tab.id ? 'text-white/70' : 'text-quiet'}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search Input & Country Filter */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:w-64">
              <RiSearchLine size={18} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-quiet" />
              <input
                type="text"
                placeholder="Search partner, country..."
                aria-label="Search partners"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border border-mist bg-white pl-10 pr-9 text-sm text-plum-deep placeholder:text-quiet focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-quiet hover:text-plum-deep"
                >
                  <RiCloseLine size={16} />
                </button>
              )}
            </div>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              aria-label="Filter by country"
              className="h-10 cursor-pointer rounded-full border border-mist bg-white px-4 text-sm font-medium text-plum-deep focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
            >
              <option value="ALL">All Countries ({countries.length})</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-busy="true">
          <p className="mb-6 text-sm text-quiet">Loading partner institutions & MOUs...</p>
          <div className="divide-y divide-mist rounded-2xl border border-mist bg-white">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 p-5">
                <div className="h-11 w-11 rounded-xl bg-mist" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-mist" />
                  <div className="h-3 w-1/5 rounded bg-mist/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div role="alert" className="flex items-center justify-between gap-4 rounded-2xl bg-saffron-tint p-4 text-sm text-plum-deep">
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchData}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 font-semibold text-plum hover:underline"
            >
              <RiRefreshLine size={16} aria-hidden="true" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {!loading && (
        <>
          {/* SECTION 1: Partner Universities */}
          {(selectedTab === 'all' || selectedTab === 'universities') && (
            <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
              <SectionHeader
                title="Partner Universities"
                subtitle="Accredited higher education institutions collaborating with IIT Dharwad"
              />

              {filteredUniversities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-mist bg-white p-10 text-center">
                  <p className="font-semibold text-plum-deep">No universities matched your search</p>
                  <p className="mt-1 text-sm text-quiet">Try selecting another country or clearing your search term.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-mist bg-white">
                  {/* Column headings (desktop) */}
                  <div aria-hidden="true" className="hidden grid-cols-12 gap-6 border-b border-mist bg-porcelain px-6 py-3 text-xs font-semibold text-quiet lg:grid">
                    <span className="col-span-5">University</span>
                    <span className="col-span-2">Country</span>
                    <span className="col-span-2">Agreement</span>
                    <span className="col-span-3">Faculty champion</span>
                  </div>
                  <ul className="divide-y divide-mist">
                    {displayedUniversities.map((uni) => {
                      const countryCode = resolveCountryCode(uni.country, uni.countryCode)
                      const linkedMous = partnerMouMap[uni.id] || uni.mous || []
                      const activeMou = linkedMous.find((m) => m.status === 'ACTIVE')
                      const latestMou = activeMou || linkedMous[0]

                      return (
                        <li key={uni.id || uni.name} className="grid gap-4 px-6 py-5 lg:grid-cols-12 lg:items-center lg:gap-6">
                          {/* Name, focus and links */}
                          <div className="flex items-start gap-4 lg:col-span-5">
                            <PartnerLogo name={uni.name} logoUrl={uni.logoUrl} />
                            <div className="min-w-0">
                              <h3 className="text-lg font-medium leading-snug text-ink-deep">{uni.name}</h3>
                              {uni.focus && (
                                <p className="mt-0.5 text-sm text-quiet line-clamp-2">{uni.focus}</p>
                              )}
                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
                                {uni.website && (
                                  <a
                                    href={uni.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-ink hover:underline underline-offset-4"
                                  >
                                    Official website <RiExternalLinkLine size={13} aria-hidden="true" />
                                  </a>
                                )}
                                {(activeMou?.hasDocument || latestMou?.hasDocument) && (
                                  <button
                                    type="button"
                                    disabled={downloadingId === (activeMou?.id || latestMou?.id)}
                                    onClick={() => handleDownloadMou((activeMou || latestMou).id, uni.name)}
                                    className="inline-flex cursor-pointer items-center gap-1 text-plum hover:underline underline-offset-4"
                                  >
                                    <RiFileDownloadLine size={14} aria-hidden="true" />
                                    {downloadingId === (activeMou?.id || latestMou?.id) ? 'Downloading...' : 'View MOU'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Country */}
                          <div className="flex items-center gap-2 text-[0.95rem] text-body lg:col-span-2">
                            <FlagIcon country={uni.country} code={countryCode} />
                            <span>{uni.country}</span>
                          </div>

                          {/* Agreement */}
                          <div className="text-sm lg:col-span-2">
                            {activeMou ? (
                              <>
                                <StatusBadge status="ACTIVE" label="Active MOU" />
                                {activeMou.expiryDate && (
                                  <p className="mt-1 text-quiet nums-tabular">Valid to {new Date(activeMou.expiryDate).getFullYear()}</p>
                                )}
                              </>
                            ) : latestMou ? (
                              <>
                                <StatusBadge status={latestMou.status} label={`MOU (${latestMou.status || 'Pending'})`} />
                                {latestMou.expiryDate && (
                                  <p className="mt-1 text-quiet nums-tabular">Valid to {new Date(latestMou.expiryDate).getFullYear()}</p>
                                )}
                              </>
                            ) : (
                              <span className="text-quiet">Academic Partnership</span>
                            )}
                          </div>

                          {/* Champion Faculty if available */}
                          <div className="text-sm lg:col-span-3">
                            {uni.championName ? (
                              <>
                                <p className="text-plum-deep">
                                  <span className="lg:hidden text-quiet">IITDh Champion: </span>
                                  {uni.championName}
                                </p>
                                {uni.championDesignation && <p className="text-quiet">{uni.championDesignation}</p>}
                                {uni.championEmail && (
                                  <a href={`mailto:${uni.championEmail}`} className="break-all text-ink hover:underline underline-offset-4">
                                    {uni.championEmail}
                                  </a>
                                )}
                              </>
                            ) : (
                              <span className="hidden text-quiet lg:inline">–</span>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Show More / Show Less Button */}
              {filteredUniversities.length > 6 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAllUniversities((prev) => !prev)}
                    className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-6 text-sm font-semibold text-ink ring-1 ring-inset ring-ink/30 transition-colors hover:bg-ink-tint"
                  >
                    {showAllUniversities
                      ? 'Show fewer universities'
                      : `Show all ${filteredUniversities.length} universities`}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* SECTION 2: Partner Organizations, Consortia & Networks */}
          {(selectedTab === 'all' || selectedTab === 'organizations') && (
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <SectionHeader
                title="Partner Organizations & Consortia"
                subtitle="Collaborating international bodies, research agencies, and academic networks"
              />

              {filteredOrganizations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-mist bg-white p-10 text-center">
                  <p className="font-semibold text-plum-deep">No partner organizations matched your filter.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredOrganizations.map((org) => {
                    const countryCode = resolveCountryCode(org.country, org.countryCode)
                    const typeLabel =
                      org.type === 'CONSORTIUM'
                        ? 'Consortium'
                        : org.type === 'NETWORK'
                        ? 'Academic Network'
                        : 'Organization'
                    const orgMous = partnerMouMap[org.id] || org.mous || []

                    return (
                      <article key={org.id || org.name} className="flex flex-col rounded-2xl border border-mist bg-white p-6">
                        <div className="flex items-start justify-between gap-3">
                          {org.logoUrl ? <PartnerLogo name={org.name} logoUrl={org.logoUrl} size="h-10 w-10" /> : <span />}
                          <span className="flex items-center gap-1.5 text-sm text-body">
                            <FlagIcon country={org.country} code={countryCode} />
                            {org.country}
                          </span>
                        </div>
                        <p className="mt-4 text-sm font-medium text-saffron-deep">{typeLabel}</p>
                        <h3 className="mt-1 text-xl font-medium leading-snug text-ink-deep">{org.name}</h3>

                        {org.focus && (
                          <p className="mt-2 text-sm text-quiet">{org.focus}</p>
                        )}

                        {org.championName && (
                          <div className="mt-4 text-sm">
                            <p className="text-plum-deep">
                              <span className="text-quiet">Champion: </span>{org.championName}
                              {org.championDesignation ? `, ${org.championDesignation}` : ''}
                            </p>
                            {org.championEmail && (
                              <a href={`mailto:${org.championEmail}`} className="break-all text-ink hover:underline underline-offset-4">
                                {org.championEmail}
                              </a>
                            )}
                          </div>
                        )}

                        {/* 3.15 Nested MOUs for organization cards */}
                        {orgMous.length > 0 && (
                          <div className="mt-5 border-t border-mist pt-4">
                            <p className="text-sm font-semibold text-plum-deep">Agreements ({orgMous.length})</p>
                            <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
                              {orgMous.map((m) => (
                                <li key={m.id} className="flex items-center justify-between gap-3 rounded-lg bg-porcelain px-3 py-2 text-sm">
                                  <div className="min-w-0">
                                    <span className="block truncate text-body" title={m.title || 'MOU'}>
                                      {m.title || 'Bilateral MOU'}
                                    </span>
                                    {m.expiryDate && (
                                      <span className="text-xs text-quiet nums-tabular">
                                        Until {new Date(m.expiryDate).getFullYear()}
                                      </span>
                                    )}
                                  </div>
                                  {m.hasDocument && (
                                    <button
                                      type="button"
                                      disabled={downloadingId === m.id}
                                      onClick={() => handleDownloadMou(m.id, org.name)}
                                      className="shrink-0 cursor-pointer text-xs font-semibold text-plum hover:underline"
                                    >
                                      {downloadingId === m.id ? '...' : 'PDF'}
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {org.website && (
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-ink hover:underline underline-offset-4"
                          >
                            Learn More <RiExternalLinkLine size={14} aria-hidden="true" />
                          </a>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {/* SECTION 3: Active Memorandums of Understanding (MOUs) */}
          {(selectedTab === 'all' || selectedTab === 'mous') && (
            <section id="active-mous-section" className="bg-white border-y border-mist py-16 md:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                  title="Active Memorandums of Understanding (MOUs)"
                  subtitle="Formally ratified bilateral agreements governing student exchanges, dual degrees, and joint scientific investigations"
                />
                {!signedIn && (
                  <p className="-mt-4 mb-8 flex items-center gap-2 text-sm text-quiet">
                    <RiLockLine size={16} aria-hidden="true" className="text-saffron-deep" />
                    Signed MOU documents open for IIT Dharwad accounts; you will be asked to sign in.
                  </p>
                )}

                {filteredMous.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-mist bg-porcelain p-10 text-center">
                    <p className="font-semibold text-plum-deep">No MOUs matched the selected criteria.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMous.map((mou) => {
                      const partnerName = mou.partner?.name || mou.title || 'Partner Institution'
                      const country = mou.partner?.country || ''
                      const countryCode = resolveCountryCode(country, mou.partner?.countryCode)
                      const expiryDate = mou.expiryDate || mou.validUntil
                      const isMouActive = mou.status === 'ACTIVE'

                      return (
                        <div
                          key={mou.id}
                          onClick={() => handleMouClick(mou, partnerName)}
                          role={mou.hasDocument ? 'button' : undefined}
                          tabIndex={mou.hasDocument ? 0 : undefined}
                          onKeyDown={(e) => {
                            if (mou.hasDocument && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault()
                              handleMouClick(mou, partnerName)
                            }
                          }}
                          className={`flex flex-col rounded-2xl border border-mist bg-porcelain p-6 transition-colors ${
                            mou.hasDocument ? 'cursor-pointer hover:border-ink/40 hover:bg-white' : ''
                          }`}
                        >
                          {/* 3.13 Show real MOU status */}
                          <div className="flex items-center justify-between gap-3">
                            <StatusBadge
                              status={mou.status}
                              label={mou.status ? `${mou.status.charAt(0)}${mou.status.slice(1).toLowerCase()} agreement` : 'Active agreement'}
                            />
                            {country && (
                              <span className="flex items-center gap-1.5 text-sm text-body">
                                <FlagIcon country={country} code={countryCode} />
                                {country}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-4 text-xl font-medium leading-snug text-ink-deep">
                            {partnerName}
                          </h3>

                          {/* Scope / Title note */}
                          {mou.title && mou.title !== partnerName && (
                            <p className="mt-1 text-sm font-medium text-plum line-clamp-2">
                              {mou.title}
                            </p>
                          )}

                          {/* Details */}
                          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-mist pt-4 text-sm">
                            {mou.signedDate && (
                              <div>
                                <dt className="text-quiet">Signed</dt>
                                <dd className="text-plum-deep nums-tabular">{formatDay(mou.signedDate, 'en-US')}</dd>
                              </div>
                            )}
                            {expiryDate && (
                              <div>
                                <dt className="text-quiet">Valid until</dt>
                                <dd className={`nums-tabular ${isMouActive ? 'text-plum-deep' : 'text-saffron-deep'}`}>{formatDay(expiryDate, 'en-US')}</dd>
                              </div>
                            )}
                            {mou.scope && (
                              <div className="col-span-2">
                                <dt className="text-quiet">Scope</dt>
                                <dd className="text-body line-clamp-2">{mou.scope}</dd>
                              </div>
                            )}
                          </dl>

                          {/* Download CTA */}
                          <div className="mt-auto flex items-center justify-between pt-5">
                            {mou.hasDocument ? (
                              <>
                                <span className="text-xs text-quiet">Signed PDF available</span>
                                <button
                                  type="button"
                                  disabled={downloadingId === mou.id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMouClick(mou, partnerName)
                                  }}
                                  className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-plum hover:underline underline-offset-4"
                                >
                                  <RiFileDownloadLine size={15} aria-hidden="true" />
                                  {downloadingId === mou.id ? 'Loading Document...' : 'View / Download MOU'}
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-quiet">No document on file</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 4: Partnership Benefits */}
          <section className="bg-ink-deep text-white py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeader
                tone="dark"
                title="Partnership Benefits"
                subtitle="Comprehensive advantages delivered through our global institutional agreements"
              />
              <div className="grid gap-12 lg:grid-cols-2">
                {[
                  {
                    title: 'For students',
                    items: [
                      ['Exchange semester opportunities', 'Full tuition waiver at host university'],
                      ['Joint degree programs', "Dual Master's and Cotutelle PhD pathways"],
                      ['International research', 'Work in state-of-the-art laboratories overseas'],
                      ['Global networking', 'Lifelong international alumni and peer networks'],
                      ['Internships & summer schools', 'Funded foreign laboratory visits'],
                    ],
                  },
                  {
                    title: 'For faculty & researchers',
                    items: [
                      ['Bilateral research grants', 'Joint calls funded by DST, DAAD, CNRS, and EU'],
                      ['Faculty exchange & sabbaticals', 'Short-term and long-term visiting professorships'],
                      ['Joint supervision', 'Co-advising PhD students with international counterparts'],
                      ['Workshops & symposia', 'Co-hosting flagship international academic conferences'],
                      ['Institutional resource sharing', 'High-performance computing and facility access'],
                    ],
                  },
                ].map((group) => (
                  <div key={group.title}>
                    <h3 className="text-2xl font-medium">{group.title}</h3>
                    <dl className="mt-5 divide-y divide-white/10 border-y border-white/10">
                      {group.items.map(([term, text]) => (
                        <div key={term} className="grid gap-1 py-3.5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                          <dt className="font-semibold text-saffron">{term}</dt>
                          <dd className="text-white/75">{text}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* MOU Document Viewer / Downloader Modal */}
      {readyMou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/70 p-4 backdrop-blur-xs">
          <div role="dialog" aria-modal="true" aria-labelledby="mou-dialog-title" className="flex w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:p-7">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-mist pb-4">
              <div>
                <h3 id="mou-dialog-title" className="text-xl font-medium leading-snug text-ink-deep">
                  {readyMou.partnerName ? `MOU: ${readyMou.partnerName}` : 'MOU Document'}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-700">
                  <RiCheckDoubleLine size={15} aria-hidden="true" />
                  Verified IIT Dharwad Campus Access
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReadyMou(null)}
                className="cursor-pointer rounded-full p-1.5 text-quiet transition-colors hover:bg-porcelain hover:text-plum-deep"
                aria-label="Close"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Document Details Card */}
            <div className="my-5 flex items-center gap-4 rounded-xl bg-porcelain p-4 ring-1 ring-inset ring-mist">
              <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-plum ring-1 ring-inset ring-mist">
                <span className="text-[10px] font-bold">PDF</span>
                <RiFileDownloadLine size={18} aria-hidden="true" className="mt-0.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-plum-deep" title={readyMou.fileName}>
                  {readyMou.fileName}
                </p>
                <p className="mt-0.5 text-sm text-quiet">
                  Official signed Memorandum of Understanding
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={readyMou.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-plum px-5 text-sm font-semibold text-white transition-colors hover:bg-plum-deep"
              >
                <RiExternalLinkLine size={17} aria-hidden="true" />
                Open PDF Viewer
              </a>
              <a
                href={readyMou.url}
                download={readyMou.fileName}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-plum ring-1 ring-inset ring-plum/35 transition-colors hover:bg-plum-tint"
              >
                <RiFileDownloadLine size={17} aria-hidden="true" />
                Download
              </a>
            </div>

            <p className="mt-4 text-center text-xs text-quiet">
              "Open PDF Viewer" launches the document full-screen in your browser's native PDF reader.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
