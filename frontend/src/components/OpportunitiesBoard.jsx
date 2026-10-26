import { useState, useEffect, useMemo } from 'react';
import { fetchAllPages } from '../api/fetchAllPages';
import SectionHeader from './ui/SectionHeader';
import {
  RiSearchLine,
  RiCloseLine,
  RiCalendarLine,
  RiExternalLinkLine,
  RiAttachmentLine,
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
      className="h-3.5 w-auto rounded-[2px] ring-1 ring-black/5 inline-block align-middle"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  );
}

/**
 * The searchable list of scholarships, fellowships, exchanges and grants the
 * office posts from the admin panel, with a detail view for each. Shown as a
 * section of the International Mobility page.
 */
export default function OpportunitiesBoard() {
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
  const filtersActive = searchQuery || selectedCategory !== 'ALL' || selectedAudience !== 'ALL';

  return (
    <div>
      {/* Main Content Area */}
      <section id="opportunities" className="bg-white border-y border-mist">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <SectionHeader
          title="Opportunities"
          subtitle="Scholarships, fellowships, exchanges and grants for IIT Dharwad students and faculty, collected by the International Relations Office."
        />

        {/* Search and Filters Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <RiSearchLine size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-quiet" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="Search opportunities..."
                aria-label="Search opportunities"
                className="h-12 w-full rounded-full border border-mist bg-white pl-12 pr-11 text-[0.95rem] text-plum-deep placeholder:text-quiet focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => changeSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-quiet hover:text-plum-deep"
                  aria-label="Clear search"
                >
                  <RiCloseLine size={18} />
                </button>
              )}
            </div>

            {/* Audience Filter: a segmented control */}
            <div role="group" aria-label="Audience" className="flex shrink-0 self-start rounded-full bg-white p-1 ring-1 ring-inset ring-mist md:self-auto">
              {AUDIENCES.map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => changeAudience(aud.id)}
                  aria-pressed={selectedAudience === aud.id}
                  className={`h-10 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors ${
                    selectedAudience === aud.id
                      ? 'bg-plum text-white'
                      : 'text-body hover:text-plum-deep'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Tags */}
          <div role="group" aria-label="Category" className="scrollbar-hide -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => changeCategory(cat.id)}
                  aria-pressed={isSelected}
                  className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-plum-tint text-plum-deep ring-1 ring-inset ring-plum/40'
                      : 'text-body ring-1 ring-inset ring-mist hover:text-plum-deep hover:ring-plum/30'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Status & Reset */}
          {filtersActive && (
            <div className="flex items-center justify-between border-t border-mist pt-3 text-sm text-quiet">
              <span aria-live="polite">
                Showing <strong className="font-semibold text-plum-deep">{pageOpps.length}</strong> of {totalCount} matching result{totalCount === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="cursor-pointer font-semibold text-plum hover:underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <p className="py-20 text-center text-quiet">Fetching global opportunities...</p>
        ) : pageOpps.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-mist bg-white p-12 text-center">
            <h3 className="text-2xl font-medium text-plum-deep">No Opportunities Found</h3>
            <p className="mt-2 mb-6 leading-relaxed text-quiet">
              We couldn't find any opportunities matching your current search or filter criteria. Try adjusting your search terms or clear filters to view all postings.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="h-11 cursor-pointer rounded-full bg-plum px-6 text-sm font-semibold text-white transition-colors hover:bg-plum-deep"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pageOpps.map((opp) => {
                // 3.22: Only treat opp.applicationDeadline as deadline
                const deadline = opp.applicationDeadline;

                return (
                  <li key={opp.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedOpp(opp)}
                      className="group flex h-full w-full cursor-pointer flex-col rounded-2xl border border-mist bg-white p-6 text-left transition-colors hover:border-plum/40"
                    >
                      {/* Category and audience */}
                      <span className="flex w-full items-center justify-between gap-2 text-sm">
                        <span className="font-semibold text-plum">{formatCategory(opp.category)}</span>
                        {opp.audience && opp.audience !== 'BOTH' && (
                          <span className="text-quiet">{formatAudience(opp.audience)}</span>
                        )}
                      </span>

                      {/* Title */}
                      <span className="mt-3 block font-heading! text-xl leading-snug text-plum-deep line-clamp-2">
                        {opp.title}
                      </span>

                      {/* Organisation & Country */}
                      {(opp.organisation || opp.country) && (
                        <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-body">
                          {opp.organisation && <span className="truncate max-w-[14rem]">{opp.organisation}</span>}
                          {opp.organisation && opp.country && <span aria-hidden="true" className="text-mist">|</span>}
                          {opp.country && (
                            <span className="flex items-center gap-1.5">
                              <FlagIcon code={opp.countryCode} />
                              {opp.country}
                            </span>
                          )}
                        </span>
                      )}

                      {/* Description preview */}
                      <span className="mt-3 block flex-1 text-sm leading-relaxed text-quiet line-clamp-3">
                        {opp.description || 'No description provided.'}
                      </span>

                      {/* Footer */}
                      <span className="mt-6 flex w-full items-center justify-between border-t border-mist pt-4 text-sm">
                        {deadline ? (
                          <span className="flex items-center gap-1.5 font-medium text-saffron-deep nums-tabular">
                            <RiCalendarLine size={15} aria-hidden="true" />
                            Deadline {new Date(deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        ) : <span className="text-quiet">Open</span>}
                        <span className="flex items-center gap-1 font-semibold text-plum">
                          Details <RiArrowRightLine size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="flex h-10 cursor-pointer items-center gap-1 rounded-full px-4 text-sm font-semibold text-plum ring-1 ring-inset ring-mist transition-colors hover:bg-porcelain disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RiArrowLeftSLine size={18} aria-hidden="true" /> Previous
                </button>
                <span className="px-2 text-sm text-quiet nums-tabular">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="flex h-10 cursor-pointer items-center gap-1 rounded-full px-4 text-sm font-semibold text-plum ring-1 ring-inset ring-mist transition-colors hover:bg-porcelain disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <RiArrowRightSLine size={18} aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        )}
        </div>
      </section>

      {/* FULL DETAILS MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-plum-deep/70 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedOpp(null)}
          />

          {/* Modal Card */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="opp-dialog-title"
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative border-b border-mist p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="absolute right-5 top-5 cursor-pointer rounded-full p-2 text-quiet transition-colors hover:bg-porcelain hover:text-plum-deep"
                aria-label="Close modal"
              >
                <RiCloseLine size={22} />
              </button>

              <p className="pr-10 text-sm">
                <span className="font-semibold text-plum">{formatCategory(selectedOpp.category)}</span>
                <span className="text-quiet"> for {formatAudience(selectedOpp.audience || 'BOTH')}</span>
              </p>

              <h2 id="opp-dialog-title" className="mt-2 text-2xl sm:text-3xl font-medium leading-tight text-plum-deep">
                {selectedOpp.title}
              </h2>

              {(selectedOpp.organisation || selectedOpp.country) && (
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] text-body">
                  {selectedOpp.organisation && <span>{selectedOpp.organisation}</span>}
                  {selectedOpp.country && (
                    <span className="flex items-center gap-1.5">
                      <FlagIcon code={selectedOpp.countryCode} />
                      {selectedOpp.country}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Modal Scrollable Body */}
            <div className="space-y-6 overflow-y-auto p-6 sm:p-8">
              {/* 3.22 Only show Application Deadline if opp.applicationDeadline is present */}
              {selectedOpp.applicationDeadline && (
                <div className="flex items-center gap-4 rounded-xl bg-saffron-tint p-4">
                  <RiCalendarLine size={22} aria-hidden="true" className="shrink-0 text-saffron-deep" />
                  <div>
                    <p className="text-sm text-saffron-deep">Application deadline</p>
                    <p className="font-semibold text-plum-deep">
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
                <h3 className="text-lg font-medium text-plum-deep">About this opportunity</h3>
                <div className="mt-2 whitespace-pre-line text-base leading-relaxed text-body">
                  {selectedOpp.description}
                </div>
              </div>

              {/* Attachment if present */}
              {selectedOpp.attachmentUrl && (
                <div className="flex items-center justify-between gap-4 rounded-xl bg-porcelain p-4 ring-1 ring-inset ring-mist">
                  <div className="flex items-center gap-3">
                    <RiAttachmentLine size={20} aria-hidden="true" className="shrink-0 text-plum" />
                    <div>
                      <p className="text-sm font-semibold text-plum-deep">Official Notice / Brochure</p>
                      <p className="text-xs text-quiet">Download attached documentation</p>
                    </div>
                  </div>
                  <a
                    href={resolveMediaUrl(selectedOpp.attachmentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm font-semibold text-plum hover:underline underline-offset-4"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-mist bg-porcelain p-5 sm:flex-row sm:px-8">
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="h-11 w-full cursor-pointer rounded-full px-5 text-sm font-semibold text-plum ring-1 ring-inset ring-plum/30 transition-colors hover:bg-white sm:w-auto"
              >
                Close Details
              </button>

              {(selectedOpp.externalUrl || selectedOpp.url) && (
                <a
                  href={selectedOpp.externalUrl || selectedOpp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-plum px-6 text-sm font-semibold text-white transition-colors hover:bg-plum-deep sm:w-auto"
                >
                  Apply on Official Website
                  <RiExternalLinkLine size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
