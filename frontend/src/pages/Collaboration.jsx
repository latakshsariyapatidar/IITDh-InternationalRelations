import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import CTAButton from '../components/ui/CTAButton'
import DetailRows from '../components/ui/DetailRows'
import ProgramTabs from '../components/ui/ProgramTabs'
import OpportunitiesBoard from '../components/OpportunitiesBoard'
import { RiArrowRightLine } from '@remixicon/react'

// ── Inbound exchange programmes (International Collaboration & Mobility) ──

const MOU_TERMS = (activity, tuitionNote) => (
  <>
    <p>
      Foreign nationals registered for a degree at a recognised university, institute or college, and officially sponsored by it to carry out {activity} at IIT Dharwad for no more than two semesters (one year), can be accepted under the MoU or non-MoU category.
    </p>
    <p>
      Admission under an MoU follows the terms agreed between IIT Dharwad and the partner institution. Students bear their own living, boarding, lodging and travel costs. Accommodation is provided in the campus hostels on a payment basis. {tuitionNote}
    </p>
    <p>Students under the non-MoU category pay the tuition fee per semester as per IIT Dharwad rules and regulations.</p>
  </>
)

const BASE_DOCUMENTS = [
  'Photo (less than 50 KB)',
  'Passport with at least 6 months validity',
  'Curriculum vitae',
  'University transcripts',
  'Nomination letter from the home institute naming the department the student would like to join',
]

const procedure = (extraDocument) => (
  <>
    <p>Fill in the <Link to="/international-mobility/apply">application form</Link> and email the documents below.</p>
    <ul>
      {BASE_DOCUMENTS.map((d) => <li key={d}>{d}</li>)}
      {extraDocument && <li>{extraDocument}</li>}
    </ul>
  </>
)

const supervisorEligibility = (activity) => (
  <p>
    Identify an IIT Dharwad faculty member you would like to work with and ask them to supervise your {activity}, with a recommendation from your advisor at home. The International Relations Office can also help you find a supervisor.
  </p>
)

const rollingDeadline = (activity) => (
  <>
    <p>There is no deadline: {activity} applications are accepted at any time of the year.</p>
    <p>If coursework is part of the visit, start with the semester: the Fall semester begins in the last week of July, the Spring semester in the first week of January.</p>
  </>
)

const faqList = (items) => (
  <div className="space-y-4">
    {items.map(([q, a]) => (
      <div key={q}>
        <p className="font-semibold text-plum-deep">{q}</p>
        <p className="mt-1">{a}</p>
      </div>
    ))}
  </div>
)

