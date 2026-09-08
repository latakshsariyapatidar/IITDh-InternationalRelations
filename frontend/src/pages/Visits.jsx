import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api/client'

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const [eventsRes, visitorsRes] = await Promise.allSettled([
          apiClient.get('/events?type=VISIT&limit=50'),
          apiClient.get('/visitors/public')
        ]);

        const eventItems = (eventsRes.status === 'fulfilled' && eventsRes.value.data?.data?.events) 
          ? eventsRes.value.data.data.events.map(ev => ({
              id: ev.id,
              type: 'event',
              title: ev.title,
              description: ev.description,
              startDate: ev.startDate,
              endDate: ev.endDate,
              location: ev.location,
              imageUrl: ev.imageUrl,
            })) 
          : [];

        const visitorItems = (visitorsRes.status === 'fulfilled' && visitorsRes.value.data?.data?.visitors)
          ? visitorsRes.value.data.data.visitors.map(v => ({
              id: v.id,
              type: 'visitor',
              title: `${v.fullName}${v.designation ? ` (${v.designation})` : ''}`,
              organisation: v.organisation,
              country: v.country,
              description: v.purposeOfVisit,
              startDate: v.visitFrom,
              endDate: v.visitTo,
              location: v.hostName ? `Host: ${v.hostName}` : (v.hostDepartment ? `Dept: ${v.hostDepartment}` : 'IIT Dharwad Campus'),
              isVerified: v.isVerified,
            }))
          : [];

        // Combine and sort by startDate descending
        const combined = [...eventItems, ...visitorItems].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setVisits(combined);
      } catch (err) {
        console.error('Failed to fetch visits', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  return (
    <div>
      <HeroSection
        title="Visits"
        subtitle="Hosted delegations and collaborative missions"
      />

      {/* Upcoming Visits */}
      <section id="visitor-info" className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Delegation Visits"
          subtitle="Recent and scheduled international delegations hosted at IIT Dharwad"
        />

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading visits...</div>
        ) : visits.length > 0 ? (
          <div className="grid md:grid-cols-1 gap-6">
            {visits.map((visit) => (
              <Card key={visit.id} className="group hover:border-brand-purple/40 transition-colors">
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  {visit.imageUrl && (
                    <div className="md:col-span-3 rounded-lg overflow-hidden aspect-video bg-neutral-canvas flex items-center justify-center">
                      <img 
                        src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${visit.imageUrl}`} 
                        alt={visit.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className={visit.imageUrl ? "md:col-span-9" : "md:col-span-12"}>
                    <div className="grid md:grid-cols-2 gap-4 items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">Dates</p>
                        <p className="font-semibold text-neutral-textDark mb-3">
                          {new Date(visit.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                          {visit.endDate && ` - ${new Date(visit.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </p>

                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">
                          {visit.type === 'visitor' ? 'Visitor / Delegation' : 'Event / Delegation'}
                        </p>
                        <p className="font-bold text-neutral-textDark text-lg mb-1 group-hover:text-brand-purple transition-colors">
                          {visit.title}
                        </p>
                        {visit.organisation && (
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            {visit.organisation}{visit.country ? `, ${visit.country}` : ''}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">Purpose / Details</p>
                        <p className="text-neutral-textDark/80 mb-3 whitespace-pre-wrap line-clamp-3 text-sm">
                          {visit.description}
                        </p>

                        {visit.location && (
                          <>
                            <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">Host / Location</p>
                            <p className="text-neutral-textDark font-medium text-sm">{visit.location}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No visits currently available.</div>
        )}
      </section>

      {/* Faculty Delegation Hosting Guide Banner */}
      <section className="bg-brand-purpleDark text-white py-12 border-y border-brand-marigold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-md bg-brand-marigold/20 text-brand-marigold text-xs font-bold uppercase tracking-wider mb-2">
              Faculty Hosted Visits
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">Hosting an International Guest or Delegation?</h3>
            <p className="text-brand-purpleLight/85 text-sm max-w-2xl leading-relaxed">
              Official academic visits to IIT Dharwad are hosted and coordinated by an IIT Dharwad faculty member. Faculty members can register visiting delegates, schedules, and itineraries directly through the Faculty Portal to request IRO campus clearance and hospitality.
            </p>
          </div>
          <Link
            to="/faculty-portal"
            className="shrink-0 px-6 py-3 rounded-lg bg-brand-marigold text-brand-purpleDark font-bold text-sm hover:bg-brand-marigoldDark transition-colors shadow-md"
          >
            Faculty Portal Login →
          </Link>
        </div>
      </section>

      {/* Visitor Information */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Visitor Information"
            subtitle="Everything visiting delegations need to know"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-bold text-neutral-textDark mb-4">Campus Access</h3>
              <ul className="space-y-3 text-neutral-textDark/80 text-sm">
                <li><strong>Entry Process:</strong> Security gate clearance coordinated via IRO through host faculty</li>
                <li><strong>Parking:</strong> Visitor parking available near the main gate</li>
                <li><strong>Reception:</strong> Main reception in Building 1</li>
                <li><strong>Facilities:</strong> High-speed campus Wi-Fi access credentials provided on arrival</li>
                <li><strong>Transportation:</strong> Campus shuttle service available</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Information</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li><strong>Nearest Airport:</strong> Hubballi Airport (90 km)</li>
                <li><strong>Railway Station:</strong> Dharwad Railway Station (8 km)</li>
                <li><strong>Hotels:</strong> Institute Guest House on campus and city hotels in Dharwad/Hubballi</li>
                <li><strong>Currency:</strong> Indian Rupee (INR)</li>
                <li><strong>Climate:</strong> Moderate, pleasant during Oct-Feb</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Visiting Process */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="How Delegation Visits Are Organized"
            subtitle="Campus visit protocol for international delegations and visiting scholars"
          />
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border border-brand-purpleLight/40 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="text-4xl font-bold text-brand-purple mb-3">1</div>
                <h4 className="font-bold text-gray-900 mb-2">Connect with Host Faculty</h4>
                <p className="text-sm text-gray-700">Visiting scholars and delegations coordinate with an IIT Dharwad faculty host or academic department to plan visit objectives.</p>
              </div>
            </Card>
            <Card className="text-center border border-brand-purpleLight/40 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="text-4xl font-bold text-brand-purple mb-3">2</div>
                <h4 className="font-bold text-gray-900 mb-2">Faculty Registers Delegation</h4>
                <p className="text-sm text-gray-700 mb-3">The IITDH host faculty member logs in to the IRO Faculty Portal to officially submit delegate details, dates, and agenda.</p>
              </div>
              <Link 
                to="/faculty-portal" 
                className="text-xs font-semibold text-brand-purple hover:text-brand-purpleDark underline mt-2 inline-block"
              >
                Faculty Portal →
              </Link>
            </Card>
            <Card className="text-center border border-brand-purpleLight/40 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="text-4xl font-bold text-brand-purple mb-3">3</div>
                <h4 className="font-bold text-gray-900 mb-2">IRO Clearance & Logistics</h4>
                <p className="text-sm text-gray-700">The International Relations Office reviews the itinerary, issues gate access passes, and coordinates campus guest house booking.</p>
              </div>
            </Card>
            <Card className="text-center border border-brand-purpleLight/40 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="text-4xl font-bold text-brand-purple mb-3">4</div>
                <h4 className="font-bold text-gray-900 mb-2">Campus Welcome & Activities</h4>
                <p className="text-sm text-gray-700">The delegation arrives on campus for academic lectures, departmental lab visits, and collaborative MoU discussions.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
