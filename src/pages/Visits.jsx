import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

export default function Visits() {
  const upcomingVisits = [
    {
      date: 'June 15-20, 2024',
      delegation: 'University of Toronto Delegation',
      country: 'Canada',
      purpose: 'Research collaboration and faculty exchange discussion',
      contact: 'Dr. Rajesh Kumar'
    },
    {
      date: 'July 10-15, 2024',
      delegation: 'TU Darmstadt Student Group',
      country: 'Germany',
      purpose: 'Industrial tour and campus immersion program',
      contact: 'Ms. Priya Singh'
    },
    {
      date: 'August 5-10, 2024',
      delegation: 'Osaka University Faculty Team',
      country: 'Japan',
      purpose: 'Research partnership exploration and MoU renewal',
      contact: 'Dr. Vikram Patel'
    }
  ]

  return (
    <div>
      <HeroSection
        title="International Visits"
        subtitle="Hosted delegations and collaborative missions"
      />

      {/* Upcoming Visits */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Upcoming Visits"
          subtitle="Delegations visiting IITDH"
        />
        <div className="grid md:grid-cols-1 gap-8">
          {upcomingVisits.map((visit, idx) => (
            <Card key={idx}>
              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div>
                  <p className="text-sm font-semibold text-brand-purple mb-1">📅 Dates</p>
                  <p className="font-semibold text-neutral-textDark mb-4">{visit.date}</p>

                  <p className="text-sm font-semibold text-brand-purple mb-1">🏢 Delegation</p>
                  <p className="font-semibold text-neutral-textDark mb-4">{visit.delegation}</p>

                  <p className="text-sm font-semibold text-brand-purple mb-1">🌍 Country</p>
                  <p className="font-semibold text-neutral-textDark">{visit.country}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-purple mb-1">📋 Purpose</p>
                  <p className="text-neutral-textDark/80 mb-4">{visit.purpose}</p>

                  <p className="text-sm font-semibold text-brand-purple mb-1">👤 Coordinator</p>
                  <p className="text-neutral-textDark font-semibold">{visit.contact}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Visit Memories"
            subtitle="Moments from past delegations and visits"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-brand-purpleLight rounded-lg aspect-square flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
                <p className="text-neutral-textDark/60">Visit Photo {item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visitor Information */}
      <section className="max-w-7xl mx-auto px-4 py-16">
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
      </section>

      {/* Visiting Process */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="How to Organize a Visit"
            subtitle="Process for arranging delegation visits"
          />
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-700 mb-3">1</div>
              <h4 className="font-bold text-gray-900 mb-2">Contact IRO</h4>
              <p className="text-sm text-gray-700">Reach out with visit details and timeline</p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-700 mb-3">2</div>
              <h4 className="font-bold text-gray-900 mb-2">Finalize Dates</h4>
              <p className="text-sm text-gray-700">Coordinate with campus schedule</p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-700 mb-3">3</div>
              <h4 className="font-bold text-gray-900 mb-2">Arrange Logistics</h4>
              <p className="text-sm text-gray-700">Transportation and accommodation</p>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-blue-700 mb-3">4</div>
              <h4 className="font-bold text-gray-900 mb-2">Welcome Visit</h4>
              <p className="text-sm text-gray-700">Campus tour and meetings</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