const INBOUND_PROGRAMS = [
  {
    id: 'coursework',
    label: 'Coursework or semester exchange',
    meta: 'Up to two semesters',
    rows: [
      { label: 'About the programme', content: MOU_TERMS('coursework', 'Students arriving under an MoU are not charged tuition fees.') },
      {
        label: 'Eligibility',
        content: (
          <ul>
            <li>Registered for a UG or PG programme at a recognised foreign institute or university</li>
            <li>Nominated or recommended by that university, for both MoU and non-MoU categories</li>
            <li>A good knowledge of English</li>
          </ul>
        ),
      },
      { label: 'Application procedure', content: procedure() },
      {
        label: 'Application deadline',
        content: (
          <ul>
            <li>Fall semester (July to November): 15 May every year</li>
            <li>Spring semester (January to April): 15 October every year</li>
          </ul>
        ),
      },
      {
        label: 'FAQs',
        content: faqList([
          ['What type of visa should I apply for?', 'A Student visa, for all coursework students.'],
          ['Can I do my exchange in my first year?', 'Undergraduates should have completed at least 3 to 4 semesters at their home institution; postgraduates at least one semester.'],
          ['Can I take courses across different departments?', 'Yes, at any IIT Dharwad department, if your home institution advisor approves.'],
          ['Is there a minimum attendance requirement?', 'Yes, a minimum of 80% attendance.'],
        ]),
      },
    ],
  },
  {
    id: 'research',
    label: 'Research work or thesis',
    meta: 'Apply any time',
    rows: [
      { label: 'About the programme', content: MOU_TERMS('research work, or use a laboratory or other facilities,', 'Students arriving under an MoU are not charged tuition fees for any coursework during their visit.') },
      {
        label: 'Eligibility',
        content: (
          <>
            <ul>
              <li>Registered for a Masters or PhD programme at a recognised foreign institute or university</li>
              <li>Nominated or recommended by that university, for both MoU and non-MoU categories</li>
              <li>A good knowledge of English</li>
            </ul>
            {supervisorEligibility('research work')}
          </>
        ),
      },
      { label: 'Application procedure', content: procedure('Acceptance letter from an IIT Dharwad professor willing to guide the research') },
      { label: 'Application deadline', content: rollingDeadline('research work') },
      {
        label: 'FAQs',
        content: faqList([
          ['What kind of visa should I apply for?', "Masters by coursework students apply for a Student visa. Masters by research and PhD students apply for a Research visa."],
          ['Can an undergraduate do research work?', 'Yes, undergraduates can apply for research work.'],
        ]),
      },
    ],
  },
  {
    id: 'project',
    label: 'Project work or fieldwork',
    meta: 'Apply any time',
    rows: [
      { label: 'About the programme', content: MOU_TERMS('project work, or use a laboratory or other facilities,', 'Students arriving under an MoU are not charged tuition fees.') },
      {
        label: 'Eligibility',
        content: (
          <>
            <ul>
              <li>Registered for a UG, PG or PhD programme at a recognised foreign institute or university</li>
              <li>Nominated or recommended by that university, for both MoU and non-MoU categories</li>
              <li>A good knowledge of English</li>
            </ul>
            {supervisorEligibility('project work')}
          </>
        ),
      },
      { label: 'Application procedure', content: procedure('Acceptance letter from an IIT Dharwad professor willing to guide the project') },
      { label: 'Application deadline', content: rollingDeadline('project work') },
      {
        label: 'FAQs',
        content: faqList([
          ['What kind of visa should I apply for?', 'UG and PG students apply for a Student visa; MS and PhD (research) students apply for a Research visa.'],
          ['Can an undergraduate do project work?', 'Yes, undergraduates can apply for project work.'],
          ['Is coursework compulsory for project work?', "No. It depends on your IIT Dharwad guide's recommendation; if they suggest a few courses, you can register for them."],
        ]),
      },
    ],
  },
  {
    id: 'internship',
    label: 'Research internship',
    meta: 'Apply any time',
    rows: [
      { label: 'About the programme', content: MOU_TERMS('an internship, or use a laboratory or other facilities,', 'Students arriving under an MoU are not charged tuition fees.') },
      {
        label: 'Eligibility',
        content: (
          <>
            <ul>
              <li>Registered for a UG, PG or PhD programme at a recognised foreign university, institute or college</li>
              <li>Nominated or recommended by that university, for both MoU and non-MoU categories</li>
              <li>A good knowledge of English</li>
            </ul>
            {supervisorEligibility('internship')}
          </>
        ),
      },
      { label: 'Application procedure', content: procedure('Acceptance letter from an IIT Dharwad professor willing to guide the internship') },
      { label: 'Application deadline', content: rollingDeadline('internship') },
      {
        label: 'FAQs',
        content: faqList([
          ['What kind of visa should I apply for?', 'UG and PG students apply for a Student visa; MS and PhD (research) students apply for a Research visa. In a few cases, Embassies may issue internship visas.'],
          ['Can an undergraduate do an internship?', 'Yes, undergraduates can apply for an internship.'],
        ]),
      },
    ],
  },
]

// ── International faculty inbound programmes ──

