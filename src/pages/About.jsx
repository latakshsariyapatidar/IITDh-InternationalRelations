import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import { mockData } from '../data/mockData'

export default function About() {
  return (
    <div>
      <HeroSection title="About Us" subtitle="Meet the team behind international excellence" />

      {/* Dean Message */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dean, International Outreach</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our international programs are designed to create meaningful partnerships and foster collaborative research. We believe in building bridges across institutions and cultures.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through structured programs and strategic partnerships, we enhance the academic experience for all stakeholders.
            </p>
          </div>
          <div className="bg-blue-100 rounded-lg h-80 flex items-center justify-center">
            <p className="text-gray-500">Dean's Photo</p>
          </div>
        </div>
      </section>

      {/* IR Office Message */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-blue-100 rounded-lg h-80 flex items-center justify-center order-2 md:order-1">
              <p className="text-gray-500">Team Photo</p>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">International Relations Office</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The IRO serves as the central hub for all international activities at IITDH. We facilitate student exchanges, faculty collaborations, and institutional partnerships.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our dedicated team ensures smooth visa processing, accommodation, and cultural integration for international members of the IITDH community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Advisors */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Faculty Advisors"
          subtitle="Department-wise international coordination"
        />
        <div className="grid md:grid-cols-2 gap-8">
          {mockData.faculty.map((prof, idx) => (
            <Card key={idx}>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{prof.name}</h3>
              <p className="text-sm text-blue-700 font-semibold mb-2">{prof.department}</p>
              <a href={`mailto:${prof.email}`} className="text-blue-700 hover:underline text-sm">
                {prof.email}
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* IR Students Team */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="IR Students Team"
            subtitle="Student leaders driving international initiatives"
          />
          <div className="grid md:grid-cols-4 gap-8">
            {mockData.irTeam.map((member, idx) => (
              <Card key={idx}>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">{member.name[0]}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-blue-700 font-semibold mb-1">{member.role}</p>
                  <p className="text-xs text-gray-600">{member.year} Year</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
