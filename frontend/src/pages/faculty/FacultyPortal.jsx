import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import { Button } from '../../components/ui/button';
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
  ChevronUp
} from 'lucide-react';

export default function FacultyPortal() {
  const { logout, facultyProfile } = useStudentAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(facultyProfile || null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await apiClient.get('/faculty-portal/me');
        setProfile(profileRes.data?.data?.profile || profileRes.data?.data);

        const oppsRes = await apiClient.get('/faculty-portal/opportunities');
        setOpportunities(oppsRes.data?.data?.opportunities || oppsRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load faculty portal data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-brand-marigold/20 text-brand-marigold px-2 py-0.5 rounded-full border border-brand-marigold/30 hidden xs:inline-block">
                  IIT Dharwad
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-brand-purpleLight/80 hidden md:block">
                International Relations Office
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/80 hover:text-white hover:bg-white/15 gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

        {/* Profile Details Banner - Solid Color, No Gradients */}
        <section className="rounded-2xl bg-brand-purpleDark text-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Welcome, {profile?.name || 'Professor'}
              </h2>
            </div>
          </div>

          {/* Profile Details Metadata Bar */}
          <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10 text-white/90">
              <Mail size={16} className="text-brand-marigold shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-brand-purpleLight/70 block uppercase font-bold tracking-wider">Institute Email</span>
                <span className="font-medium truncate block">{profile?.email || 'No email specified'}</span>
              </div>
            </div>

            {profile?.redirectUrl ? (
              <a
                href={profile.redirectUrl.startsWith('http') ? profile.redirectUrl : `https://${profile.redirectUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  const targetUrl = profile.redirectUrl.startsWith('http') ? profile.redirectUrl : `https://${profile.redirectUrl}`;
                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center justify-between gap-2.5 bg-white/10 hover:bg-white/20 transition-colors px-3.5 py-2.5 rounded-xl border border-white/10 text-white/90 group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Globe size={16} className="text-brand-marigold shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-brand-purpleLight/70 block uppercase font-bold tracking-wider">Faculty Webpage</span>
                    <span className="font-medium truncate block text-white group-hover:underline">Visit Official Profile</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-white/60 group-hover:text-white shrink-0" />
              </a>
            ) : (
              <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10 text-white/90">
                <Globe size={16} className="text-brand-marigold shrink-0" />
                <div>
                  <span className="text-[10px] text-brand-purpleLight/70 block uppercase font-bold tracking-wider">Webpage</span>
                  <span className="text-white/70 italic text-xs">No link attached</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                Opportunities & Calls for Faculty
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purpleDark font-semibold">
                  {filteredOpportunities.length}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Bilateral research initiatives, faculty mobility schemes, and global academic conferences.
              </p>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${selectedCategory === cat
                      ? 'bg-brand-purpleDark text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brand-purple border-t-transparent mb-3"></div>
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
                const rawUrl = opp.externalUrl || opp.attachmentUrl || opp.url;
                const destinationUrl = rawUrl
                  ? (/^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`)
                  : null;

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
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          Target: Faculty
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-brand-purple transition-colors leading-snug">
                        {opp.title}
                      </h4>

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
                            className="text-xs font-semibold text-brand-purple hover:text-brand-purpleDark hover:underline inline-flex items-center gap-1 mt-2"
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

                    {/* Card Footer Action */}
                    <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-2">
                      {opp.applicationDeadline || opp.deadline ? (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={13} />
                          {new Date(opp.applicationDeadline || opp.deadline).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Open Call</span>
                      )}

                      {destinationUrl ? (
                        <a
                          href={destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Open Opportunity</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Contact IRO for details</span>
                      )}
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
            <Link
              to="/international-mobility"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-purple/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-purple transition-colors">
                  International MOUs & Agreements
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Learn how to initiate and formalize academic or research agreements with foreign partner institutions.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-semibold text-brand-purple">
                <span>View Guidelines</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/visitors/register"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-purple/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
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
              href="mailto:iro@iitdh.ac.in?subject=Faculty%20Mobility%20Query"
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-purple/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-amber-600 transition-colors">
                  Contact IRO Secretariat
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Direct support for faculty mobility visas, foreign research clearances, and travel grants.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-semibold text-amber-600">
                <span>Email iro@iitdh.ac.in</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Office of International Relations • Indian Institute of Technology Dharwad</p>
      </footer>
    </div>
  );
}
