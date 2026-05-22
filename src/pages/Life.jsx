import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

export default function Life() {
  return (
    <div>
      <HeroSection
        title="Life @ IIT Dharwad"
        subtitle="Experience vibrant campus life in scenic Dharwad"
      />

      {/* About Campus */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="About Our Campus"
          subtitle="State-of-the-art facilities in a serene environment"
        />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">
              IITDH campus spans 500+ acres of lush green space with modern infrastructure. The campus is designed to foster academic excellence while providing a comfortable and inclusive living environment.
            </p>
            <p className="text-gray-700 leading-relaxed">
              From world-class laboratories to recreational facilities, every aspect is designed for student welfare and growth.
            </p>
          </div>
          <div className="bg-brand-purpleLight/40 rounded-lg aspect-video flex items-center justify-center">
            <p className="text-brand-purpleDark/60">Campus Photo</p>
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Accommodation" subtitle="Comfortable and safe living spaces" />
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Hostel Facilities</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Well-furnished rooms</li>
                <li>✓ High-speed WiFi</li>
                <li>✓ 24/7 Security</li>
                <li>✓ Common areas</li>
                <li>✓ Laundry services</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Support Services</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Residential Counselors</li>
                <li>✓ Health Services</li>
                <li>✓ Maintenance Staff</li>
                <li>✓ Emergency Support</li>
                <li>✓ International Support</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Community</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Socials & Events</li>
                <li>✓ Study Groups</li>
                <li>✓ Sports & Recreation</li>
                <li>✓ Cultural Activities</li>
                <li>✓ Peer Mentorship</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Dining */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Dining & Food Services"
          subtitle="Diverse culinary options for all preferences"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Main Mess</h3>
            <p className="text-gray-700 mb-3">
              Serves diverse cuisines including vegetarian, non-vegetarian, and international options. Hygienic preparation and nutrition-focused menus.
            </p>
            <p className="text-sm text-gray-600">Open: 7:00 AM - 9:30 PM daily</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Cafeterias</h3>
            <p className="text-gray-700 mb-3">
              Multiple eating outlets across campus serving snacks, beverages, and light meals. Convenient locations near academic buildings.
            </p>
            <p className="text-sm text-gray-600">Open: 8:00 AM - 9:00 PM</p>
          </Card>
        </div>
      </section>

      {/* Campus Life */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Campus Life & Facilities"
            subtitle="Everything you need for a fulfilling student experience"
          />
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-brand-purpleLight/50 rounded-lg aspect-video flex items-center justify-center">
              <p className="text-brand-purpleDark/70">Campus Life Video</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-purpleDark mb-4">Explore Our Campus</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-brand-purpleDark mb-1">Sports Complex</h4>
                  <p className="text-gray-700 text-sm">Fitness center, basketball, volleyball, badminton courts</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-purpleDark mb-1">Library</h4>
                  <p className="text-gray-700 text-sm">Modern library with vast digital and physical collections</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-purpleDark mb-1">Cultural Hub</h4>
                  <p className="text-gray-700 text-sm">Auditorium, performance spaces for events</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-purpleDark mb-1">Medical Center</h4>
                  <p className="text-gray-700 text-sm">24/7 health services and emergency care</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Clubs & Societies</h3>
              <p className="text-gray-700 text-sm">100+ student clubs covering cultural, technical, and interest areas</p>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Events & Festivals</h3>
              <p className="text-gray-700 text-sm">Annual festivals, technical fests, and cultural celebrations</p>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Outdoor Activities</h3>
              <p className="text-gray-700 text-sm">Trekking, adventure sports, and exploration opportunities</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Explore India & Karnataka */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Explore India & Karnataka"
          subtitle="Rich cultural and natural heritage awaits"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Karnataka Attractions</h3>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li><strong>Hampi:</strong> UNESCO World Heritage Site with ancient temples</li>
              <li><strong>Western Ghats:</strong> Coffee plantations and scenic trekking routes</li>
              <li><strong>Bandipur:</strong> National park with wildlife and nature reserves</li>
              <li><strong>Coastal Karnataka:</strong> Beaches and fishing villages</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Travel from Dharwad</h3>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li><strong>Bengaluru:</strong> 4-5 hours (major tech hub, museums)</li>
              <li><strong>Goa:</strong> 6 hours (beaches, Portuguese heritage)</li>
              <li><strong>Coorg:</strong> 5 hours (hill station, waterfalls)</li>
              <li><strong>Bijapur:</strong> 2 hours (Mughal architecture)</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
