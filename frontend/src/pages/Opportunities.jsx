import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/client';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { Button } from '../components/ui/button';
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
  RiArrowRightLine
} from '@remixicon/react';

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

export default function Opportunities() {
  const { isStudentAuthenticated } = useStudentAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAudience, setSelectedAudience] = useState('ALL');

  // Modal detail state
  const [selectedOpp, setSelectedOpp] = useState(null);

  useEffect(() => {
    const fetchOpps = async () => {
      setLoading(true);
      try {
        let endpoint = '/opportunities';
        if (isStudentAuthenticated) {
          endpoint = '/opportunities/feed';
        }

        const res = await apiClient.get(endpoint);
        setOpportunities(res.data?.data?.opportunities || res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpps();
  }, [isStudentAuthenticated]);

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

  // Filtered and searched opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Category filter
      if (selectedCategory !== 'ALL' && opp.category !== selectedCategory) {
        return false;
      }

      // Audience filter
      if (selectedAudience === 'STUDENT') {
        if (opp.audience !== 'STUDENT' && opp.audience !== 'BOTH') return false;
      } else if (selectedAudience === 'FACULTY') {
        if (opp.audience !== 'FACULTY' && opp.audience !== 'BOTH') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchable = [
          opp.title,
          opp.description,
          opp.organisation,
          opp.country,
          opp.category,
          opp.audience
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchable.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [opportunities, selectedCategory, selectedAudience, searchQuery]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedAudience('ALL');
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

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-5">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Opportunities
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Explore international scholarships, research fellowships, semester exchanges, and collaborative grants curated by the International Relations Office.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 mb-10 space-y-5">
          
          {/* Top Row: Search Input & Audience Selector */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <RiSearchLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities by title, organisation, country, or keyword..."
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <RiCloseLine size={18} />
                </button>
              )}
            </div>

            {/* Audience Filter Pills */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start md:self-auto shrink-0">
              {AUDIENCES.map((aud) => (
                <button
                  key={aud.id}
                  onClick={() => setSelectedAudience(aud.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedAudience === aud.id
                      ? 'bg-white text-brand-purple shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Category Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-gray-400 flex items-center gap-1 font-semibold shrink-0 mr-1">
              <RiFilter3Line size={14} /> Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-purple text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Status & Reset */}
          {(searchQuery || selectedCategory !== 'ALL' || selectedAudience !== 'ALL') && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span>
                Showing <strong>{filteredOpportunities.length}</strong> matching result{filteredOpportunities.length === 1 ? '' : 's'}
              </span>
              <button
                onClick={clearAllFilters}
                className="text-brand-purple hover:underline font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
            <p className="text-sm text-gray-500 mt-4 font-medium">Loading opportunities...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-xs max-w-xl mx-auto p-8">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <RiSearchLine size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Opportunities Found</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              We couldn't find any opportunities matching your current search or filter criteria. Try adjusting your search terms or view all postings.
            </p>
            <Button onClick={clearAllFilters} variant="outline" className="text-brand-purple border-brand-purple/40">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => {
              const deadline = opp.applicationDeadline || opp.visibleUntil;
              const hasExternalLink = opp.externalUrl || opp.url;

              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpp(opp)}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-brand-purple/60 hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >

                  <div>
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-purple/10 text-brand-purple">
                        {formatCategory(opp.category)}
                      </span>
                      {opp.audience && opp.audience !== 'BOTH' && (
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <RiUserLine size={12} />
                          {formatAudience(opp.audience)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-purple transition-colors line-clamp-2 leading-snug mb-2">
                      {opp.title}
                    </h3>

                    {/* Organisation & Country */}
                    {(opp.organisation || opp.country) && (
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-3">
                        {opp.organisation && (
                          <span className="flex items-center gap-1 truncate">
                            <RiBuildingLine size={13} className="shrink-0 text-gray-400" />
                            {opp.organisation}
                          </span>
                        )}
                        {opp.organisation && opp.country && <span>•</span>}
                        {opp.country && (
                          <span className="flex items-center gap-1 shrink-0">
                            <RiMapPinLine size={13} className="text-gray-400" />
                            {opp.country}
                          </span>
                        )}
                      </p>
                    )}

                    {/* Description preview */}
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6">
                      {opp.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Card Bottom / Footer */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    {deadline && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md w-fit">
                        <RiCalendarLine size={13} />
                        <span>Deadline: {new Date(deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs font-semibold text-brand-purple group-hover:text-brand-purpleDark pt-1">
                      <span>Click to view details</span>
                      <RiArrowRightLine size={15} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

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
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 relative bg-linear-to-b from-gray-50/80 to-white">
              <button
                onClick={() => setSelectedOpp(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                aria-label="Close modal"
              >
                <RiCloseLine size={20} />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3 pr-10">
                <span className="text-xs font-bold px-3 py-1 rounded-md bg-brand-purple text-white">
                  {formatCategory(selectedOpp.category)}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-marigold/20 text-brand-purpleDark">
                  Audience: {formatAudience(selectedOpp.audience || 'BOTH')}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {selectedOpp.title}
              </h2>

              {(selectedOpp.organisation || selectedOpp.country) && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-3">
                  {selectedOpp.organisation && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <RiBuildingLine size={16} className="text-brand-purple" />
                      {selectedOpp.organisation}
                    </span>
                  )}
                  {selectedOpp.organisation && selectedOpp.country && <span>•</span>}
                  {selectedOpp.country && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <RiMapPinLine size={16} className="text-brand-purple" />
                      {selectedOpp.country}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Important Dates / Deadline */}
              {(selectedOpp.applicationDeadline || selectedOpp.visibleUntil) && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800">
                    <RiCalendarLine size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Application Deadline</p>
                    <p className="text-base font-bold text-amber-950">
                      {new Date(selectedOpp.applicationDeadline || selectedOpp.visibleUntil).toLocaleDateString(undefined, {
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
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                  About This Opportunity
                </h4>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line space-y-4">
                  {selectedOpp.description}
                </div>
              </div>

              {/* Attachment if present */}
              {selectedOpp.attachmentUrl && (
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple">
                      <RiAttachmentLine size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Official Notice / Brochure</p>
                      <p className="text-xs text-gray-500">Download attached documentation</p>
                    </div>
                  </div>
                  <a
                    href={selectedOpp.attachmentUrl}
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
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedOpp(null)}
                className="w-full sm:w-auto"
              >
                Close Details
              </Button>

              {(selectedOpp.externalUrl || selectedOpp.url) && (
                <a
                  href={selectedOpp.externalUrl || selectedOpp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-purple text-white font-semibold text-sm hover:bg-brand-purpleDark shadow-sm transition-all"
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
