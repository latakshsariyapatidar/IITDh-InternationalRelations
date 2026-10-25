import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'
import FAQAccordion from '../components/FAQAccordion'
import apiClient from '../api/client'
import { RiGraduationCapLine, RiListCheck2, RiChatQuoteLine, RiQuestionAnswerLine, RiBookOpenLine, RiExchangeFundsLine, RiArrowRightLine } from '@remixicon/react'

export default function Admission() {
  const [faqs, setFaqs] = useState([])
  const [programs, setPrograms] = useState([])
  const [loadingPrograms, setLoadingPrograms] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const faqRes = await apiClient.get('/faqs?limit=100&isActive=true')
        setFaqs(faqRes.data?.data?.faqs || [])
      } catch (err) {
        console.error("Failed to load admission faqs", err)
      }
    }
    const fetchPrograms = async () => {
      try {
        const progRes = await apiClient.get('/programs?limit=100&isActive=true')
        setPrograms(progRes.data?.data?.programs || [])
      } catch (err) {
        console.error("Failed to load programs", err)
      } finally {
        setLoadingPrograms(false)
      }
    }
    fetchData()
    fetchPrograms()
  }, [])

  const programsByLevel = {
    UNDERGRADUATE: programs.filter(p => p.level === 'UNDERGRADUATE'),
    POSTGRADUATE: programs.filter(p => p.level === 'POSTGRADUATE'),
    PHD: programs.filter(p => p.level === 'PHD'),
  }

  return (
    <div>
      <HeroSection
        title="International Admissions"
        subtitle="Your pathway to world-class degree education at IIT Dharwad"
        backgroundImage="/institute/Institute2.jpg"
        cta={{ label: 'Apply Online for Degree Programs', to: '/international-admissions/apply' }}
        secondButton={{ label: 'Inbound Exchange — Apply Here', to: '/international-mobility/apply' }}
      />

      {/* Which application is for me? Block */}
      <section className="bg-brand-purple/5 border-y border-brand-purple/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full">
              Guide
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">Which application is for me?</h2>
            <p className="text-gray-600 text-sm mt-1">Select the correct application route based on your intended period and type of study.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-brand-purple transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-3 text-brand-purple">
                  <RiGraduationCapLine size={28} />
                  <h3 className="text-lg font-bold text-gray-900">Full-Time Degree Programs</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  For international applicants seeking a full-time graduating degree: <strong>B.Tech, M.Tech, M.Sc, MS, or Ph.D.</strong> at IIT Dharwad.
                </p>
              </div>
              <Link
                to="/international-admissions/apply"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purpleDark transition-colors"
              >
                Apply for Degree Program <RiArrowRightLine size={16} />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-brand-marigold transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-3 text-brand-marigold">
                  <RiExchangeFundsLine size={28} />
                  <h3 className="text-lg font-bold text-gray-900">Inbound Exchange & Mobility</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  For international students visiting for a <strong>semester exchange, research internship, summer program, or visiting student</strong> status.
                </p>
              </div>
              <Link
                to="/international-mobility/apply"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Apply for Inbound Exchange <RiArrowRightLine size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="STUDY IN INDIA Applications"
          subtitle="Apply via the Study in India portal"
          badge={<RiGraduationCapLine size={24} />}
        />
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">About the Program</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Study in India (SII) is the flagship international education initiative of the Ministry of Education (MoE), Government of India. The programme is open to students from across the globe, with strong participation from South Asia (SAARC), Africa, Southeast Asia, Central Asia, and the Middle East.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm mt-3">
              The Study in India portal serves as a comprehensive single-window platform for international students to explore programs, submit applications, and receive admission offers.
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Application Details</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li><strong>Eligibility:</strong> The medium of instruction is English. Candidates must have a functional knowledge of English (read, write, understand, and speak). Qualification as per IIT Dharwad rules.</li>
              <li><strong>Application Procedure:</strong> Apply through the <a href="https://www.studyinindia.gov.in/admission/Registrations" className="text-brand-purple hover:underline" target="_blank" rel="noopener noreferrer">Study in India portal</a>.</li>
              <li><strong>Funding Details:</strong> The selected applicant has to pay fees as per IIT Dharwad fee structure.</li>
              <li><strong>Application Deadline:</strong> Please visit the SII website.</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Self-Financed Applications"
            subtitle="Apply directly through the International Relations Office"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Program Details</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-4">
                International students who want to pursue a full time Masters can go through IIT Dharwad Departments and Programs offered and apply through the International Relations Office.
              </p>
              <h4 className="font-bold text-brand-purple mb-2">Eligibility</h4>
              <ul className="space-y-2 text-sm text-gray-700 mb-4 list-disc pl-5">
                <li>For Masters by Technology (MTech): Bachelor’s degree in relevant area</li>
                <li>For Masters by Science (MSc): Bachelor’s degree in relevant area</li>
                <li>Functional knowledge of English is required.</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Application Procedure</h3>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>1. Interested students can apply directly through our online application portal or submit their application package to the International Relations Office.</li>
                <li>2. Shortlisted candidates will be called for an interview.</li>
                <li>3. Admission is subject to the recommendations by the selection committee.</li>
              </ul>
              <div className="mb-4">
                <CTAButton label="Submit Online Application" to="/international-admissions/apply" variant="primary" size="sm" />
              </div>
              <div className="bg-brand-purpleLight/30 p-4 rounded-lg mt-4">
                <p className="font-semibold text-brand-purpleDark text-sm mb-2">Documents to be submitted (as single PDF):</p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  <li>Grade cards (10th, 12th and UG)</li>
                  <li>Statement of Purpose (SOP)</li>
                  <li>Recommendation by two members</li>
                  <li>Work experience / Publications (If any)</li>
                  <li>Passport copy/ID card (in case of Nepal and Bhutan citizens)</li>
                  <li>Passport photo</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Embassies & Funding"
          subtitle="Additional avenues for admission"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Embassies</h3>
            <p className="text-gray-700 leading-relaxed text-sm mb-4">
              International students who want to pursue a full time Masters or PhD program can apply through their respective Embassies for the International Relations Office at IIT Dharwad.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Procedure & Funding:</strong> As per your Embassy guidelines.</li>
              <li><strong>Deadlines:</strong> As per your Embassy guidelines.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Fee Structure (2026-2027)</h3>
            <p className="text-gray-700 leading-relaxed text-sm mb-4">
              <strong>Application processing fee:</strong> 10 USD<br/>
              <strong>Institute Fees:</strong> To be decided (for MS/PhD and M.Tech/M.Sc)<br/>
              <strong>International relations fees (after admission):</strong> 100 USD
            </p>
            <div className="bg-brand-marigold/20 p-4 rounded-lg">
              <p className="text-sm font-semibold text-brand-purpleDark">Financial Assistance</p>
              <p className="text-sm text-gray-700 mt-1">
                Meritorious self-financed students can apply for financial assistance/fee waiver specifying a valid reason. The institute will decide the level of scholarship that can be given.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Programs Catalogue (3.10) */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Academic Programs Catalogue"
          subtitle="Explore academic degree offerings open to international candidates"
          badge={<RiBookOpenLine size={24} />}
        />
        {loadingPrograms ? (
          <div className="text-center py-8 text-gray-500">Loading programs catalogue...</div>
        ) : programs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No programs listed currently.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Undergraduate */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <h3 className="font-bold text-gray-900 text-lg">Undergraduate</h3>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {programsByLevel.UNDERGRADUATE.length}
                </span>
              </div>
              {programsByLevel.UNDERGRADUATE.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No undergraduate programs listed.</p>
              ) : (
                <ul className="space-y-3">
                  {programsByLevel.UNDERGRADUATE.map((p) => (
                    <li key={p.id}>
                      <a
                        href={p.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-800 hover:text-brand-purple flex items-center justify-between group"
                      >
                        <span>{p.name}</span>
                        <RiArrowRightLine size={16} className="text-gray-400 group-hover:text-brand-purple shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Postgraduate */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <h3 className="font-bold text-gray-900 text-lg">Postgraduate</h3>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  {programsByLevel.POSTGRADUATE.length}
                </span>
              </div>
              {programsByLevel.POSTGRADUATE.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No postgraduate programs listed.</p>
              ) : (
                <ul className="space-y-3">
                  {programsByLevel.POSTGRADUATE.map((p) => (
                    <li key={p.id}>
                      <a
                        href={p.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-800 hover:text-brand-purple flex items-center justify-between group"
                      >
                        <span>{p.name}</span>
                        <RiArrowRightLine size={16} className="text-gray-400 group-hover:text-brand-purple shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* PhD */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="font-bold text-gray-900 text-lg">Doctoral (Ph.D.)</h3>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                  {programsByLevel.PHD.length}
                </span>
              </div>
              {programsByLevel.PHD.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No doctoral programs listed.</p>
              ) : (
                <ul className="space-y-3">
                  {programsByLevel.PHD.map((p) => (
                    <li key={p.id}>
                      <a
                        href={p.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-800 hover:text-brand-purple flex items-center justify-between group"
                      >
                        <span>{p.name}</span>
                        <RiArrowRightLine size={16} className="text-gray-400 group-hover:text-brand-purple shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>

      <section id="faqs" className="bg-neutral-canvas py-16">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions"
            badge={<RiQuestionAnswerLine size={24} />}
          />
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </div>
  )
}
