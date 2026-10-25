import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllPages } from '../api/fetchAllPages';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/ui/SectionHeader';
import { 
  RiSearchLine, 
  RiCloseLine, 
  RiCalendarLine, 
  RiMapPinLine, 
  RiBuildingLine, 
  RiExternalLinkLine, 
  RiFilter3Line, 
  RiAttachmentLine,
  RiUserLine,
  RiSparklingLine,
  RiArrowRightLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from '@remixicon/react';
import { resolveMediaUrl } from '../utils/media';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'SCHOLARSHIP', label: 'Scholarships' },
  { id: 'FELLOWSHIP', label: 'Fellowships' },
  { id: 'EXCHANGE', label: 'Exchanges' },
  { id: 'INTERNSHIP', label: 'Internships' },
  { id: 'RESEARCH', label: 'Research' },
  { id: 'GRANT', label: 'Grants & Funding' },
  { id: 'CONFERENCE', label: 'Conferences' },
  { id: 'OTHER', label: 'Other' },
];

const AUDIENCES = [
  { id: 'ALL', label: 'All Audiences' },
  { id: 'STUDENT', label: 'For Students' },
  { id: 'FACULTY', label: 'For Faculty' },
];

const PAGE_SIZE = 24;

function FlagIcon({ code }) {
  if (!code || !code.trim()) return null;
  return (
    <img
      src={`https://flagcdn.com/h80/${code.trim().toLowerCase()}.png`}
      height="14"
      alt={`${code} flag`}
      className="h-3.5 w-auto rounded-[2px] shadow-2xs inline-block align-middle mr-1"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  );
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAudience, setSelectedAudience] = useState('ALL');
  const [page, setPage] = useState(1);

  // Modal detail state
  const [selectedOpp, setSelectedOpp] = useState(null);

  // 3.21 / 3.23: Every live posting, filtered here rather than by the backend.
  // The list route has no search, matches an audience exactly (so "For
  // Students" would drop postings marked for both), and the signed-in feed
  // ignores every filter. includeExpired=false keeps an admin's view live-only.
  useEffect(() => {
    const fetchOpps = async () => {
      setLoading(true);
      try {
        setOpportunities(
          await fetchAllPages('/opportunities', 'opportunities', { pageSize: 100, params: { includeExpired: false } })
        );
      } catch (err) {
        console.error('Failed to fetch opportunities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  const filteredOpps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return opportunities.filter((opp) => {
      if (selectedCategory !== 'ALL' && opp.category !== selectedCategory) return false;
      // A posting for both audiences belongs under either one.
      if (selectedAudience !== 'ALL' && opp.audience !== selectedAudience && opp.audience !== 'BOTH') return false;
      if (!query) return true;
      return [opp.title, opp.description, opp.organisation, opp.country]
        .some((field) => typeof field === 'string' && field.toLowerCase().includes(query));
    });
  }, [opportunities, searchQuery, selectedCategory, selectedAudience]);

  // Any change to the filters starts again from the first page.
  const changeSearch = (value) => { setSearchQuery(value); setPage(1); };
  const changeCategory = (value) => { setSelectedCategory(value); setPage(1); };
  const changeAudience = (value) => { setSelectedAudience(value); setPage(1); };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedOpp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOpp]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedOpp) {
        setSelectedOpp(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOpp]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedAudience('ALL');
    setPage(1);
  };

  const formatAudience = (aud) => {
    if (aud === 'STUDENT') return 'Students';
    if (aud === 'FACULTY') return 'Faculty';
    if (aud === 'BOTH') return 'Students & Faculty';
    return aud;
  };

  const formatCategory = (cat) => {
    const found = CATEGORIES.find(c => c.id === cat);
    return found ? found.label : cat;
  };

  const totalCount = filteredOpps.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const pageOpps = filteredOpps.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-[#fcfbfd] text-brand-purpleDark min-h-screen">
      {/* Hero Header */}
      <HeroSection
        title="Opportunities"
        subtitle="Explore international scholarships, research fellowships, semester exchanges, and collaborative grants curated by the International Relations Office."
        backgroundImage="/institute/institute10.webp"
        cta={{
          label: 'Explore Opportunities',
          onClick: () => {
            const el = document.getElementById('opportunities-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
        }}
      />

      {/* Main Content Area */}
      <section id="opportunities-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Global Opportunities & Calls"
          subtitle="Discover and filter through scholarships, fellowships, and academic exchanges available for students and faculty"
          badge={<RiSparklingLine size={18} />}
          badgeText="Active Opportunities"
        />

        {/* Search and Filters Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-brand-purpleLight/60 mb-10 space-y-5">
          {/* Top Row: Search Input & Audience Selector */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <RiSearchLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/50 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-brand-purpleLight/70 bg-brand-cream/20 text-sm text-brand-purpleDark placeholder:text-brand-purpleDark/40 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => changeSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-purple/50 hover:text-brand-purple p-1 cursor-pointer transition-colors"
                  aria-label="Clear search"
                >
                  <RiCloseLine size={18} />
                </button>
              )}
            </div>

            {/* Audience Filter Pills */}
            <div className="flex items-center gap-1.5 bg-brand-cream/70 p-1.5 rounded-xl border border-brand-purpleLight/40 self-start md:self-auto shrink-0">
              {AUDIENCES.map((aud) => (
                <button
                  key={aud.id}
                  onClick={() => changeAudience(aud.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedAudience === aud.id
                      ? 'bg-brand-purple text-white shadow-xs font-bold'
                      : 'text-brand-purpleDark/75 hover:text-brand-purpleDark hover:bg-white/60'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Category Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-brand-purpleDark/60 flex items-center gap-1 font-semibold shrink-0 mr-1">
              <RiFilter3Line size={14} className="text-brand-purple" /> Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => changeCategory(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-purple text-white shadow-xs'
                      : 'bg-brand-cream/60 text-brand-purpleDark/80 hover:bg-brand-purpleLight/40 hover:text-brand-purpleDark border border-brand-purpleLight/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Status & Reset */}
          {(searchQuery || selectedCategory !== 'ALL' || selectedAudience !== 'ALL') && (
            <div className="flex items-center justify-between pt-3 border-t border-brand-purpleLight/30 text-xs text-brand-purpleDark/75">
              <span>
                Showing <strong>{pageOpps.length}</strong> of {totalCount} matching result{totalCount === 1 ? '' : 's'}
              </span>
              <button
                onClick={clearAllFilters}
                className="text-brand-purple hover:text-brand-purpleHover hover:underline font-bold cursor-pointer transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-purple border-t-transparent mb-4" />
            <p className="text-sm font-medium text-brand-purpleDark/60">Fetching global opportunities...</p>
          </div>
        ) : pageOpps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-purpleLight/60 p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-purple mx-auto mb-4">
              <RiFilter3Line size={28} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-brand-purpleDark mb-2">No Opportunities Found</h3>
            <p className="text-brand-purpleDark/70 text-sm mb-6 leading-relaxed">
              We couldn't find any opportunities matching your current search or filter criteria. Try adjusting your search terms or clear filters to view all postings.
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-brand-purple text-white hover:bg-brand-purpleHover font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageOpps.map((opp) => {
                // 3.22: Only treat opp.applicationDeadline as deadline
                const deadline = opp.applicationDeadline;

                return (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOpp(opp)}
                    className="bg-white rounded-2xl border border-brand-purpleLight/60 hover:border-brand-purple hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                  >
                    <div>
                      {/* Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-purpleLight/40 text-brand-purpleDark">
                          {formatCategory(opp.category)}
                        </span>
                        {opp.audience && opp.audience !== 'BOTH' && (
                          <span className="text-[11px] font-semibold text-brand-purpleDark/80 bg-brand-cream border border-brand-purpleLight/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <RiUserLine size={12} className="text-brand-purple" />
                            {formatAudience(opp.audience)}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-brand-purpleDark group-hover:text-brand-purple transition-colors line-clamp-2 leading-snug mb-2">
                        {opp.title}
                      </h3>

                      {/* Organisation & Country */}
                      {(opp.organisation || opp.country) && (
                        <p className="text-xs text-brand-purpleDark/70 font-medium flex items-center gap-1.5 mb-3 flex-wrap">
                          {opp.organisation && (
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <RiBuildingLine size={13} className="shrink-0 text-brand-purple/70" />
                              {opp.organisation}
                            </span>
                          )}
                          {opp.organisation && opp.country && <span>•</span>}
                          {opp.country && (
                            <span className="flex items-center gap-1 shrink-0">
                              <FlagIcon code={opp.countryCode} />
                              <RiMapPinLine size={13} className="text-brand-purple/70" />
                              {opp.country}
                            </span>
                          )}
                        </p>
                      )}

                      {/* Description preview */}
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6 font-normal">
                        {opp.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Card Bottom / Footer */}
                    <div className="pt-4 border-t border-brand-purpleLight/30 space-y-3">
                      {deadline && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50/90 border border-amber-200/60 px-2.5 py-1 rounded-md w-fit font-medium">
                          <RiCalendarLine size={13} className="text-amber-700" />
                          <span>Deadline: {new Date(deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-semibold text-brand-purple group-hover:text-brand-purpleHover pt-1">
                        <span>Click to view details</span>
                        <RiArrowRightLine size={15} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-brand-purpleLight text-brand-purple text-xs font-bold hover:bg-brand-purpleLight/20 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RiArrowLeftSLine size={16} /> Previous
                </button>
                <span className="text-xs text-gray-600 font-medium px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl border border-brand-purpleLight text-brand-purple text-xs font-bold hover:bg-brand-purpleLight/20 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Next <RiArrowRightSLine size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* FULL DETAILS MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setSelectedOpp(null)}
          />

          {/* Modal Card */}
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-brand-purpleLight/60 z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-brand-purpleLight/40 relative bg-gradient-to-b from-brand-cream/30 to-white">
              <button
                onClick={() => setSelectedOpp(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-brand-purpleLight/20 text-brand-purpleDark hover:bg-brand-purpleLight/40 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <RiCloseLine size={20} />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3 pr-10">
                <span className="text-xs font-bold px-3 py-1 rounded-md bg-brand-purple text-white">
                  {formatCategory(selectedOpp.category)}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-cream text-brand-purpleDark border border-brand-purpleLight/40">
                  Audience: {formatAudience(selectedOpp.audience || 'BOTH')}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-brand-purpleDark leading-tight">
                {selectedOpp.title}
              </h2>

              {(selectedOpp.organisation || selectedOpp.country) && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-brand-purpleDark/80 mt-3">
                  {selectedOpp.organisation && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <RiBuildingLine size={16} className="text-brand-purple" />
                      {selectedOpp.organisation}
                    </span>
                  )}
                  {selectedOpp.organisation && selectedOpp.country && <span>•</span>}
                  {selectedOpp.country && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <FlagIcon code={selectedOpp.countryCode} />
                      <RiMapPinLine size={16} className="text-brand-purple" />
                      {selectedOpp.country}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* 3.22 Only show Application Deadline if opp.applicationDeadline is present */}
              {selectedOpp.applicationDeadline && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800">
                    <RiCalendarLine size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Application Deadline</p>
                    <p className="text-base font-bold text-amber-950">
                      {new Date(selectedOpp.applicationDeadline).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-brand-purpleDark uppercase tracking-wider mb-2">
                  About This Opportunity
                </h4>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line space-y-4">
                  {selectedOpp.description}
                </div>
              </div>

              {/* Attachment if present */}
              {selectedOpp.attachmentUrl && (
                <div className="p-4 rounded-xl border border-brand-purpleLight/50 bg-brand-cream/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-purpleLight/30 text-brand-purple">
                      <RiAttachmentLine size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-purpleDark">Official Notice / Brochure</p>
                      <p className="text-xs text-gray-500">Download attached documentation</p>
                    </div>
                  </div>
                  <a
                    href={resolveMediaUrl(selectedOpp.attachmentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-brand-purple hover:underline"
                  >
                    Download File ↗
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-brand-cream/30 border-t border-brand-purpleLight/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setSelectedOpp(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-brand-purpleLight/70 text-brand-purpleDark font-semibold text-sm hover:bg-white transition-colors cursor-pointer"
              >
                Close Details
              </button>

              {(selectedOpp.externalUrl || selectedOpp.url) && (
                <a
                  href={selectedOpp.externalUrl || selectedOpp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-purple text-white font-semibold text-sm hover:bg-brand-purpleHover shadow-sm transition-all"
                >
                  <span>Apply on Official Website</span>
                  <RiExternalLinkLine size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
