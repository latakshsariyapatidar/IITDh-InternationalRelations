import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import { mockData } from '../data/mockData'

export default function Partners() {
  return (
    <div>
      <HeroSection
        title="Our Partners"
        subtitle="Building bridges through international collaborations"
      />

      {/* Foreign Universities */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Partner Universities"
          subtitle="Leading institutions from around the world"
          badge="PARTNERS"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {mockData.partnerships.universities.map((uni, idx) => (
            <Card key={idx} variant="light" className="text-center">
              <div className="text-5xl mb-4">UNI</div>
              <h3 className="text-lg font-bold text-brand-purple mb-2">{uni.name}</h3>
              <p className="text-neutral-textDark">{uni.country}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Organizations */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Partner Organizations"
            subtitle="Collaborating bodies and agencies"
            badge="NETWORK"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {mockData.partnerships.organizations.map((org, idx) => (
              <Card key={idx} variant="default">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-textDark">{org.name}</h3>
                  <span className="text-3xl">NET</span>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-neutral-textDark/70">Country/Region:</p>
                  <p className="font-semibold text-neutral-textDark">{org.country}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-textDark/70">Focus Area:</p>
                  <p className="font-semibold text-brand-purple">{org.focus}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Partnership Benefits"
          subtitle="What our collaborations offer"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-neutral-textDark mb-4">For Students</h3>
            <ul className="space-y-2 text-neutral-textDark/80">
              <li>✓ Exchange semester opportunities</li>
              <li>✓ Joint degree programs</li>
              <li>✓ Research collaborations</li>
              <li>✓ Global networking</li>
              <li>✓ Internship placements</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-neutral-textDark mb-4">For Faculty</h3>
            <ul className="space-y-2 text-neutral-textDark/80">
              <li>✓ Research partnerships</li>
              <li>✓ Joint publications</li>
              <li>✓ Faculty exchange programs</li>
              <li>✓ Collaborative funding</li>
              <li>✓ Knowledge sharing</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
