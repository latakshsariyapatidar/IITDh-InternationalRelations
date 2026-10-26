import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import { RiExternalLinkLine } from '@remixicon/react'

const CONTENTS = [
  { id: 'overview', label: 'Overview' },
  { id: 'categories', label: 'Major visa categories' },
  { id: 'student-research', label: 'Student and research visas' },
  { id: 'other-visas', label: 'Other visa codes' },
  { id: 'provisions', label: 'Provisions and policies' },
  { id: 'extension', label: 'Visa extension' },
  { id: 'immigration', label: 'Immigration procedures' },
  { id: 'links', label: 'Official links' },
]

// Visa guidance for visits to IIT Dharwad, as given on the mobility and
// faculty programme pages.
const VISA_BY_PURPOSE = [
  ['Full-time degree (Masters, PhD)', 'Student visa, or e-Student visa through Study in India'],
  ['Coursework or semester exchange', 'Student visa'],
  ['Research work or thesis', 'Masters by coursework: Student visa. Masters by research and PhD: Research visa'],
  ['Project work or internship', 'UG and PG: Student visa. MS and PhD (research): Research visa. Some Embassies issue internship visas'],
  ['Teaching a GIAN course', 'Business visa, applied for 1 to 2 months before travel'],
  ['VAJRA or SPARC faculty visit', 'Research visa'],
  ['Attending a conference', 'Conference visa (C-1 or C-2) or e-Conference visa'],
]

const MAJOR_CATEGORIES = [
  { title: 'Education and research', items: [['Student Visa', 'for full-time academic study'], ['Research Visa', 'for academic or scientific research'], ['Research Intern Visa', 'for short-term research internships']] },
  { title: 'Business and professional', items: [['Business Visa', 'for meetings, trade, conferences and business activities'], ['Employment Visa', 'for employment with an Indian organisation or institution'], ['Project Visa', 'for foreign nationals working on approved projects'], ['Intern Visa', 'for internships in Indian organisations'], ['Conference Visa', 'for attending approved conferences and seminars']] },
  { title: 'Medical', items: [['Medical Visa', 'for medical treatment in India'], ['Medical Attendant Visa', 'for accompanying a medical patient']] },
  { title: 'Tourist and short-term visits', items: [['Tourist Visa', 'for tourism, sightseeing and visiting friends or relatives'], ['Transit Visa', 'for short transit stays while travelling onward']] },
  { title: 'Cultural, religious and specialised', items: [['Entry Visa (X Visa)', 'for dependents, spouses and special categories'], ['Missionary Visa', 'for missionary or religious work'], ['Mountaineering Visa', 'for mountaineering and trekking in restricted areas'], ['Film Visa', 'for filming and documentary purposes'], ['Journalist Visa', 'for media and journalism activities'], ['Sports Visa', 'for athletes and sports professionals']] },
  { title: 'Diplomatic and official', items: [['Diplomatic Visa', ''], ['Official Visa', ''], ['UN Diplomatic/Official Visa', '']] },
  { title: 'OCI category', items: [['OCI (Overseas Citizen of India)', 'long-term immigration status for eligible persons of Indian origin']] },
]

const STUDENT_CODES = [
  ['S-1', 'Higher education (including South Asian University and Nalanda University), provisional student visa, short-term courses, and student exchange programmes'],
  ['S-2', 'School education in India'],
  ['S-3', 'Yoga, Vedic culture, Indian systems of music and dance, and Buddhist studies'],
  ['S-4', 'Theological studies and missionary students'],
  ['S-5', 'Research scholars, visiting research faculty, research scholars on bilateral exchange programmes, and members of botanical, scientific, anthropological and similar expeditions'],
  ['S-6', 'Internship in India'],
]

const STUDENT_DEPENDENT_CODES = [
  ['S-1X', 'Dependent of a student of regular courses in universities imparting higher education'],
  ['S-3X', 'Dependent of a student of Yoga, Vedic culture, Indian music and dance, or Buddhist studies'],
  ['S-5X', 'Dependent of a research scholar, visiting research faculty or bilateral exchange scholar'],
]

