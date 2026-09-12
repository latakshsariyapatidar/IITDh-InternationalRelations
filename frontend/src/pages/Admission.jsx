import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'
import FAQAccordion from '../components/FAQAccordion'
import apiClient from '../api/client'
import { RiGraduationCapLine, RiListCheck2, RiChatQuoteLine, RiQuestionAnswerLine } from '@remixicon/react'

export default function Admission() {
  const [faqs, setFaqs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const faqRes = await apiClient.get('/faqs?limit=20')
        setFaqs(faqRes.data?.data?.faqs || [])
      } catch (err) {
        console.error("Failed to load admission data", err)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <HeroSection
        title="International Admissions"
        subtitle="Your pathway to world-class degree education at IIT Dharwad"
        cta={{ label: 'Apply Online for Degree Programs', to: '/international-admissions/apply' }}
      />

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

      <section className="bg-neutral-canvas py-16">
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
