import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'

export default function Collaboration() {
  return (
    <div>
      <HeroSection
        title="International Collaboration & Mobility"
        subtitle="Global opportunities for students, faculty, and institutions"
      />

      {/* International Students */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="International Students Programs"
          subtitle="Exchange and learning opportunities"
        />
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Coursework Exchange</h3>
            <p className="text-gray-700 mb-4 text-sm">Spend a semester taking courses at IITDH while completing degree requirements from your home institution.</p>
            <div className="text-sm text-blue-700 font-semibold">Duration: 1 semester</div>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Research Exchange</h3>
            <p className="text-gray-700 mb-4 text-sm">Collaborate with IITDH faculty on cutting-edge research projects in various engineering disciplines.</p>
            <div className="text-sm text-blue-700 font-semibold">Duration: Flexible</div>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Project Work</h3>
            <p className="text-gray-700 mb-4 text-sm">Undertake industry-relevant projects under faculty guidance with hands-on experience.</p>
            <div className="text-sm text-blue-700 font-semibold">Duration: 2-6 months</div>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Internships</h3>
            <p className="text-gray-700 mb-4 text-sm">Gain practical experience through internships in laboratories or industry partner organizations.</p>
            <div className="text-sm text-blue-700 font-semibold">Duration: 2-4 months</div>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Study Tours</h3>
            <p className="text-gray-700 mb-4 text-sm">Educational trips combining classroom learning with visits to industry, heritage sites, and research centers.</p>
            <div className="text-sm text-blue-700 font-semibold">Duration: 1-2 weeks</div>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Master's Programs</h3>
            <p className="text-gray-700 mb-4 text-sm">Pursue full MS degree with research focus under expert faculty guidance.</p>
            <div className="text-sm text-blue-700 font-semibold">Duration: 2 years</div>
          </Card>
        </div>
      </section>

      {/* International Faculty */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="International Faculty Programs"
            subtitle="Funding and collaboration schemes for faculty"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">SPARC</h3>
              <p className="text-gray-700 mb-4">Scheme for Promotion of Academic and Research Collaboration - Government of India initiative for research partnerships.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Funding for international collaboration</li>
                <li>✓ Faculty exchange programs</li>
                <li>✓ Joint research projects</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">VAJRA</h3>
              <p className="text-gray-700 mb-4">Visiting Advanced Joint Research Faculty scheme - enables world-class scientists to work with Indian institutions.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Visiting faculty positions</li>
                <li>✓ Research collaborations</li>
                <li>✓ Knowledge transfer programs</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">GIAN</h3>
              <p className="text-gray-700 mb-4">Global Initiative of Academic Networks - facilitates international faculty to teach and conduct research.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Short-term visiting positions</li>
                <li>✓ Specialized courses</li>
                <li>✓ Research mentoring</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">SERB</h3>
              <p className="text-gray-700 mb-4">Science and Engineering Research Board programs supporting international research initiatives.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Research grants</li>
                <li>✓ International bilateral programs</li>
                <li>✓ Collaborative projects</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* IITDH Students Abroad */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="IITDH Students: Opportunities Abroad"
          subtitle="Exchange and learning programs for our students"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Undergraduate Exchange</h3>
            <p className="text-gray-700 mb-4">Study abroad during 3rd or 4th year at partner universities worldwide.</p>
            <p className="text-sm text-gray-600">Eligibility: CGPA ≥ 7.0</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Dual Degree Programs</h3>
            <p className="text-gray-700 mb-4">Earn dual degrees from IITDH and international partner institutions.</p>
            <p className="text-sm text-gray-600">Duration: 4-5 years</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Postgraduate Exchange</h3>
            <p className="text-gray-700 mb-4">Research internships and thesis work at leading universities globally.</p>
            <p className="text-sm text-gray-600">For M.Tech and PhD students</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Summer Internships</h3>
            <p className="text-gray-700 mb-4">Industry and research internships with companies and institutions abroad.</p>
            <p className="text-sm text-gray-600">Typically 2 months in summer</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Immersion Programs</h3>
            <p className="text-gray-700 mb-4">Short-term cultural and technical learning programs in partner countries.</p>
            <p className="text-sm text-gray-600">Duration: 2-4 weeks</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">PhD Programs</h3>
            <p className="text-gray-700 mb-4">Pursue PhD at international universities with IITDH faculty collaboration.</p>
            <p className="text-sm text-gray-600">Joint degree options available</p>
          </Card>
        </div>
      </section>

      {/* Faculty Funding */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="IITDH Faculty: International Funding"
            subtitle="Government and institutional resources for collaboration"
          />
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Government Schemes</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• SPARC Program</li>
                <li>• VAJRA Scheme</li>
                <li>• GIAN Initiative</li>
                <li>• SERB Programs</li>
                <li>• DST-FIST</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-3">University Partnerships</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Research collaboration funds</li>
                <li>• Faculty exchange grants</li>
                <li>• Joint publications support</li>
                <li>• Dual appointment programs</li>
                <li>• Sabbatical positions</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Internal Support</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Travel grants</li>
                <li>• Collaborative research funds</li>
                <li>• Visiting scholar support</li>
                <li>• Conference presentation aid</li>
                <li>• Publication grants</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* International Admissions */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="International Admissions"
          subtitle="Study in India programs and pathways"
        />
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">SII Program</h3>
              <p className="text-gray-700 text-sm mb-4">Study in India - Government of India initiative promoting higher education for international students.</p>
              <CTAButton to="/admission" className="text-sm">Learn More</CTAButton>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Self-Financed</h3>
              <p className="text-gray-700 text-sm mb-4">Direct admissions for self-funded international students with flexible payment options.</p>
              <CTAButton to="/admission" className="text-sm">Apply</CTAButton>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ICCR Scholarships</h3>
              <p className="text-gray-700 text-sm mb-4">Indian Council for Cultural Relations scholarships for nominated international students.</p>
              <CTAButton to="/admission" className="text-sm">Details</CTAButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
