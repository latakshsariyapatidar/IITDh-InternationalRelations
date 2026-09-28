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
        const [eventsRes] = await Promise.allSettled([
          apiClient.get('/events?type=VISIT&limit=50'),
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

        // Combine and sort by startDate descending
        const combined = [...eventItems].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
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
    </div>
  )
}
