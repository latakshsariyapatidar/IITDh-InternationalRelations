import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

export default function Visa() {
  return (
    <div>
      <HeroSection
        title="Visa & Immigration"
        subtitle="Complete guide for studying in India"
      />

      {/* Visa Types */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Student Visa Types"
          subtitle="Different visa categories for international students"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Visa (X-Category)</h3>
            <p className="text-gray-700 mb-4">The most common visa category for international students pursuing full-time degree programs.</p>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-blue-700">Duration:</p>
                <p>1 year (extendable annually based on program duration)</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Requirements:</p>
                <ul className="list-disc ml-5 space-y-1 mt-1">
                  <li>Admission letter from IITDH</li>
                  <li>Passport (valid for 6+ months)</li>
                  <li>Financial documents</li>
                  <li>Health certificate</li>
                  <li>Police clearance</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Processing:</p>
                <p>4-6 weeks from submission</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Research Visa (X-Category)</h3>
            <p className="text-gray-700 mb-4">Designed for research scholars and visiting researchers at Indian institutions.</p>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-blue-700">Duration:</p>
                <p>Based on research period, typically 1-4 years</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Requirements:</p>
                <ul className="list-disc ml-5 space-y-1 mt-1">
                  <li>Research registration letter</li>
                  <li>Valid passport</li>
                  <li>Sponsorship from IITDH</li>
                  <li>Health & police clearance</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Extensions:</p>
                <p>Renewable based on research progress</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Visa on Arrival (VOA)</h3>
            <p className="text-gray-700 mb-4">Short-term visa for conference attendees and academic visitors (limited applicants).</p>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-blue-700">Duration:</p>
                <p>Up to 60 days</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Eligible Countries:</p>
                <p>Selected countries only</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Application:</p>
                <p>Apply online, approval before arrival</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Visa (B)</h3>
            <p className="text-gray-700 mb-4">For faculty attending conferences, seminars, or collaborative meetings.</p>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-blue-700">Duration:</p>
                <p>Up to 6 months</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Validity:</p>
                <p>Multi-entry possible</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700">Processing:</p>
                <p>2-4 weeks typically</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Visa Extension */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Visa Extension Process"
            subtitle="How to extend your student visa"
          />
          <Card className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Timeline for Extension</h4>
                <p className="text-gray-700 mb-3">
                  Students should apply for visa extension 60-90 days before the current visa expires. Processing typically takes 4-6 weeks.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Required Documents</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Valid passport and current visa</li>
                  <li>✓ Extension application form (available from IRO)</li>
                  <li>✓ Progress certificate from your department</li>
                  <li>✓ Financial certificate (bank statement or fee receipt)</li>
                  <li>✓ Medical fitness certificate</li>
                  <li>✓ No Objection Certificate (NOC) from IRO</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Processing Authority</h4>
                <p className="text-gray-700">
                  Submit all documents to the <strong>International Relations Office</strong> or directly to the nearest Foreigners Regional Registration Office (FRRO/FRO) in your city.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* e-FRRO Information */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="e-FRRO Registration"
          subtitle="Mandatory registration for international students"
        />
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">What is e-FRRO?</h3>
            <p className="text-gray-700 mb-4">
              e-FRRO (electronic Foreigners Regional Registration Office) is the online platform for registering international visitors and students staying in India for more than 180 days.
            </p>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Mandatory for:</strong> Students on student visas staying beyond 180 days</p>
              <p><strong>Timeline:</strong> Register within 14 days of arrival</p>
              <p><strong>Process:</strong> Online with physical verification</p>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Registration Steps</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-blue-700 mb-1">Step 1:</p>
                <p>Visit <a href="https://efrro.nic.in" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">efrro.nic.in</a></p>
              </div>
              <div>
                <p className="font-semibold text-blue-700 mb-1">Step 2:</p>
                <p>Create account and fill registration form</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700 mb-1">Step 3:</p>
                <p>Schedule appointment at nearest FRRO office</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700 mb-1">Step 4:</p>
                <p>Submit documents and complete registration</p>
              </div>
              <div>
                <p className="font-semibold text-blue-700 mb-1">Step 5:</p>
                <p>Receive registration certificate (valid for visa duration)</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Important Information */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Important Reminders"
            subtitle="Don't forget these important points"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Visa Compliance</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>⚠️ Never overstay your visa</li>
                <li>⚠️ Maintain valid passport and registration documents</li>
                <li>⚠️ Report address changes to FRRO within 14 days</li>
                <li>⚠️ Keep photocopies of important documents</li>
                <li>⚠️ Inform IRO of any visa issues immediately</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Travel Guidelines</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Carry passport always while traveling</li>
                <li>✓ Inform IRO before leaving India</li>
                <li>✓ Keep exit date within visa validity</li>
                <li>✓ Obtain re-entry permit if leaving mid-stay</li>
                <li>✓ Update contact info with immigration office</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact for Help */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <Card className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Visa?</h3>
          <p className="text-gray-700 mb-4">
            Contact the International Relations Office for visa-related queries and assistance.
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> <a href="mailto:iro@iitdh.ac.in" className="text-blue-700 hover:underline">iro@iitdh.ac.in</a></p>
            <p><strong>Phone:</strong> <a href="tel:+91-8364-241-200" className="text-blue-700 hover:underline">+91-8364-241-200</a></p>
            <p><strong>Office Hours:</strong> Mon-Fri 9:00 AM - 5:30 PM, Sat 10:00 AM - 2:00 PM</p>
          </div>
        </Card>
      </section>
    </div>
  )
}
