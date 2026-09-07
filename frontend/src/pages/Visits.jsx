import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import { useState, useEffect } from 'react'
import apiClient from '../api/client'

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await apiClient.get('/events?type=VISIT&limit=100');
        setVisits(res.data?.data?.events || []);
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
          subtitle="Visits to IITDH campus"
        />
        {loading ? (
          <div className="text-center py-12">Loading visits...</div>
        ) : visits.length > 0 ? (
          <div className="grid md:grid-cols-1 gap-8">
            {visits.map((visit) => (
              <Card key={visit.id} className="group">
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
                        <p className="text-sm font-semibold text-brand-purple mb-1">Dates</p>
                        <p className="font-semibold text-neutral-textDark mb-4">
                          {new Date(visit.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                          {visit.endDate && ` - ${new Date(visit.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </p>

                        <p className="text-sm font-semibold text-brand-purple mb-1">Delegation / Title</p>
                        <p className="font-semibold text-neutral-textDark mb-4 group-hover:text-brand-purple transition-colors">{visit.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-purple mb-1">Purpose / Details</p>
                        <p className="text-neutral-textDark/80 mb-4 whitespace-pre-wrap line-clamp-3">{visit.description}</p>

                        {visit.location && (
                          <>
                            <p className="text-sm font-semibold text-brand-purple mb-1">Location</p>
                            <p className="text-neutral-textDark font-semibold">{visit.location}</p>
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
                <li><strong>Entry Process:</strong> Gate pass required from IRO</li>
                <li><strong>Parking:</strong> Visitor parking available near main gate</li>
                <li><strong>Reception:</strong> Main reception in Building 1</li>
                <li><strong>Facilities:</strong> WiFi password available at reception</li>
                <li><strong>Transportation:</strong> Campus shuttle service available</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Information</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li><strong>Nearest Airport:</strong> Hubballi Airport (90 km)</li>
                <li><strong>Railway Station:</strong> Dharwad Railway Station (8 km)</li>
                <li><strong>Hotels:</strong> Multiple options in Dharwad city</li>
                <li><strong>Currency:</strong> Indian Rupee (INR)</li>
                <li><strong>Climate:</strong> Moderate, best during Oct-Feb</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Visiting Process */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="How to Organize a Visit"
            subtitle="Process for arranging delegation visits"
          />
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border border-brand-purpleLight/40 hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-brand-purple mb-3">1</div>
              <h4 className="font-bold text-gray-900 mb-2">Contact IRO</h4>
              <p className="text-sm text-gray-700">Reach out with visit details and timeline</p>
            </Card>
            <Card className="text-center border border-brand-purpleLight/40 hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-brand-purple mb-3">2</div>
              <h4 className="font-bold text-gray-900 mb-2">Finalize Dates</h4>
              <p className="text-sm text-gray-700">Coordinate with campus schedule</p>
            </Card>
            <Card className="text-center border border-brand-purpleLight/40 hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-brand-purple mb-3">3</div>
              <h4 className="font-bold text-gray-900 mb-2">Arrange Logistics</h4>
              <p className="text-sm text-gray-700">Transportation and accommodation</p>
            </Card>
            <Card className="text-center border border-brand-purpleLight/40 hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-brand-purple mb-3">4</div>
              <h4 className="font-bold text-gray-900 mb-2">Welcome Visit</h4>
              <p className="text-sm text-gray-700">Campus tour and meetings</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
