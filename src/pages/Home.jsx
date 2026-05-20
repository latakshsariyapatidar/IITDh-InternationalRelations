import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'

export default function Home() {
  return (
    <div>
      <HeroSection
        title="Welcome to IITDH"
        subtitle="International Relations Office - Building global bridges"
      />

      {/* Director's Message */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Director's Message</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to IIT Dharwad, where we embrace diversity and foster global excellence. Our commitment to international collaboration enriches the academic experience for all our students and faculty.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We invite students and researchers from around the world to be part of our vibrant community and contribute to cutting-edge innovation.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">Director's Photo</p>
          </div>
        </div>
      </section>

      {/* Registrar's Message */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg h-96 flex items-center justify-center order-2 md:order-1">
              <p className="text-gray-500">Registrar's Photo</p>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Registrar's Message</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                IITDH is committed to providing world-class education with strong emphasis on global partnerships and cultural exchange. Our international initiatives aim to prepare students for a connected world.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through strategic collaborations and structured exchange programs, we create pathways for mutual learning and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About IITDH */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="About IITDH"
          subtitle="A premier institution of technological excellence"
        />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="bg-blue-100 rounded-lg aspect-video flex items-center justify-center mb-4">
              <p className="text-gray-500">Intro Video Placeholder</p>
            </div>
            <p className="text-gray-700">Watch our campus introduction video to get a glimpse of student life at IITDH.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Facts</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-blue-700 font-bold">•</span>
                <span className="text-gray-700"><strong>Established:</strong> 2016</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-700 font-bold">•</span>
                <span className="text-gray-700"><strong>Campus:</strong> 500+ acres in scenic Dharwad, Karnataka</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-700 font-bold">•</span>
                <span className="text-gray-700"><strong>Programs:</strong> B.Tech, M.Tech, MS, PhD</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-700 font-bold">•</span>
                <span className="text-gray-700"><strong>International Students:</strong> From 25+ countries</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-700 font-bold">•</span>
                <span className="text-gray-700"><strong>Global Partnerships:</strong> 50+ MoUs with universities worldwide</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Opportunities & Scholarships */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Opportunities & Scholarships"
            subtitle="Explore pathways to study and collaborate globally"
          />

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">For Students</h3>
              <p className="text-gray-700 mb-4">Exchange programs, internships, and study tours worldwide</p>
              <CTAButton to="/collaboration">Learn More</CTAButton>
            </Card>

            <Card>
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">For Faculty</h3>
              <p className="text-gray-700 mb-4">SPARC, VAJRA, GIAN programs for research collaboration</p>
              <CTAButton to="/collaboration">Explore</CTAButton>
            </Card>

            <Card>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scholarships</h3>
              <p className="text-gray-700 mb-4">Merit-based, ICCR, and institutional financial aid</p>
              <CTAButton to="/admission">Apply Now</CTAButton>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