const FACULTY_PROGRAMS = [
  {
    id: 'gian',
    label: 'GIAN',
    meta: 'Short intensive courses, 1–3 weeks',
    title: 'Global Initiative of Academic Networks',
    rows: [
      {
        label: 'About the programme',
        content: (
          <>
            <p>
              GIAN is a flagship programme of the Ministry of Education, Government of India, that brings distinguished international faculty and experts to teach and research at Indian institutions. Internationally renowned academicians, researchers, scientists and industry experts offer short-term, intensive courses, typically of one to three weeks.
            </p>
            <p>It also promotes long-term collaboration, joint research, curriculum development and faculty networking between IIT Dharwad and leading institutions worldwide.</p>
          </>
        ),
      },
      {
        label: 'Duration and funding',
        content: (
          <>
            <p>Courses run for one to three weeks depending on the subject; the host institution and visiting faculty agree the exact duration.</p>
            <p>A lump sum of up to <strong className="font-semibold text-plum-deep">USD 8,000</strong> for 12 to 14 contact hours, or up to <strong className="font-semibold text-plum-deep">USD 12,000</strong> for 20 to 28 contact hours, covers travel and honorarium. The host institution arranges local hospitality.</p>
          </>
        ),
      },
      { label: 'Visa type', content: <p>Business visa, applied for at least one month (preferably two months) before departure.</p> },
      {
        label: 'More information',
        content: (
          <p>
            <a href="https://gian.iitkgp.ac.in/" target="_blank" rel="noopener noreferrer">gian.iitkgp.ac.in</a>. National Coordinator, GIAN, IIT Kharagpur, West Bengal 721302;{' '}
            <a href="mailto:gian@iitkgp.ac.in">gian@iitkgp.ac.in</a>
          </p>
        ),
      },
    ],
  },
  {
    id: 'vajra',
    label: 'VAJRA',
    meta: 'Adjunct faculty, 1–3 months a year',
    title: 'Visiting Advanced Joint Research Faculty Scheme',
    rows: [
      {
        label: 'About the programme',
        content: (
          <p>
            A SERB programme for overseas scientists and academicians, with emphasis on Non-Resident Indians (NRI) and Persons of Indian Origin (PIO) or Overseas Citizens of India (OCI), to work as adjunct or visiting faculty in Indian publicly funded academic and research institutions, taking up research problems in the Indian setting.
          </p>
        ),
      },
      {
        label: 'Duration and funding',
        content: (
          <>
            <p>A minimum of one month and a maximum of three months a year. The adjunct position is offered for one year at first, renewable every year.</p>
            <p>
              <strong className="font-semibold text-plum-deep">USD 15,000</strong> in the first month of engagement in a year and <strong className="font-semibold text-plum-deep">USD 10,000</strong> per month for the other two months, covering travel and honorarium, paid in Indian rupees. No separate support is provided for accommodation or insurance; the host institute may consider it.
            </p>
          </>
        ),
      },
      {
        label: 'Visa type',
        content: <p>Research visa. Stays of up to 3 months at a time need no FRRO registration; engagements beyond 180 days may fall under the Employment visa regime.</p>,
      },
      {
        label: 'More information',
        content: (
          <p>
            <a href="https://www.vajra-india.in/" target="_blank" rel="noopener noreferrer">vajra-india.in</a>. Dr. Praveenkumar S, Programme Coordinator; 011 2659 0353;{' '}
            <a href="mailto:praveen@nic.in">praveen@nic.in</a>
          </p>
        ),
      },
    ],
  },
  {
    id: 'sparc',
    label: 'SPARC',
    meta: 'Two-year joint projects',
    title: 'Scheme for Promotion of Academic and Research Collaboration',
    rows: [
      {
        label: 'About the programme',
        content: (
          <>
            <p>
              SPARC improves the research ecosystem of India's higher education institutions through collaboration with the best institutions in 28 selected nations, to jointly solve problems of national or international relevance. It supports:
            </p>
            <ul>
              <li>Visits and long-term stays of top international faculty and researchers in Indian institutions</li>
              <li>Visits by Indian students for training and experiments in premier laboratories worldwide</li>
              <li>Joint development of niche courses, books and monographs, patents, technologies and products</li>
              <li>Bilateral cooperation through Indo-X workshops in India, and an annual international conference</li>
            </ul>
          </>
        ),
      },
      {
        label: 'Duration and funding',
        content: (
          <>
            <p>Proposals run for two years, in one of three budget baskets: up to ₹50 lakh; ₹50 to 75 lakh; or ₹75 lakh to ₹1 crore. Proposals with longer foreign faculty visits are given priority for the larger baskets.</p>
            <ul>
              <li>Foreign faculty visiting for 1 to 4 months: up to USD 15,000 for the first month and USD 10,000 thereafter, including honorarium, travel and stay</li>
              <li>Foreign post-doctoral or doctoral scholars: free accommodation and ₹12,000 a month (up to ₹2 lakh over the project), for a stay of at least 3 months as a registered visiting student, with tuition waived</li>
              <li>Indian students visiting the foreign institution: up to USD 2,000 for travel and USD 1,000 a month</li>
            </ul>
          </>
        ),
      },
      { label: 'Visa type', content: <p>Research visa.</p> },
      {
        label: 'More information',
        content: (
          <p>
            <a href="https://sparc.iitkgp.ac.in" target="_blank" rel="noopener noreferrer">sparc.iitkgp.ac.in</a>. SPARC Cell, IIT Kharagpur, West Bengal 721302;{' '}
            <a href="mailto:support@sparc.iitkgp.ac.in">support@sparc.iitkgp.ac.in</a>
          </p>
        ),
      },
    ],
  },
]

