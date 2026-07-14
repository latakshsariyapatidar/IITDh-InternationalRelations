import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'
import FAQAccordion from '../components/FAQAccordion'
import apiClient from '../api/client'
import { RiGraduationCapLine, RiListCheck2, RiChatQuoteLine, RiQuestionAnswerLine } from '@remixicon/react'
import { useSiteContent } from '../contexts/SiteContentContext'

export default function Admission() {
  const { getContent } = useSiteContent()
  const [programs, setPrograms] = useState({ undergraduate: [], postgraduate: [], phd: [] })
  const [testimonials, setTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, testRes, faqRes] = await Promise.all([
          apiClient.get('/programs?limit=100'),
          apiClient.get('/testimonials?limit=10'),
          apiClient.get('/faqs?limit=20')
        ])
        
        const allProg = progRes.data?.data?.programs || []
        setPrograms({
          undergraduate: allProg.filter(p => p.level === 'UNDERGRADUATE').map(p => p.name),
          postgraduate: allProg.filter(p => p.level === 'POSTGRADUATE').map(p => p.name),
          phd: allProg.filter(p => p.level === 'PHD').map(p => p.name),
        })
        
        setTestimonials(testRes.data?.data?.testimonials || [])
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
        subtitle="Your pathway to world-class education at IITDH"
        cta={{ label: 'Apply Now', onClick: () => window.location.href = 'https://admission.iitdh.ac.in' }}
      />

      {/* About Program */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Why Study at IITDH?"
          subtitle="Excellence in engineering and technology education"
          badge={<RiGraduationCapLine size={24} />}
        />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-brand-purple mb-4">World-Class Education</h3>
            <p className="text-neutral-textDark/80 leading-relaxed mb-4">
              IITDH offers rigorous academic programs with emphasis on research and innovation. Our faculty are leaders in their respective fields, committed to mentoring the next generation of engineers and scientists.
            </p>
            <p className="text-neutral-textDark/80 leading-relaxed mb-6">
              With modern infrastructure, collaborative learning environment, and global partnerships, IITDH provides an educational experience that prepares students for international careers.
            </p>
            <CTAButton label="Apply Now" href="https://admission.iitdh.ac.in" variant="primary" />
          </div>
          <div className="bg-white rounded-xl aspect-video flex items-center justify-center border border-brand-purpleLight/70">
            <p className="text-neutral-textDark/60">Program Video</p>
          </div>
        </div>
      </section>

      {/* Programs & Facts */}
      <section id="faqs" className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-brand-purple mb-6">Programs Offered</h3>
              <div className="space-y-4">
                {[
                  { label: 'Undergraduate', programs: programs.undergraduate },
                  { label: 'Postgraduate', programs: programs.postgraduate },
                  { label: 'Doctoral', programs: programs.phd }
                ].map((section, sidx) => (
                  <div key={sidx}>
                    <p className="font-bold text-brand-purple mb-2">{section.label}</p>
                    <ul className="space-y-1 text-sm text-neutral-textDark/80 ml-4">
                      {section.programs.map((prog, idx) => (
                        <li key={idx}>✓ {prog}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-purple mb-6">Key Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: getContent("admission.facts.mous", "50+"), label: 'International MOUs' },
                  { num: getContent("admission.facts.countries", "25+"), label: 'Countries Represented' },
                  { num: getContent("admission.facts.faculty", "500+"), label: 'Faculty Members' },
                  { num: getContent("admission.facts.students", "10K+"), label: 'Total Students' }
                ].map((stat, idx) => (
                  <Card key={idx} variant="light">
                    <div className="text-3xl font-bold text-brand-marigold mb-2">{stat.num}</div>
                    <p className="text-sm text-neutral-textDark/80">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="How to Apply"
          subtitle="Simple and transparent admission process"
          badge={<RiListCheck2 size={24} />}
        />
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { num: '1', title: 'Check Eligibility', desc: 'Review requirements for your program' },
            { num: '2', title: 'Prepare Documents', desc: 'Gather transcripts, test scores, and visa docs' },
            { num: '3', title: 'Submit Application', desc: 'Apply through our online portal' },
            { num: '4', title: 'Receive Decision', desc: 'Get admission decision in 4-6 weeks' }
          ].map((step, idx) => (
            <Card key={idx} variant="default">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-marigold mb-3 bg-neutral-canvas w-12 h-12 rounded-full flex items-center justify-center mx-auto">{step.num}</div>
                <h4 className="font-bold text-brand-purple mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-textDark/80">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-brand-purple py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-neutral-canvas">Questions? Contact our admissions team</p>
          </div>
          <Card variant="white">
            <h3 className="text-2xl font-bold text-neutral-textDark mb-4 text-center">International Admissions Office</h3>
            <div className="space-y-3 text-center mb-6">
              <p className="text-neutral-textDark"><strong>Contact Person:</strong> Ms. Sneha Patel</p>
              <p className="text-neutral-textDark"><strong>Email:</strong> <a href="mailto:international@iitdh.ac.in" className="font-semibold hover:underline">international@iitdh.ac.in</a></p>
              <p className="text-neutral-textDark"><strong>Phone:</strong> <a href="tel:+91-8364-241-215" className="font-semibold hover:underline">+91-8364-241-215</a></p>
            </div>
            <div className="text-center">
              <CTAButton label="Apply Now" href="https://admission.iitdh.ac.in" variant="secondary" size="lg" />
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Student Testimonials"
          subtitle="Hear from our international students"
          badge={<RiChatQuoteLine size={24} />}
        />
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} variant="light" border>
              <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
              <div className="border-t border-brand-purpleLight/70 pt-4">
                <p className="font-bold text-brand-purpleDark">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.country}</p>
                <p className="text-sm text-brand-marigold font-semibold">{testimonial.program}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs */}
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
