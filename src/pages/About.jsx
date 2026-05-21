import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'
import { mockData } from '../data/mockData'

export default function About() {
  return (
    <div>
      <HeroSection
        title="About Us"
        subtitle="Meet the team behind international excellence"
        cta={{ label: 'Learn More', onClick: () => document.querySelector('section').scrollIntoView({ behavior: 'smooth' }) }}
      />

      {/* Dean Message */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <SectionHeader
              title="Dean, International Outreach"
              centered={false}
              badge="👔"
            />
            <p className="text-gray-700 leading-relaxed mb-4">
              Our international programs are designed to create meaningful partnerships and foster collaborative research. We believe in building bridges across institutions and cultures.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through structured programs and strategic partnerships, we enhance the academic experience for all stakeholders.
            </p>
            <div className="mt-6">
              <CTAButton label="View Full Bio" variant="secondary" />
            </div>
          </div>
          <div className="bg-[#FEFBF6] rounded-xl h-80 flex items-center justify-center border-2 border-[#FEFBF6]">
            <p className="text-gray-400">👔 Dean's Photo</p>
          </div>
        </div>
      </section>

      {/* IR Office Message */}
      <section className="bg-[#FEFBF6] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-[#FEFBF6] rounded-xl h-80 flex items-center justify-center order-2 md:order-1 border-2 border-[#7F5283]/20">
              <p className="text-gray-400">👥 Team Photo</p>
            </div>
            <div className="order-1 md:order-2">
              <SectionHeader
                title="International Relations Office"
                centered={false}
                badge="🌍"
              />
              <p className="text-gray-700 leading-relaxed mb-4">
                The IRO serves as the central hub for all international activities at IITDH. We facilitate student exchanges, faculty collaborations, and institutional partnerships.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our dedicated team ensures smooth visa processing, accommodation, and cultural integration for international members of the IITDH community.
              </p>
              <div className="mt-6">
                <CTAButton label="Contact Us" to="/contact" variant="primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Advisors */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Faculty Advisors"
          subtitle="Department-wise international coordination"
          badge="👨‍🎓"
        />
        <div className="grid md:grid-cols-2 gap-8">
          {mockData.faculty.map((prof, idx) => (
            <Card key={idx} variant="light" border>
              <div className="flex items-start gap-3">
                <div className="text-3xl">👨‍🏫</div>
                <div>
                  <h3 className="text-lg font-bold text-[#7F5283] mb-1">{prof.name}</h3>
                  <p className="text-sm text-[#A6D1E6] font-semibold mb-2">{prof.department}</p>
                  <a href={`mailto:${prof.email}`} className="text-gray-700 hover:text-[#A6D1E6] text-sm">
                    {prof.email}
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* IR Students Team */}
      <section className="bg-[#7F5283] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#A6D1E6] text-xs font-bold tracking-widest uppercase mb-3">Team</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">IR Students Team</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">Student leaders driving international initiatives</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {mockData.irTeam.map((member, idx) => (
              <Card key={idx} variant="accent">
                <div className="text-center">
                  <div className="bg-[#7F5283] rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center border-2 border-[#A6D1E6]">
                    <span className="text-white text-3xl font-bold">{member.name[0]}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#2d0a1e] mb-1">{member.name}</h3>
                  <p className="text-sm text-[#2d0a1e] font-semibold mb-1">{member.role}</p>
                  <p className="text-xs text-[#2d0a1e]">{member.year} Year</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#3D3C42] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Join Our Team</h2>
          <p className="text-gray-200 text-lg mb-8">Help us build international bridges and foster global collaboration</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton label="Apply for IR Team" to="/contact" variant="primary" size="lg" />
            <CTAButton label="Learn More" to="/life" variant="outline" size="lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