// ── Outbound: IITDH students and faculty ──

const STUDENTS_ABROAD = [
  { title: 'Undergraduate exchange', desc: 'Study abroad during 3rd or 4th year at partner universities worldwide.', info: 'Eligibility: CGPA ≥ 7.0' },
  { title: 'Dual degree programmes', desc: 'Earn dual degrees from IITDH and international partner institutions.', info: 'Duration: 4–5 years' },
  { title: 'Postgraduate exchange', desc: 'Research internships and thesis work at leading universities globally.', info: 'For M.Tech and PhD students' },
  { title: 'Summer internships', desc: 'Industry and research internships with companies and institutions abroad.', info: 'Typically 2 months in summer' },
  { title: 'Immersion programmes', desc: 'Short-term cultural and technical learning programmes in partner countries.', info: 'Duration: 2–4 weeks' },
  { title: 'PhD abroad', desc: 'Pursue a PhD at international universities with IITDH faculty collaboration.', info: 'Joint degree options available' },
]

const FACULTY_FUNDING = [
  { title: 'Government schemes', items: ['SPARC Program', 'VAJRA Scheme', 'GIAN Initiative', 'SERB Programs', 'DST-FIST'] },
  { title: 'University partnerships', items: ['Research collaboration funds', 'Faculty exchange grants', 'Joint publications support', 'Dual appointment programs', 'Sabbatical positions'] },
  { title: 'Internal support', items: ['Travel grants', 'Collaborative research funds', 'Visiting scholar support', 'Conference presentation aid', 'Publication grants'] },
]