const OTHER_CODE_GROUPS = [
  { title: 'Conference visas', codes: [['C-1', 'Conferences organised by Government authorities'], ['C-2', 'Conferences organised by non-Government authorities']] },
  {
    title: 'Employment visas',
    codes: [['E-1', 'All employment, except intra-company transferees and employment in NGOs'], ['E-2', 'Intra-company transferees'], ['E-3', 'Employment in NGOs'], ['E-4', 'Executing projects in the power and steel sectors']],
    dependents: [['E-1X', 'Dependents of employment visa holders'], ['E-2X', 'Dependents of intra-company transferees'], ['E-3X', 'Dependents of NGO employees'], ['E-4X', 'Dependents of power and steel sector project staff']],
  },
  {
    title: 'Business visas',
    codes: [['B-1', 'Establishing an industrial or business venture, frequent long-term business travel, and investors'], ['B-2', 'All other business activities (other than B-1 and sports persons)'], ['B-3', 'Sports persons and coaches, including commercial sports events in India on contract']],
    dependents: [['B-1X', 'Dependents of B-1 visa holders'], ['B-2X', 'Dependents of B-2 visa holders']],
  },
  {
    title: 'Diplomatic visas',
    codes: [['D-1', 'Diplomat assigned in India (diplomatic passport only)'], ['D-2', 'Diplomat visiting India for an official purpose (diplomatic passport only)'], ['D-3', 'Diplomat assigned to a non-UN international organisation in India'], ['UD-1', 'UN diplomat assigned to India'], ['UD-2', 'UN diplomat visiting India']],
    dependents: [['D-1X', 'Dependent of a D-1 diplomat'], ['D-2X', 'Dependent of a D-2 diplomat'], ['D-3X', 'Dependent of a D-3 diplomat'], ['UD-1X', 'Dependent of a UN diplomat assigned to India'], ['UD-2X', 'Dependent of a UN diplomat visiting India']],
  },
  {
    title: 'Entry visas',
    codes: [['X-Double Entry', 'Short-term double-entry visa for travellers who need to enter India twice. Validity and permitted stay per visit are set by the issuing Mission'], ['X-1', 'Persons of Indian origin, foreign spouses of Indian citizens or PIOs, and their dependent children (excluding valid OCI card holders)'], ['X-2', 'Joining Auroville Foundation, Aurobindo Ashram, Missionaries of Charity, or similar approved organisations'], ['X-Misc', 'Categories specified for X-Misc in the Visa Manual, and purposes not covered by any other category']],
  },
  { title: 'Medical visas', codes: [['MED-1', 'Patients'], ['MED-2', 'Medical attendants']] },
  {
    title: 'Official visas',
    codes: [['O-1', 'Non-diplomatic official assigned to a diplomatic mission in India (official, service or special passport only)'], ['O-1X', 'Dependent of an O-1 official'], ['O-2', 'Non-diplomatic official visiting India for an official purpose'], ['O-2X', 'Dependent of an O-2 official'], ['UO-1', 'UN non-diplomatic official assigned to India'], ['UO-1X', 'Dependent of a UO-1 official'], ['UO-2', 'UN non-diplomatic official visiting India'], ['UO-2X', 'Dependent of a UO-2 official']],
  },
]

const E_VISAS = [
  ['e-Tourist Visa', 'Recreation, sightseeing, casual visits to friends or relatives, and short-term yoga or localised courses (30 days, 1 year or 5 years)'],
  ['e-Business Visa', 'Business meetings, establishing ventures, and trade fairs (valid for 1 year)'],
  ['e-Medical Visa', 'Medical treatment in India, including Indian systems of medicine (valid for 60 days)'],
  ['e-Medical Attendant Visa', 'Accompanying an e-Medical visa holder (up to two attendants per patient)'],
  ['e-Conference Visa', 'Conferences, seminars or workshops organised by Indian ministries, PSUs or private entities; rapid single-entry access'],
  ['e-Ayush Visa', 'Ayush therapies, treatment or wellness programmes'],
  ['e-Ayush Attendant Visa', 'Companions of e-Ayush visa holders'],
  ['e-Student Visa', 'Full-time study (UG, PG, PhD and other academic programmes) in recognised Indian institutions; dependents apply for e-Student-X'],
]

