import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'
import FAQAccordion from '../components/FAQAccordion'
import { mockData } from '../data/mockData'

export default function Admission() {
  return (
    <div>
      <HeroSection
        title="International Admission"
        subtitle="Your pathway to world-class education at IITDH"
        cta={{ label: 'Apply Now', onClick: () => window.location.href = 'https://admission.iitdh.ac.in' }}
      />

      {/* About Program */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Why Study at IITDH?"
          subtitle="Excellence in engineering and technology education"
          badge="🎓"
        />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-[#7F5283] mb-4">World-Class Education</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              IITDH offers rigorous academic programs with emphasis on research and innovation. Our faculty are leaders in their respective fields, committed to mentoring the next generation of engineers and scientists.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              With modern infrastructure, collaborative learning environment, and global partnerships, IITDH provides an educational experience that prepares students for international careers.
            </p>
            <CTAButton label="Apply Now" href="https://admission.iitdh.ac.in" variant="primary" />
          </div>
          <div className="bg-[#FEFBF6] rounded-xl aspect-video flex items-center justify-center border-2 border-[#FEFBF6]">
            <p className="text-gray-400">Program Video</p>
          </div>
        </div>
      </section>

      {/* Programs & Facts */}
      <section className="bg-[#FEFBF6] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-[#7F5283] mb-6">Programs Offered</h3>
              <div className="space-y-4">
                {[
                  { label: 'Undergraduate', programs: mockData.programs.undergraduate },
                  { label: 'Postgraduate', programs: mockData.programs.postgraduate },
                  { label: 'Doctoral', programs: mockData.programs.phd }
                ].map((section, sidx) => (
                  <div key={sidx}>
                    <p className="font-bold text-[#7F5283] mb-2">📚 {section.label}</p>
                    <ul className="space-y-1 text-sm text-gray-700 ml-4">
                      {section.programs.map((prog, idx) => (
                        <li key={idx}>✓ {prog}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#7F5283] mb-6">Key Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '50+', label: 'International MOUs' },
                  { num: '25+', label: 'Countries Represented' },
                  { num: '500+', label: 'Faculty Members' },
                  { num: '10K+', label: 'Total Students' }
                ].map((stat, idx) => (
                  <Card key={idx} variant="light">
                    <div className="text-3xl font-bold text-[#A6D1E6] mb-2">{stat.num}</div>
                    <p className="text-sm text-gray-700">{stat.label}</p>
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
          badge="📋"
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
                <div className="text-4xl font-bold text-[#A6D1E6] mb-3 bg-[#FEFBF6] w-12 h-12 rounded-full flex items-center justify-center mx-auto">{step.num}</div>
                <h4 className="font-bold text-[#7F5283] mb-2">{step.title}</h4>
                <p className="text-sm text-gray-700">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#7F5283] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-100">Questions? Contact our admissions team</p>
          </div>
          <Card variant="accent">
            <h3 className="text-2xl font-bold text-[#2d0a1e] mb-4 text-center">International Admissions Office</h3>
            <div className="space-y-3 text-center mb-6">
              <p className="text-[#2d0a1e]"><strong>Contact Person:</strong> Ms. Sneha Patel</p>
              <p className="text-[#2d0a1e]"><strong>Email:</strong> <a href="mailto:international@iitdh.ac.in" className="font-semibold hover:underline">international@iitdh.ac.in</a></p>
              <p className="text-[#2d0a1e]"><strong>Phone:</strong> <a href="tel:+91-8364-241-215" className="font-semibold hover:underline">+91-8364-241-215</a></p>
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
          badge="⭐"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {mockData.testimonials.map((testimonial, idx) => (
            <Card key={idx} variant="light" border>
              <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
              <div className="border-t border-[#7F5283]/20 pt-4">
                <p className="font-bold text-[#7F5283]">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.country}</p>
                <p className="text-sm text-[#A6D1E6] font-semibold">{testimonial.program}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-[#FEFBF6] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions"
            badge="❓"
          />
          <FAQAccordion items={mockData.faqs} />
        </div>
      </section>
    </div>
  )
}
