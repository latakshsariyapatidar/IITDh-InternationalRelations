import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

export default function Visa() {
  return (
    <div>
      <HeroSection
        title="Visa & Immigration"
        subtitle="Information for international students and visitors"
      />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Visa & Immigration Information for International Students and Visitors"
          subtitle="Overview"
        />
        <Card>
          <p className="text-gray-700 leading-relaxed">
            India offers various visa categories for international students, researchers, professionals, visitors, and dependents. Foreign nationals visiting India must ensure that they hold the appropriate visa category corresponding to the purpose of their stay.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            International visitors are advised to review visa eligibility, duration, registration requirements, and extension procedures before traveling to India.
          </p>
        </Card>
      </section>

      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Major Visa Categories"
            subtitle="Primary categories for visitors to India"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Education & Research</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Student Visa - for full-time academic study</li>
                <li>Research Visa - for academic or scientific research</li>
                <li>Research Intern Visa - for short-term research internships</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Business & Professional</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Business Visa - meetings, trade, conferences, business activities</li>
                <li>Employment Visa - employment with an Indian organization</li>
                <li>Project Visa - working on approved projects</li>
                <li>Intern Visa - internships in Indian organizations</li>
                <li>Conference Visa - approved conferences and seminars</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Medical</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Medical Visa - medical treatment in India</li>
                <li>Medical Attendant Visa - accompanying a medical patient</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Tourist & Short-Term Visits</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Tourist Visa - tourism, sightseeing, visiting friends or relatives</li>
                <li>Transit Visa - short transit stays while traveling onward</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Cultural, Religious & Specialized</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Entry Visa (X Visa) - dependents, spouses, special categories</li>
                <li>Missionary Visa - missionary or religious work</li>
                <li>Mountaineering Visa - trekking in restricted areas</li>
                <li>Film Visa - filming and documentary purposes</li>
                <li>Journalist Visa - media and journalism activities</li>
                <li>Sports Visa - athletes and sports professionals</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">Diplomatic & Official</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Diplomatic Visa</li>
                <li>Official Visa</li>
                <li>UN Diplomatic or Official Visa</li>
              </ul>
            </Card>
            <Card className="md:col-span-2">
              <h3 className="text-xl font-bold text-brand-purpleDark mb-3">OCI Category</h3>
              <p className="text-sm text-gray-700">OCI (Overseas Citizen of India) - long-term immigration status for eligible persons of Indian origin.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Student & Research Visas"
          subtitle="Common categories for international students and scholars"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Student and Research Categories</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>S-1: Higher education, provisional student visa, short-term course, student exchange</li>
              <li>S-2: School education in India</li>
              <li>S-3: Yoga, Vedic culture, Indian music and dance, Buddhist studies</li>
              <li>S-4: Theological studies and missionary students</li>
              <li>S-5: Research scholar, visiting research faculty, bilateral exchange programs</li>
              <li>S-6: Internship in India</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-3">E-Student Visa (e-Student)</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Purpose: Digitized visa category for eligible students registered on the official portal.</li>
              <li>Includes: Full-time UG, PG, and PhD programs.</li>
              <li>Dependents can apply for an e-Student-X visa.</li>
            </ul>
          </Card>
          <Card className="md:col-span-2">
            <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Dependent Visas under Student Visa</h3>
            <p className="text-sm text-gray-700 mb-3">Dependent visas may be issued for eligible dependents of S-1, S-3, and S-5 categories. For other categories, dependent visas are not granted.</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>S-1X: Dependent of student in higher education</li>
              <li>S-3X: Dependent of student in Yoga, Vedic culture, music, dance, Buddhist studies</li>
              <li>S-5X: Dependent of research scholar or visiting research faculty</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Conference, Employment, and Business Visas"
            subtitle="Additional categories and dependent types"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Conference Visas</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>C-1: Conferences organized by government authorities</li>
                <li>C-2: Conferences organized by non-government authorities</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Employment Visas</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>E-1: Employment (except intra-company transferees and NGO employment)</li>
                <li>E-2: Intra-company transferees</li>
                <li>E-3: Employment in NGOs</li>
                <li>E-4: Projects in power and steel sectors</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3 font-semibold">Dependent Visas</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>E-1X: Dependents of E-1 holders</li>
                <li>E-2X: Dependents of E-2 holders</li>
                <li>E-3X: Dependents of E-3 holders</li>
                <li>E-4X: Dependents of E-4 holders</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Business Visas</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>B-1: Establishing ventures, frequent business travel, investors</li>
                <li>B-2: All other business activities (excluding B-1 and sports persons)</li>
                <li>B-3: Sports persons and coaches in commercial events</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3 font-semibold">Dependent Visas</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>B-1X: Dependents of B-1 holders</li>
                <li>B-2X: Dependents of B-2 holders</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Diplomatic Visas</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>D-1: Diplomat assigned in India (diplomatic passport)</li>
                <li>D-2: Diplomat on visit for official purpose</li>
                <li>D-3: Diplomat assigned to non-UN international organization</li>
                <li>UD-1: UN diplomat assigned to India</li>
                <li>UD-2: UN diplomat on visit to India</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3 font-semibold">Dependent Visas</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>D-1X: Dependent of D-1</li>
                <li>D-2X: Dependent of D-2</li>
                <li>D-3X: Dependent of D-3</li>
                <li>UD-1X: Dependent of UD-1</li>
                <li>UD-2X: Dependent of UD-2</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Entry, e-Visa, Medical, and Official Visas"
          subtitle="Specialized categories"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Entry Visa (X)</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>X-Double Entry: Short-term double-entry visa, valid up to 3 months</li>
              <li>X-1: Persons of Indian origin and spouses of Indian citizens</li>
              <li>X-2: Joining approved organizations such as Auroville Foundation</li>
              <li>X-Misc: Categories specified in visa manual not covered elsewhere</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-3">e-Visa Types</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>e-Tourist Visa: Recreation, sightseeing, short-term courses</li>
              <li>e-Business Visa: Business meetings and trade fairs</li>
              <li>e-Medical Visa: Medical treatment in India</li>
              <li>e-Medical Attendant Visa: Accompanying an e-Medical holder</li>
              <li>e-Conference Visa: Conferences and workshops</li>
              <li>e-Ayush Visa: Ayush therapies and wellness programs</li>
              <li>e-Ayush Attendant Visa: Companion of an e-Ayush visa holder</li>
              <li>e-Student Visa: Short-term courses or programs in India</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Medical Visa</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>MED-1: For patients</li>
              <li>MED-2: For medical attendants</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-3">Official Visa</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>O-1: Non-diplomatic official assigned to mission in India</li>
              <li>O-1X: Dependent of O-1 official</li>
              <li>O-2: Non-diplomatic official on visit for official purpose</li>
              <li>O-2X: Dependent of O-2 official</li>
              <li>UO-1: UN non-diplomatic official assigned to India</li>
              <li>UO-1X: Dependent of UO-1 official</li>
              <li>UO-2: UN non-diplomatic official on visit to India</li>
              <li>UO-2X: Dependent of UO-2 official</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Visa Provisions and Policies"
            subtitle="Common visa durations and document requirements"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-brand-purpleLight">
              <thead className="bg-white">
                <tr className="text-brand-purpleDark">
                  <th className="p-3 border-b border-brand-purpleLight">Type of Visa</th>
                  <th className="p-3 border-b border-brand-purpleLight">Period</th>
                  <th className="p-3 border-b border-brand-purpleLight">Entry</th>
                  <th className="p-3 border-b border-brand-purpleLight">Documents Required</th>
                  <th className="p-3 border-b border-brand-purpleLight">Extendable</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="text-gray-700">
                  <td className="p-3 border-b border-brand-purpleLight">Business Visa</td>
                  <td className="p-3 border-b border-brand-purpleLight">5 years</td>
                  <td className="p-3 border-b border-brand-purpleLight">Multiple</td>
                  <td className="p-3 border-b border-brand-purpleLight">Company letter and purpose documents</td>
                  <td className="p-3 border-b border-brand-purpleLight">Yes</td>
                </tr>
                <tr className="text-gray-700">
                  <td className="p-3 border-b border-brand-purpleLight">Employment Visa</td>
                  <td className="p-3 border-b border-brand-purpleLight">1 year or contract period</td>
                  <td className="p-3 border-b border-brand-purpleLight">Multiple</td>
                  <td className="p-3 border-b border-brand-purpleLight">Appointment document and terms</td>
                  <td className="p-3 border-b border-brand-purpleLight">Yes</td>
                </tr>
                <tr className="text-gray-700">
                  <td className="p-3 border-b border-brand-purpleLight">Student/Research Visa</td>
                  <td className="p-3 border-b border-brand-purpleLight">Course period or 5 years</td>
                  <td className="p-3 border-b border-brand-purpleLight">Multiple</td>
                  <td className="p-3 border-b border-brand-purpleLight">Admission proof in Indian institution</td>
                  <td className="p-3 border-b border-brand-purpleLight">Yes</td>
                </tr>
                <tr className="text-gray-700">
                  <td className="p-3 border-b border-brand-purpleLight">Intern Visa</td>
                  <td className="p-3 border-b border-brand-purpleLight">Internship duration or 1 year</td>
                  <td className="p-3 border-b border-brand-purpleLight">Single/Double/Multiple</td>
                  <td className="p-3 border-b border-brand-purpleLight">Sponsoring letter with internship period</td>
                  <td className="p-3 border-b border-brand-purpleLight">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Visa Extension"
          subtitle="Key points for extensions while in India"
        />
        <Card>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Extension is possible for certain visa types through the e-FRRO portal.</li>
            <li>Assistance for extension can be provided by the International Relations Office on request.</li>
            <li>Visa extension fees are borne by the foreign national.</li>
            <li>Documents from the institute are provided by the Academic or International Relations office.</li>
            <li>Visa extension requests should be made 60 days before visa expiry.</li>
            <li>Applicants are responsible for applying on time and meeting compliance.</li>
          </ul>
        </Card>
      </section>

      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Immigration Procedures"
            subtitle="FRRO registration and e-FRRO platform"
          />
          <Card className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              The Foreigners Regional Registration Office (FRRO) monitors and regulates foreign nationals in India. All foreigners intending to stay in India for more than 180 days must register with the FRRO within 14 days of arrival.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              e-FRRO portal: <a href="https://indianfrro.gov.in/eservices/" className="text-brand-purple hover:underline" target="_blank" rel="noopener noreferrer">https://indianfrro.gov.in/eservices/</a>
            </p>
            <ul className="space-y-2 text-sm text-gray-700 mt-4">
              <li>Online service delivery without visiting FRRO/FRO office unless called.</li>
              <li>Faceless, cashless, and paperless services for foreigners.</li>
              <li>Registered users can apply for registration, visa extension, conversion, exit permit.</li>
              <li>Registration permits and certificates are sent electronically and by post.</li>
              <li>FRRO/FRO visits are required only in exceptional cases or exigency.</li>
            </ul>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">C Form (Residential Proof)</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Hotels, guest houses, hostels, homestays, and hospitals must report foreign guests.</li>
                <li>Fill the C Form at hostel or guest house front office within 24 hours of arrival.</li>
                <li>Collect the soft copy after submission on the immigration portal.</li>
                <li>C Form is required for dependent visas as well.</li>
                <li>Those staying off-campus must fill the C Form or request their landlord/hotel to do it.</li>
                <li>Non-compliance can lead to fines or penalties.</li>
              </ul>
              <div className="mt-4">
                <p className="text-sm font-semibold text-brand-purpleDark">Documents Required</p>
                <ul className="space-y-2 text-sm text-gray-700 mt-2">
                  <li>Photograph (less than 50 KB)</li>
                  <li>Passport copy</li>
                  <li>Valid visa</li>
                </ul>
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-3">S Form (FSIS)</h3>
              <p className="text-sm text-gray-700 mb-3">Foreign Students Information System (FSIS) captures information about foreign nationals admitted to Indian institutions.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Filled at the International Relations office within 14 days of arrival.</li>
                <li>A number is generated upon submission and should be recorded.</li>
                <li>Soft copy is sent to the foreigner's email for reference.</li>
                <li>The S Form number is the FSIS number.</li>
              </ul>
              <div className="mt-4">
                <p className="text-sm font-semibold text-brand-purpleDark">Documents Required</p>
                <ul className="space-y-2 text-sm text-gray-700 mt-2">
                  <li>Photograph (less than 50 KB)</li>
                  <li>Passport copy</li>
                  <li>Bonafide certificate or admission proof</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Official Government Links"
          subtitle="Useful portals and guidelines"
        />
        <Card>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="https://indianvisaonline.gov.in/" className="text-brand-purple hover:underline" target="_blank" rel="noopener noreferrer">Indian Visa Online</a></li>
            <li><a href="https://indianfrro.gov.in/eservices/" className="text-brand-purple hover:underline" target="_blank" rel="noopener noreferrer">e-FRRO Portal</a></li>
            <li><a href="https://www.mea.gov.in/" className="text-brand-purple hover:underline" target="_blank" rel="noopener noreferrer">Ministry of External Affairs - FRRO Guidelines</a></li>
          </ul>
        </Card>
      </section>
    </div>
  )
}