const PROVISIONS = [
  ['Business Visa', '5 years', 'Multiple', 'Documents proving a bonafide purpose (company letter etc.)', 'Yes'],
  ['Employment Visa', '1 year or period of contract', 'Multiple', 'Proof of employment (appointment document), terms and conditions', 'Yes'],
  ['Student / Research Visa', 'Period of course, or 5 years', 'Multiple', 'Proof of admission in an Indian institution', 'Yes'],
  ['Intern Visa', 'Duration of the internship or one year, whichever is less', 'Single, double or multiple', 'Letter from the sponsoring Indian company, institution or NGO stating the internship period', 'No'],
]

const sectionHead = 'text-3xl md:text-[2.25rem] leading-[1.1] font-medium tracking-[-0.01em] text-plum-deep'

function CodeList({ codes }) {
  return (
    <dl className="divide-y divide-mist">
      {codes.map(([code, text]) => (
        <div key={code} className="grid grid-cols-[6.5rem_1fr] gap-4 py-2.5 text-[0.95rem]">
          <dt className="font-semibold text-plum">{code}</dt>
          <dd className="text-body">{text}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function Visa() {
  return (
    <div>
      <HeroSection
        title="Visa & Immigration"
        subtitle="Information for international students and visitors"
        backgroundImage="/institute/Institute5.jpg"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-12 lg:px-8">
        {/* Contents */}
        <nav aria-label="On this page" className="lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--site-header-h,140px)+2rem)]">
            <p className="text-sm font-semibold text-plum-deep">On this page</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:block lg:space-y-0.5 lg:border-l lg:border-mist">
              {CONTENTS.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="block rounded-full px-3 py-1.5 text-sm text-body ring-1 ring-inset ring-mist hover:text-plum-deep lg:-ml-px lg:rounded-none lg:border-l-2 lg:border-transparent lg:py-1.5 lg:pl-4 lg:ring-0 lg:hover:border-saffron">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="min-w-0 space-y-20 lg:col-span-9">
          {/* Overview */}
          <section id="overview" aria-labelledby="overview-h">
            <h2 id="overview-h" className={sectionHead}>Visa and immigration information for international students and visitors</h2>
            <div className="mt-6 prose-copy text-[1.05rem] text-body">
              <p>
                India offers various visa categories for international students, researchers, professionals, visitors, and dependents. Foreign nationals visiting India must ensure that they hold the appropriate visa category corresponding to the purpose of their stay.
              </p>
              <p>
                International visitors are advised to carefully review visa eligibility, duration, registration requirements, and extension procedures before travelling to India.
              </p>
            </div>
          </section>

          {/* Major categories */}
          <section id="categories" aria-labelledby="categories-h">
            <h2 id="categories-h" className={sectionHead}>Major visa categories</h2>
            <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {MAJOR_CATEGORIES.map((group) => (
                <div key={group.title} className="border-t border-mist pt-5">
                  <h3 className="text-xl font-medium text-plum-deep">{group.title}</h3>
                  <ul className="mt-3 space-y-2 text-[0.95rem] text-body">
                    {group.items.map(([name, desc]) => (
                      <li key={name}>
                        <span className="font-semibold text-plum-deep">{name}</span>{desc && ` ${desc}`}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Student & research */}
          <section id="student-research" aria-labelledby="student-research-h">
            <h2 id="student-research-h" className={sectionHead}>Student and research visas</h2>
            <p className="mt-3 max-w-2xl text-lg text-quiet">The categories most often used by international students and scholars.</p>
            <div className="mt-8 rounded-2xl border border-mist bg-white p-6">
              <CodeList codes={STUDENT_CODES} />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-plum-tint p-6">
                <h3 className="text-xl font-medium text-plum-deep">e-Student visa</h3>
                <p className="mt-2 text-[0.95rem] text-body">
                  A digitised category for eligible international students registered on the official Indian government portal. It covers full-time UG, PG and PhD programmes. Dependents can apply for an e-Student-X visa.
                </p>
              </div>
              <div className="rounded-2xl bg-porcelain p-6 ring-1 ring-inset ring-mist">
                <h3 className="text-xl font-medium text-plum-deep">Dependent visas</h3>
                <p className="mt-2 text-[0.95rem] text-body">
                  Issued only for dependents of S-1, S-3 and S-5 visa holders. <strong className="font-semibold text-plum-deep">No dependent visa is granted for other student categories.</strong>
                </p>
                <div className="mt-3"><CodeList codes={STUDENT_DEPENDENT_CODES} /></div>
              </div>
            </div>
          </section>

          {/* Other codes */}
          <section id="other-visas" aria-labelledby="other-visas-h">
            <h2 id="other-visas-h" className={sectionHead}>Other visa codes</h2>
            <p className="mt-3 max-w-2xl text-lg text-quiet">Conference, employment, business, diplomatic, entry, medical and official visas, with their dependent types.</p>
            <div className="mt-8 divide-y divide-mist border-y border-mist">
              {OTHER_CODE_GROUPS.map((group) => (
                <details key={group.title} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-xl font-medium text-plum-deep">{group.title}</h3>
                    <span aria-hidden="true" className="text-2xl leading-none text-saffron-deep transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="pb-6">
                    <CodeList codes={group.codes} />
                    {group.dependents && (
                      <>
                        <p className="mt-5 text-sm font-semibold text-quiet">Dependent visas</p>
                        <CodeList codes={group.dependents} />
                      </>
                    )}
                  </div>
                </details>
              ))}
              <details className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-xl font-medium text-plum-deep">e-Visas</h3>
                  <span aria-hidden="true" className="text-2xl leading-none text-saffron-deep transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="pb-6">
                  <dl className="divide-y divide-mist">
                    {E_VISAS.map(([name, text]) => (
                      <div key={name} className="grid gap-1 py-2.5 text-[0.95rem] sm:grid-cols-[13rem_1fr] sm:gap-4">
                        <dt className="font-semibold text-plum">{name}</dt>
                        <dd className="text-body">{text}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-sm text-quiet">
                    For eligibility, documents, or to apply, visit the official{' '}
                    <a href="https://indianvisaonline.gov.in/evisa/" target="_blank" rel="noopener noreferrer" className="text-plum underline decoration-saffron underline-offset-4">Indian e-Visa portal</a>.
                  </p>
                </div>
              </details>
            </div>
          </section>

          {/* Provisions */}
          <section id="provisions" aria-labelledby="provisions-h">
            <h2 id="provisions-h" className={sectionHead}>Visa provisions and policies</h2>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-mist bg-white">
              <table className="w-full min-w-[44rem] text-left text-[0.95rem]">
                <thead className="bg-plum-deep text-white">
                  <tr>
                    {['Type of visa', 'Period granted', 'Entry', 'Documents required', 'Extendable in India'].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist">
                  {PROVISIONS.map(([type, period, entry, docs, ext]) => (
                    <tr key={type} className="align-top">
                      <th scope="row" className="px-4 py-4 font-semibold text-plum-deep">{type}</th>
                      <td className="px-4 py-4 text-body">{period}</td>
                      <td className="px-4 py-4 text-body">{entry}</td>
                      <td className="px-4 py-4 text-body">{docs}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ext === 'Yes' ? 'bg-plum-tint text-plum' : 'bg-saffron-tint text-saffron-deep'}`}>{ext}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Extension */}
          <section id="extension" aria-labelledby="extension-h">
            <h2 id="extension-h" className={sectionHead}>Visa extension</h2>
            <div className="mt-6 grid gap-8 md:grid-cols-5">
              <div className="md:col-span-3 prose-copy text-[1.05rem] text-body">
                <p>
                  Certain visa types can be extended while you are in India, online through the{' '}
                  <a href="https://indianfrro.gov.in/eservices/" target="_blank" rel="noopener noreferrer" className="text-plum underline decoration-saffron underline-offset-4">e-FRRO portal</a>, subject to approval by FRRO/FRO authorities and Government of India regulations.
                </p>
                <ul className="list-disc space-y-2 pl-5 marker:text-saffron-deep">
                  <li>The International Relations Office assists with extensions on request.</li>
                  <li>The visa extension fee is borne by the foreign national.</li>
                  <li>Documents from the institute are provided by the Academic or International Relations office.</li>
                  <li>It is the applicant's responsibility to apply on time.</li>
                </ul>
              </div>
              <div className="md:col-span-2 self-start rounded-2xl bg-saffron-tint p-6">
                <p className="font-heading! text-4xl text-plum-deep">60 days</p>
                <p className="mt-2 text-body">Request the extension at least 60 days before your visa expires. Failing to comply with visa conditions may result in penalties under applicable laws.</p>
              </div>
            </div>
          </section>

          {/* Immigration */}
          <section id="immigration" aria-labelledby="immigration-h">
            <h2 id="immigration-h" className={sectionHead}>Immigration procedures</h2>
            <div className="mt-6 prose-copy text-[1.05rem] text-body">
              <p>
                The Foreigners Regional Registration Office (FRRO) monitors and regulates foreign nationals in India. <strong className="font-semibold text-plum-deep">Anyone staying in India for more than 180 days must register with the FRRO within 14 days of arrival.</strong>
              </p>
              <p>
                The <a href="https://indianfrro.gov.in/eservices/" target="_blank" rel="noopener noreferrer" className="text-plum underline decoration-saffron underline-offset-4">e-FRRO platform</a> handles registration, visa extension, visa conversion and exit permits online: faceless, cashless and paperless. Create a user ID, apply, and receive your registration permit or certificate by post and email. You visit an FRRO/FRO office only if called for an interview, or in an emergency.
              </p>
            </div>

            {/* What to do after arriving, in order */}
            <ol className="mt-10 grid gap-6 md:grid-cols-2">
              <li className="flex flex-col rounded-2xl border border-mist bg-white p-6">
                <p className="text-sm font-semibold text-saffron-deep">Within 24 hours of arrival</p>
                <h3 className="mt-1 text-2xl font-medium text-plum-deep">C Form: proof of residence</h3>
                <ul className="mt-4 flex-1 list-disc space-y-2 pl-5 text-[0.95rem] text-body marker:text-saffron-deep">
                  <li>Hotels, guest houses, hostels, homestays and hospitals must report foreign guests to the authorities.</li>
                  <li>Fill in the C Form at your hostel or guest house front office, and collect the soft copy once it is submitted on the immigration portal.</li>
                  <li>Required for dependent visa holders too.</li>
                  <li>If you stay off campus, fill it in yourself or ask your landlord or hotel to.</li>
                  <li>Non-compliance attracts fines and other penalties under the Immigration and Foreigners Act, 2025.</li>
                </ul>
                <div className="mt-5 border-t border-mist pt-4 text-sm">
                  <p className="font-semibold text-plum-deep">Documents</p>
                  <p className="mt-1 text-body">Photograph (under 50 KB), passport copy, valid visa</p>
                </div>
              </li>
              <li className="flex flex-col rounded-2xl border border-mist bg-white p-6">
                <p className="text-sm font-semibold text-saffron-deep">On arrival, as directed by the International Relations Office</p>
                <h3 className="mt-1 text-2xl font-medium text-plum-deep">S Form: Foreign Students' Information System</h3>
                <ul className="mt-4 flex-1 list-disc space-y-2 pl-5 text-[0.95rem] text-body marker:text-saffron-deep">
                  <li>FSIS records foreign nationals admitted to Indian educational institutions.</li>
                  <li>Fill in the S Form at the International Relations Office.</li>
                  <li>A number is generated on submission; the office emails you a copy. This is your FSIS number.</li>
                </ul>
                <div className="mt-5 border-t border-mist pt-4 text-sm">
                  <p className="font-semibold text-plum-deep">Documents</p>
                  <p className="mt-1 text-body">Photograph (under 50 KB), passport copy, bonafide certificate or admission proof</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Links */}
          <section id="links" aria-labelledby="links-h">
            <h2 id="links-h" className={sectionHead}>Official government links</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['Indian Visa Online', 'https://indianvisaonline.gov.in/'],
                ['e-FRRO Portal', 'https://indianfrro.gov.in/eservices/'],
                ['Ministry of External Affairs – FRRO Registration Guidelines', 'https://www.mea.gov.in/'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-mist bg-white p-5 font-medium text-plum-deep hover:border-plum/30">
                    {label}
                    <RiExternalLinkLine size={18} aria-label="opens in a new tab" className="mt-0.5 shrink-0 text-saffron-deep" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
