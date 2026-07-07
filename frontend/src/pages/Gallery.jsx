import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'

export default function Gallery() {
  const galleryItems = [
    'Campus Entrance', 'Library Building', 'Hostel Complex', 'Dining Hall',
    'Sports Complex', 'Labs & Research', 'Student Events', 'Faculty Interaction',
    'International Welcome', 'Campus Landscape', 'Study Areas', 'Recreation Zone',
    'Cultural Programs', 'Tech Events', 'Group Photos', 'Evening Campus View'
  ]

  return (
    <div>
      <HeroSection
        title="Gallery"
        subtitle="Explore campus life through photos and videos"
      />

      {/* Photo Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Campus Photos"
          subtitle="Visual tour of IITDH"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-linear-to-br from-blue-100 to-blue-50 rounded-lg aspect-square flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="text-center">
                <p className="text-gray-600 font-semibold text-sm group-hover:text-brand-purple transition">
                  {item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Featured Videos"
            subtitle="Campus tours and student testimonials"
          />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-brand-purpleLight/50 rounded-lg aspect-video flex items-center justify-center hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-5xl mb-2">PLAY</div>
                <p className="text-brand-purpleDark/70 font-semibold text-sm">Campus Tour</p>
              </div>
            </div>
            <div className="bg-brand-purpleLight/50 rounded-lg aspect-video flex items-center justify-center hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-5xl mb-2">PLAY</div>
                <p className="text-brand-purpleDark/70 font-semibold text-sm">Student Life</p>
              </div>
            </div>
            <div className="bg-brand-purpleLight/50 rounded-lg aspect-video flex items-center justify-center hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-5xl mb-2">PLAY</div>
                <p className="text-brand-purpleDark/70 font-semibold text-sm">International Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Gallery */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Events & Celebrations"
          subtitle="Moments from campus activities"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Workshop', 'Seminar', 'Cultural Fest', 'Sports Day', 'Tech Fair', 'Graduation'].map((event, idx) => (
            <div key={idx} className="bg-blue-100 rounded-lg aspect-square flex items-center justify-center hover:shadow-lg transition-shadow">
              <p className="text-gray-600 font-semibold text-center px-4">{event}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