export default function Collaboration() {
  const inboundTabs = INBOUND_PROGRAMS.map((p) => ({
    id: p.id,
    label: p.label,
    meta: p.meta,
    content: (
      <>
        <h3 className="text-2xl md:text-3xl font-medium text-plum-deep">{p.label}</h3>
        <DetailRows rows={p.rows} className="mt-6" />
        <div className="mt-8 flex flex-wrap gap-3">
          <CTAButton label="Apply for inbound exchange" to="/international-mobility/apply" />
        </div>
      </>
    ),
  }))

  const facultyTabs = FACULTY_PROGRAMS.map((p) => ({
    id: p.id,
    label: p.label,
    meta: p.meta,
    content: (
      <>
        <h3 className="text-2xl md:text-3xl font-medium text-plum-deep">{p.title} <span className="text-quiet">({p.label})</span></h3>
        <DetailRows rows={p.rows} className="mt-6" />
      </>
    ),
  }))

  return (
    <div>
      <HeroSection
        title="International Mobility"
        subtitle="Global opportunities for students, faculty, and institutions"
        backgroundImage="/institute/Institute3.jpg"
        cta={{ label: 'Inbound Exchange — Apply Here', to: '/international-mobility/apply' }}
        secondButton={{ label: 'Browse opportunities', onClick: () => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' }) }}
      />

      {/* Inbound exchange programmes */}
      <section id="inbound" className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Inbound exchange programmes"
            subtitle="For international students registered at a university abroad, visiting IIT Dharwad for up to two semesters without taking a degree here."
          />
          <ProgramTabs items={inboundTabs} label="Inbound exchange programmes" />

          {/* Moved here from International Admissions: exchange students
              apply from the page that describes the programmes. */}
          <Link
            to="/international-mobility/apply"
            className="group mt-12 flex flex-col justify-between gap-6 rounded-2xl bg-plum p-8 text-white transition-colors hover:bg-plum-deep md:flex-row md:items-center"
          >
            <div className="max-w-2xl">
              <h3 className="text-2xl font-medium">Inbound exchange — apply here</h3>
              <p className="mt-3 text-white/75 leading-relaxed">
                For international students visiting for a <strong className="font-semibold text-white">semester exchange, research internship, summer program, or visiting student</strong> status.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-saffron">
              Apply for inbound exchange <RiArrowRightLine size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* International faculty inbound programmes */}
      <section id="faculty-programs" className="bg-white border-y border-mist py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="International faculty programmes"
            subtitle="Government of India schemes that bring international faculty and researchers to IIT Dharwad to teach and collaborate."
          />
          <ProgramTabs items={facultyTabs} label="International faculty programmes" />
        </div>
      </section>

      {/* IITDH Students Abroad */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="IITDH students: opportunities abroad"
            subtitle="Exchange and learning programmes for our students"
          />
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-mist bg-mist sm:grid-cols-2 lg:grid-cols-3">
            {STUDENTS_ABROAD.map((prog) => (
              <li key={prog.title} className="flex flex-col bg-white p-6">
                <h3 className="text-xl font-medium text-plum-deep">{prog.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-body">{prog.desc}</p>
                <p className="mt-4 text-sm font-medium text-saffron-deep">{prog.info}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <CTAButton label="IITDh Student Portal" to="/students" variant="secondary" />
          </div>
        </div>
      </section>

      {/* Opportunities: scholarships, fellowships, exchanges and grants */}
      <OpportunitiesBoard />

      {/* Faculty Funding */}
      <section className="bg-plum-deep text-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tone="dark"
            title="IITDH faculty: international funding"
            subtitle="Government and institutional resources for collaboration"
          />
          <div className="grid gap-10 md:grid-cols-3">
            {FACULTY_FUNDING.map((group) => (
              <div key={group.title} className="border-t border-white/15 pt-6">
                <h3 className="text-xl font-medium">{group.title}</h3>
                <ul className="mt-4 space-y-2 text-white/75">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* Current calls for IITDH faculty */}
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl bg-white/5 p-7 ring-1 ring-inset ring-white/10">
              <h3 className="text-xl font-medium">India–Japan Cooperative Science Programme (IJCSP)</h3>
              <p className="mt-3 text-white/75 leading-relaxed">
                DST and the Japan Society for the Promotion of Science (JSPS) invite proposals for joint research projects and joint workshops and seminars, in physical, chemical, life, mathematical, earth and materials sciences. Open to eligible Indian researchers and scientists.
              </p>
              <p className="mt-2 text-sm text-saffron/90 font-medium">
                Last date for proposal submission: 3rd September (annual call)
              </p>
              <a href="https://www.onlinedst.gov.in" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-saffron underline decoration-saffron/50 underline-offset-4 hover:decoration-saffron">
                Details and applications on onlinedst.gov.in
              </a>
            </article>
            <article className="rounded-2xl bg-white/5 p-7 ring-1 ring-inset ring-white/10">
              <h3 className="text-xl font-medium">Finnish Indian Consortia for Research and Education (FICORE)</h3>
              <p className="mt-3 text-white/75 leading-relaxed">
                A network of 23 IITs and 15 Finnish higher education institutions. See the funding landscape for India collaboration in EU, Finnish and Indian contexts.
              </p>
              <a href="https://www.aalto.fi/en/events/funding-landscape-for-india-collaboration-eu-finland-and-india-contexts" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-semibold text-saffron underline decoration-saffron/50 underline-offset-4 hover:decoration-saffron">
                Funding landscape for India collaboration
              </a>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
