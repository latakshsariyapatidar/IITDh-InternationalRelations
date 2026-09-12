import { useState, useEffect, useMemo } from 'react'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import {
  RiGlobalLine,
  RiLinksLine,
  RiEarthLine,
  RiMapPinLine,
  RiCalendarLine,
  RiSearchLine,
  RiExternalLinkLine,
  RiFileDownloadLine,
  RiBuilding4Line,
  RiBuilding2Line,
  RiCheckDoubleLine,
  RiRefreshLine
} from '@remixicon/react'
import apiClient from '../api/client'

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

function FlagIcon({ country, code, className = "h-4 w-auto rounded-[2px] shadow-xs" }) {
  if (!code) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-3.5 bg-gray-100 text-[10px] text-gray-500 rounded font-mono">
        🌐
      </span>
    )
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

export default function Partners() {
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

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [partnersRes, mousRes] = await Promise.all([
        apiClient.get('/partners?limit=100').catch((err) => {
          console.warn('Failed to fetch partners:', err)
          return { data: { data: { partners: [] } } }
        }),
        apiClient.get('/mous?isPublic=true&limit=100').catch((err) => {
          console.warn('Failed to fetch mous:', err)
          return { data: { data: { mous: [] } } }
        }),
      ])

      const fetchedPartners = partnersRes.data?.data?.partners || []
      const fetchedMous = mousRes.data?.data?.mous || []

      setPartners(fetchedPartners)
      setMous(fetchedMous)
    } catch (err) {
      console.error('Error in fetching partner and MOU data:', err)
      setError('Unable to load partner information at this time.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDownloadMou = async (mouId, partnerName) => {
    try {
      setDownloadingId(mouId)
      const res = await apiClient.get(`/mous/${mouId}/document`, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `MOU_${(partnerName || mouId).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Please sign in with your IIT Dharwad account to read and download the full signed MOU.')
      } else {
        alert('MOU document unavailable: ' + (err.response?.data?.message || err.message))
      }
    } finally {
      setDownloadingId(null)
    }
  }

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

  const marqueeList = [...partners, ...partners]

  return (
    <div className="bg-[#fcfbfd] text-brand-purpleDark min-h-screen">
      <HeroSection
        title="Global Partners & Collaborations"
        subtitle="A vibrant worldwide network of partner universities, research consortia, and bilateral agreements connecting IIT Dharwad to the world"
        cta={{
          label: 'Explore Active MOUs',
          onClick: () => {
            const el = document.getElementById('active-mous-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          },
        }}
      />

      {/* Marquee Ticker */}
      {marqueeList.length > 0 && (
        <div className="w-full overflow-hidden border-b border-brand-purpleLight/40 bg-white py-3">
          <div className="marquee-track flex w-max items-center gap-10">
            {marqueeList.map((partner, idx) => {
              const code = resolveCountryCode(partner.country, partner.countryCode)
              return (
                <div
                  key={`${partner.id || partner.name}-${idx}`}
                  className="flex items-center gap-3 text-brand-purpleDark shrink-0 px-2"
                >
                  <span className="h-2 w-2 rounded-full bg-brand-marigold" />
                  <span className="text-xs font-bold uppercase tracking-wider">{partner.name}</span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FlagIcon country={partner.country} code={code} />
                    <span>{partner.country}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Search & Navigation Bar */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-brand-purpleLight/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tab buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedTab === 'all'
                    ? 'bg-brand-purple text-white shadow-xs'
                    : 'bg-brand-cream/60 text-brand-purpleDark/80 hover:bg-brand-purpleLight/30 hover:text-brand-purpleDark border border-brand-purpleLight/30'
                }`}
              >
                All Collaborations ({partners.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('universities')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedTab === 'universities'
                    ? 'bg-brand-purple text-white shadow-xs'
                    : 'bg-brand-cream/60 text-brand-purpleDark/80 hover:bg-brand-purpleLight/30 hover:text-brand-purpleDark border border-brand-purpleLight/30'
                }`}
              >
                Universities ({universities.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('organizations')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedTab === 'organizations'
                    ? 'bg-brand-purple text-white shadow-xs'
                    : 'bg-brand-cream/60 text-brand-purpleDark/80 hover:bg-brand-purpleLight/30 hover:text-brand-purpleDark border border-brand-purpleLight/30'
                }`}
              >
                Organizations & Consortia ({organizations.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('mous')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedTab === 'mous'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                }`}
              >
                <RiLinksLine size={16} />
                Active MOUs ({mous.length})
              </button>
            </div>

            {/* Search Input & Country Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <RiSearchLine
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search partner, country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple text-brand-purpleDark placeholder:text-gray-400 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple text-brand-purpleDark font-medium cursor-pointer shadow-2xs"
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
      </section>

      {/* Loading Skeleton */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-purple border-t-transparent mb-3" />
            <p className="text-sm font-medium text-gray-500">Loading partner institutions & MOUs...</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4 mx-auto" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-4" />
                <div className="h-3 bg-gray-100 rounded w-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-amber-800 text-sm">
            <p>{error}</p>
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple hover:underline"
            >
              <RiRefreshLine size={16} />
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
            <section className="max-w-7xl mx-auto px-4 pt-6 pb-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-brand-purpleLight/40">
                <SectionHeader
                  title="Partner Universities"
                  subtitle="Accredited higher education institutions collaborating with IIT Dharwad"
                  badge={<RiBuilding4Line size={18} />}
                  badgeText="Partner Universities"
                  centered={false}
                  className="mb-0"
                />
                {filteredUniversities.length > 6 && !showAllUniversities && (
                  <button
                    type="button"
                    onClick={() => setShowAllUniversities(true)}
                    className="self-start sm:self-auto inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-purple hover:text-brand-purpleDark hover:underline shrink-0"
                  >
                    <span>View all {filteredUniversities.length} universities</span>
                    <span className="bg-brand-purpleLight/40 px-2 py-0.5 rounded-full text-[11px]">
                      +{filteredUniversities.length - 6} more
                    </span>
                  </button>
                )}
              </div>

              {filteredUniversities.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-xs">
                  <RiSearchLine size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600 font-semibold text-base">No universities matched your search</p>
                  <p className="text-xs text-gray-400 mt-1">Try selecting another country or clearing your search term.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedUniversities.map((uni) => {
                    const countryCode = resolveCountryCode(uni.country, uni.countryCode)
                    const linkedMous = partnerMouMap[uni.id] || uni.mous || []
                    const activeMou = linkedMous.find((m) => m.status === 'ACTIVE') || linkedMous[0]

                    return (
                      <Card
                        key={uni.id || uni.name}
                        variant="default"
                        className="flex flex-col justify-between border-brand-purpleLight/50 p-6 hover:shadow-md transition-all hover:border-brand-purple/60 group bg-white"
                      >
                        <div>
                          {/* Card Top: Avatar & Flag */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-brand-purpleLight/30 flex items-center justify-center text-brand-purpleDark font-bold text-lg group-hover:bg-brand-purple group-hover:text-white transition-colors overflow-hidden shrink-0 border border-brand-purpleLight/40 bg-white">
                              {uni.logoUrl ? (
                                <img
                                  src={resolveLogoUrl(uni.logoUrl)}
                                  alt={uni.name}
                                  className="h-full w-full object-contain p-1.5 rounded-xl"
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
                                style={{ display: uni.logoUrl ? 'none' : 'flex' }}
                              >
                                {uni.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/70 px-2.5 py-1 rounded-full text-xs font-medium text-gray-700">
                              <FlagIcon country={uni.country} code={countryCode} />
                              <span>{uni.country}</span>
                            </div>
                          </div>

                          {/* University Name */}
                          <h3 className="text-lg font-bold text-brand-purpleDark leading-snug group-hover:text-brand-purple transition-colors mb-2">
                            {uni.name}
                          </h3>

                          {/* Focus Area */}
                          {uni.focus && (
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                              <span className="font-semibold text-gray-700">Focus:</span> {uni.focus}
                            </p>
                          )}

                          {/* Champion Faculty if available */}
                          {uni.championName && (
                            <p className="text-[11px] text-gray-500 mb-3 bg-purple-50/60 border border-purple-100 p-2 rounded-lg">
                              <span className="font-semibold text-brand-purpleDark">IITDh Champion:</span> {uni.championName}
                              {uni.championDesignation ? ` (${uni.championDesignation})` : ''}
                            </p>
                          )}
                        </div>

                        {/* Card Bottom: MOU Badge & Links */}
                        <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-2.5">
                          {activeMou ? (
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
                                <RiCheckDoubleLine size={14} />
                                Active MOU
                              </span>
                              {activeMou.expiryDate && (
                                <span className="text-[11px] text-gray-500">
                                  Valid to {new Date(activeMou.expiryDate).getFullYear()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400">Academic Partnership</span>
                          )}

                          <div className="flex items-center justify-between pt-1 text-xs font-semibold">
                            {uni.website ? (
                              <a
                                href={uni.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-brand-purple flex items-center gap-1 transition-colors"
                              >
                                <span>Official Website</span>
                                <RiExternalLinkLine size={13} />
                              </a>
                            ) : (
                              <span />
                            )}

                            {activeMou?.hasDocument && (
                              <button
                                type="button"
                                disabled={downloadingId === activeMou.id}
                                onClick={() => handleDownloadMou(activeMou.id, uni.name)}
                                className="text-brand-purple hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <RiFileDownloadLine size={14} />
                                {downloadingId === activeMou.id ? 'Downloading...' : 'View MOU'}
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Show More / Show Less Button */}
              {filteredUniversities.length > 6 && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllUniversities((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-purpleLight bg-white px-6 py-3 text-sm font-bold text-brand-purple shadow-xs hover:border-brand-purple hover:bg-brand-purpleLight/20 transition-all cursor-pointer"
                  >
                    <span>
                      {showAllUniversities
                        ? 'Show fewer universities'
                        : `Show all ${filteredUniversities.length} universities`}
                    </span>
                    <span className="rounded-full bg-brand-purple px-2 py-0.5 text-xs text-white">
                      {filteredUniversities.length}
                    </span>
                  </button>
                </div>
              )}
            </section>
          )}

          {/* SECTION 2: Partner Organizations, Consortia & Networks */}
          {(selectedTab === 'all' || selectedTab === 'organizations') && (
            <section className="bg-white/90 border-y border-brand-purpleLight/40 py-12 my-8">
              <div className="max-w-7xl mx-auto px-4">
                <SectionHeader
                  title="Partner Organizations & Consortia"
                  subtitle="Collaborating international bodies, research agencies, and academic networks"
                  badge={<RiGlobalLine size={18} />}
                  badgeText="Networks & Bodies"
                  centered={false}
                />

                {filteredOrganizations.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-10 text-center border border-gray-200/60">
                    <p className="text-gray-500 font-medium">No partner organizations matched your filter.</p>
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

                      return (
                        <Card
                          key={org.id || org.name}
                          variant="default"
                          className="border-brand-purpleLight/50 p-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-brand-purple/60"
                        >
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2.5">
                                {org.logoUrl && (
                                  <div className="h-8 w-8 rounded-lg bg-white border border-brand-purpleLight/40 flex items-center justify-center overflow-hidden shrink-0">
                                    <img
                                      src={resolveLogoUrl(org.logoUrl)}
                                      alt={org.name}
                                      className="h-full w-full object-contain p-1"
                                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    />
                                  </div>
                                )}
                                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-brand-purpleLight/30 text-brand-purpleDark">
                                  {typeLabel}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                <FlagIcon country={org.country} code={countryCode} />
                                <span>{org.country}</span>
                              </div>
                            </div>

                            <h3 className="text-lg font-bold text-brand-purpleDark mb-2 leading-snug">
                              {org.name}
                            </h3>

                            {org.focus && (
                              <p className="text-xs text-gray-600 mb-2">
                                <span className="font-semibold text-gray-700">Focus:</span> {org.focus}
                              </p>
                            )}

                            {org.championName && (
                              <p className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 mt-2">
                                <span className="font-semibold text-gray-700">Champion:</span> {org.championName}
                              </p>
                            )}
                          </div>

                          {org.website && (
                            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end">
                              <a
                                href={org.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1"
                              >
                                <span>Learn More</span>
                                <RiExternalLinkLine size={13} />
                              </a>
                            </div>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 3: Active Memorandums of Understanding (MOUs) */}
          {(selectedTab === 'all' || selectedTab === 'mous') && (
            <section id="active-mous-section" className="max-w-7xl mx-auto px-4 py-12">
              <SectionHeader
                title="Active Memorandums of Understanding (MOUs)"
                subtitle="Formally ratified bilateral agreements governing student exchanges, dual degrees, and joint scientific investigations"
                badge={<RiLinksLine size={18} />}
                badgeText="Bilateral Agreements"
                centered={false}
              />

              {filteredMous.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-xs">
                  <p className="text-gray-500 font-medium">No MOUs matched the selected criteria.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMous.map((mou) => {
                    const partnerName = mou.partner?.name || mou.title || 'Partner Institution'
                    const country = mou.partner?.country || ''
                    const countryCode = resolveCountryCode(country, mou.partner?.countryCode)
                    const expiryDate = mou.expiryDate || mou.validUntil

                    return (
                      <div
                        key={mou.id}
                        className="bg-white rounded-2xl border border-brand-purpleLight/60 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-emerald-600/40"
                      >
                        <div>
                          {/* Header: Name and Globe icon */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                                <RiCheckDoubleLine size={13} />
                                Active Agreement
                              </span>
                              <h3 className="text-lg font-bold text-brand-purpleDark group-hover:text-brand-purple transition-colors leading-snug">
                                {partnerName}
                              </h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                              <RiLinksLine size={20} />
                            </div>
                          </div>

                          {/* Scope / Title note */}
                          {mou.title && mou.title !== partnerName && (
                            <p className="text-xs font-semibold text-brand-purple mb-3 line-clamp-2">
                              {mou.title}
                            </p>
                          )}

                          {/* Details */}
                          <div className="space-y-2 text-xs text-gray-600 my-4 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                            {country && (
                              <p className="flex items-center gap-2">
                                <FlagIcon country={country} code={countryCode} />
                                <span className="font-semibold text-gray-700">{country}</span>
                              </p>
                            )}
                            {mou.signedDate && (
                              <p className="flex items-center gap-2 text-gray-600">
                                <RiCalendarLine size={14} className="text-brand-marigold shrink-0" />
                                <span>
                                  Signed:{' '}
                                  {new Date(mou.signedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </p>
                            )}
                            {expiryDate && (
                              <p className="flex items-center gap-2 text-gray-600">
                                <RiCalendarLine size={14} className="text-brand-marigold shrink-0" />
                                <span>
                                  Valid Until:{' '}
                                  {new Date(expiryDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </p>
                            )}
                            {mou.scope && (
                              <div className="pt-2 mt-1 border-t border-gray-200/60">
                                <p className="text-gray-700 line-clamp-2">
                                  <span className="font-semibold">Scope:</span> {mou.scope}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Download CTA */}
                        {mou.hasDocument && (
                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400">PDF Document on File</span>
                            <button
                              type="button"
                              disabled={downloadingId === mou.id}
                              onClick={() => handleDownloadMou(mou.id, partnerName)}
                              className="text-xs font-bold text-brand-purple hover:text-brand-purpleDark hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RiFileDownloadLine size={14} />
                              {downloadingId === mou.id ? 'Downloading...' : 'Read / Download MOU'}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {/* SECTION 4: Partnership Benefits */}
          <section className="mx-auto max-w-7xl px-4 py-16">
            <SectionHeader
              title="Partnership Benefits"
              subtitle="Comprehensive advantages delivered through our global institutional agreements"
            />
            <div className="grid gap-8 lg:grid-cols-2">
              <Card variant="default" className="border-brand-purpleLight/60 p-8 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-purpleLight/30 flex items-center justify-center text-brand-purple">
                    <RiBuilding2Line size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-purpleDark">For Students</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Exchange Semester Opportunities:</strong> Full tuition waiver at host university</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Joint Degree Programs:</strong> Dual Master's and Cotutelle PhD pathways</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>International Research:</strong> Work in state-of-the-art laboratories overseas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Global Networking:</strong> Lifelong international alumni and peer networks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Internships & Summer Schools:</strong> Funded foreign laboratory visits</span>
                  </li>
                </ul>
              </Card>

              <Card variant="default" className="border-brand-purpleLight/60 p-8 bg-white shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-purpleLight/30 flex items-center justify-center text-brand-purple">
                    <RiEarthLine size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-purpleDark">For Faculty & Researchers</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Bilateral Research Grants:</strong> Joint calls funded by DST, DAAD, CNRS, and EU</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Faculty Exchange & Sabbaticals:</strong> Short-term and long-term visiting professorships</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Joint Supervision:</strong> Co-advising PhD students with international counterparts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Workshops & Symposia:</strong> Co-hosting flagship international academic conferences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-marigold font-bold">✓</span>
                    <span><strong>Institutional Resource Sharing:</strong> High-performance computing and facility access</span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  )
}