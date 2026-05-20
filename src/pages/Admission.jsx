import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'
import { mockData } from '../data/mockData'

export default function Admission() {
  return (
    <div>
      <HeroSection
        title="International Admission"
        subtitle="Your pathway to world-class education at IITDH"
      />

      {/* About Program */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Why Study at IITDH?"
          subtitle="Excellence in engineering and technology education"
        />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">World-Class Education</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              IITDH offers rigorous academic programs with emphasis on research and innovation. Our faculty are leaders in their respective fields, committed to mentoring the next generation of engineers and scientists.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              With modern infrastructure, collaborative learning environment, and global partnerships, IITDH provides an educational experience that prepares students for international careers.
            </p>
            <CTAButton href="#apply">Apply Now</CTAButton>
          </div>
          <div className="bg-blue-100 rounded-lg aspect-video flex items-center justify-center">
            <p className="text-gray-500">Program Video</p>
          </div>
        </div>
      </section>

      {/* Programs & Facts */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Programs Offered</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-blue-700 mb-2">Undergraduate</p>
                  <ul className="space-y-1 text-sm text-gray-700 ml-4">
                    {mockData.programs.undergraduate.map((prog, idx) => (
                      <li key={idx}>• {prog}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-blue-700 mb-2">Postgraduate</p>
                  <ul className="space-y-1 text-sm text-gray-700 ml-4">
                    {mockData.programs.postgraduate.map((prog, idx) => (
                      <li key={idx}>• {prog}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-blue-700 mb-2">Doctoral</p>
                  <ul className="space-y-1 text-sm text-gray-700 ml-4">
                    {mockData.programs.phd.map((prog, idx) => (
                      <li key={idx}>• {prog}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <div className="text-3xl font-bold text-blue-700 mb-2">50+</div>
                  <p className="text-sm text-gray-700">International MOUs</p>
                </Card>
                <Card>
                  <div className="text-3xl font-bold text-blue-700 mb-2">25+</div>
                  <p className="text-sm text-gray-700">Countries represented</p>
                </Card>
                <Card>
                  <div className="text-3xl font-bold text-blue-700 mb-2">500+</div>
                  <p className="text-sm text-gray-700">Faculty members</p>
                </Card>
                <Card>
                  <div className="text-3xl font-bold text-blue-700 mb-2">10K+</div>
                  <p className="text-sm text-gray-700">Total students</p>
                </Card>
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
        />
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="text-4xl font-bold text-blue-700 mb-3">1</div>
            <h4 className="font-bold text-gray-900 mb-2">Check Eligibility</h4>
            <p className="text-sm text-gray-700">Review requirements for your program</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-blue-700 mb-3">2</div>
            <h4 className="font-bold text-gray-900 mb-2">Prepare Documents</h4>
            <p className="text-sm text-gray-700">Gather transcripts, test scores, and visa docs</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-blue-700 mb-3">3</div>
            <h4 className="font-bold text-gray-900 mb-2">Submit Application</h4>
            <p className="text-sm text-gray-700">Apply through our online portal</p>
          </Card>
          <Card className="text-center">
            <div className="text-4xl font-bold text-blue-700 mb-3">4</div>
            <h4 className="font-bold text-gray-900 mb-2">Receive Decision</h4>
            <p className="text-sm text-gray-700">Get admission decision in 4-6 weeks</p>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Get in Touch"
            subtitle="Questions? Contact our admissions team"
          />
          <Card className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">International Admissions Office</h3>
            <p className="text-gray-700 mb-2"><strong>Contact Person:</strong> Ms. Sneha Patel</p>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:international@iitdh.ac.in" className="text-blue-700 hover:underline">international@iitdh.ac.in</a></p>
            <p className="text-gray-700 mb-4"><strong>Phone:</strong> <a href="tel:+91-8364-241-215" className="text-blue-700 hover:underline">+91-8364-241-215</a></p>
            <CTAButton href="https://admission.iitdh.ac.in" target="_blank" rel="noopener noreferrer">
              Apply Now
            </CTAButton>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Student Testimonials"
          subtitle="Hear from our international students"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {mockData.testimonials.map((testimonial, idx) => (
            <Card key={idx}>
              <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.country}</p>
                <p className="text-sm text-blue-700 font-semibold">{testimonial.program}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions"
          />
          <div className="space-y-6">
            {mockData.faqs.map((faq, idx) => (
              <Card key={idx}>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-700">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
