import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import { Button } from '../../components/ui/button';
import { resolveMediaUrl } from '../../utils/media';
import {
  Mail,
  ExternalLink,
  LogOut,
  Globe,
  Calendar,
  FileText,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building,
  Paperclip,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function FacultyPortal() {
  const { logout, facultyProfile } = useStudentAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(facultyProfile || null);
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(true);
  const [oppsError, setOppsError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedOppIds, setExpandedOppIds] = useState(new Set());

  const toggleExpandOpp = (id) => {
    setExpandedOppIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const fetchProfile = async () => {
    try {
      const profileRes = await apiClient.get('/faculty-portal/me');
      setProfile(profileRes.data?.data?.profile || profileRes.data?.data);
    } catch (err) {
      console.warn('Could not load faculty profile:', err);
    }
  };

  const fetchOpportunities = async () => {
    setLoadingOpps(true);
    setOppsError(null);
    try {
      // 4.12: Pass limit=50
      const oppsRes = await apiClient.get('/faculty-portal/opportunities?limit=50');
      setOpportunities(oppsRes.data?.data?.opportunities || oppsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load faculty opportunities:', err);
      // 1.9 Show actual error state instead of assuming "no opportunities"
      setOppsError(err.response?.data?.message || 'Unable to load opportunities at this time. Please retry.');
    } finally {
      setLoadingOpps(false);
    }
  };

  // 1.10 Load independent requests separately
  useEffect(() => {
    fetchProfile();
    fetchOpportunities();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate('/students', { replace: true });
    }
  };

  // Filter categories
  const categories = ['ALL', ...Array.from(new Set(opportunities.map(o => o.category).filter(Boolean)))];
  const filteredOpportunities = selectedCategory === 'ALL'
    ? opportunities
    : opportunities.filter(o => o.category === selectedCategory);

  const getCategoryBadgeColor = (cat) => {
    switch (cat?.toUpperCase()) {
      case 'RESEARCH':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'EXCHANGE':
        return 'bg-purple-50 text-brand-purpleDark border-purple-200';
      case 'WORKSHOP':
      case 'CONFERENCE':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'INTERNSHIP':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* Dedicated Portal Header */}
      <header className="bg-brand-purpleDark text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-xl tracking-tight text-white leading-tight">
                  Faculty Portal
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-marigold text-brand-purpleDark">
                  IIT Dharwad
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-brand-purpleLight/80">
                International Relations Office
              </p>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">
                  {profile.name || profile.email}
                </span>
                <span className="text-[10px] text-brand-purpleLight/80">
                  {profile.department || 'Faculty Member'}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-brand-purpleLight/30 text-white bg-transparent hover:bg-white/10 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-brand-purpleDark to-brand-purple rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-brand-marigold backdrop-blur-xs mb-1">
              Faculty Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome{profile?.name ? `, ${profile.name}` : ''}
            </h2>
            <p className="text-brand-purpleLight/90 text-sm sm:text-base leading-relaxed">
              Explore bilateral research grants, international mobility calls, and streamline foreign delegation registrations.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-brand-marigold/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Opportunities Feed */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                International Calls & Opportunities
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Grants, research calls, and fellowships open to IIT Dharwad faculty and scholars.
              </p>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-brand-purple text-white shadow-xs'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Calls' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 1.9 Error Banner */}
          {oppsError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-red-700 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500 shrink-0" />
                <span>{oppsError}</span>
              </div>
              <button
                onClick={fetchOpportunities}
                className="flex items-center gap-1 font-bold text-brand-purple hover:underline cursor-pointer"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          )}

          {loadingOpps ? (
            <div className="py-20 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-purple border-t-transparent" />
              <p className="text-sm text-gray-500 font-medium">Loading opportunities feed...</p>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-sm max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Calendar size={22} />
              </div>
              <h4 className="text-base font-bold text-gray-800">No Opportunities Available Right Now</h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                There are currently no active postings in this category. The International Relations Office will publish new bilateral calls and mobility grants here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => {
                const isExpanded = expandedOppIds.has(opp.id);
                const isLong = (opp.description?.length || 0) > 160;
                
                // 4.14: Separate external URL from uploaded attachment
                const externalDestination = opp.externalUrl || opp.url;
                const formattedExternalUrl = externalDestination
                  ? (/^https?:\/\//i.test(externalDestination.trim()) ? externalDestination.trim() : `https://${externalDestination.trim()}`)
                  : null;

                const attachmentDestination = opp.attachmentUrl ? resolveMediaUrl(opp.attachmentUrl) : null;

                // 4.13: Target audience label
                const audienceLabel = opp.audience === 'BOTH'
                  ? 'Target: Students & Faculty'
                  : opp.audience === 'STUDENT'
                  ? 'Target: Students'
                  : 'Target: Faculty';

                return (
                  <div
                    key={opp.id}
                    onClick={() => toggleExpandOpp(opp.id)}
                    className="bg-white rounded-2xl border border-gray-200/80 hover:border-brand-purple/40 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group p-6 cursor-pointer"
                  >
                    <div className="space-y-3">
                      {/* Tags */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${getCategoryBadgeColor(opp.category)}`}>
                          {opp.category || 'General'}
                        </span>
                        {/* 4.13 Display real audience target */}
                        <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {audienceLabel}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-brand-purple transition-colors leading-snug">
                        {opp.title}
                      </h4>

                      {/* 4.15 Show Organisation & Country */}
                      {(opp.organisation || opp.country) && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
                          {opp.organisation && (
                            <span className="flex items-center gap-1 truncate max-w-[180px]">
                              <Building size={13} className="text-brand-purple shrink-0" />
                              {opp.organisation}
                            </span>
                          )}
                          {opp.organisation && opp.country && <span>•</span>}
                          {opp.country && (
                            <span className="flex items-center gap-1 shrink-0">
                              <MapPin size={13} className="text-brand-purple shrink-0" />
                              {opp.country}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description with Expand/Collapse */}
                      <div>
                        <p className={`text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-4'}`}>
                          {opp.description || 'No additional details provided for this posting.'}
                        </p>
                        {isLong && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandOpp(opp.id);
                            }}
                            className="text-xs font-semibold text-brand-purple hover:text-brand-purpleDark hover:underline inline-flex items-center gap-1 mt-2 cursor-pointer"
                          >
                            {isExpanded ? (
                              <>
                                <span>Show less</span>
                                <ChevronUp size={13} />
                              </>
                            ) : (
                              <>
                                <span>Read full details</span>
                                <ChevronDown size={13} />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-5 mt-5 border-t border-gray-100 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        {opp.applicationDeadline || opp.deadline ? (
                          <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            <Calendar size={13} />
                            Deadline: {new Date(opp.applicationDeadline || opp.deadline).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">Open Call</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        {/* 4.14 Show attachment separately from external link */}
                        {attachmentDestination && (
                          <a
                            href={attachmentDestination}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline"
                          >
                            <Paperclip size={13} />
                            <span>Download PDF</span>
                          </a>
                        )}

                        {formattedExternalUrl ? (
                          <a
                            href={formattedExternalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-semibold shadow-xs transition-colors ml-auto cursor-pointer"
                          >
                            <span>Open Call</span>
                            <ExternalLink size={13} />
                          </a>
                        ) : !attachmentDestination ? (
                          <span className="text-xs text-gray-400 font-medium">Contact IRO for details</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Resources & Quick Actions Grid */}
        <section className="space-y-4 pt-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              International Relations Resources
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Quick links and assistance for faculty members managing global collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 4.15 Point MOUs & Agreements at the partner universities, which list each MOU */}
            <Link
              to="/partners#partner-universities"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-purple/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="text-brand-purple">
                  <FileText size={20} />
                </div>
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-purple transition-colors">
                  International MOUs & Agreements
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Browse ratified bilateral institutional MOUs and access authorized agreement documents.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-semibold text-brand-purple">
                <span>Browse MOUs</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4.11 Link to /iro/delegate-registration instead of 404 */}
            <Link
              to="/iro/delegate-registration"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-purple/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="text-blue-600">
                  <Users size={20} />
                </div>
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  Register Visiting Delegations
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Hosting an international professor or foreign academic delegation? Submit their itinerary to the IRO registry.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <span>Open Registration Form</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <a
              href="mailto:office.iro@iitdh.ac.in?subject=Faculty%20International%20Collaboration%20Inquiry"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-purple/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="text-amber-700">
                  <Mail size={20} />
                </div>
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-purple transition-colors">
                  Contact Office of International Relations
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Need help negotiating agreements, drafting joint proposals, or visa paperwork for overseas visits?
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-semibold text-brand-purple">
                <span>office.iro@iitdh.ac.in</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
