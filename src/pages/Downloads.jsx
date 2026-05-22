import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

export default function Downloads() {
  const downloadSections = [
    {
      title: 'International Student Resources',
      items: [
        { name: 'International Student Guide', desc: 'Complete guide for international students at IITDH', icon: '📘', size: '2.4 MB' },
        { name: 'Campus Factsheet', desc: 'Quick facts about campus facilities and programs', icon: '📄', size: '1.2 MB' },
        { name: 'Accommodation Guide', desc: 'Hostel information and room allocation process', icon: '🏠', size: '1.8 MB' },
      ]
    },
    {
      title: 'Academic Documents',
      items: [
        { name: 'IITDH Presentation', desc: 'Institutional overview and academic programs', icon: '🎓', size: '5.6 MB' },
        { name: 'Academic Calendar', desc: 'Current semester schedule and important dates', icon: '📅', size: '0.8 MB' },
        { name: 'Course Catalog', desc: 'Detailed course offerings and descriptions', icon: '📚', size: '3.2 MB' },
      ]
    },
    {
      title: 'Partnership Resources',
      items: [
        { name: 'MoU Template', desc: 'Standard Memorandum of Understanding template', icon: '📋', size: '1.5 MB' },
        { name: 'Partnership Brochure', desc: 'Benefits and framework for institutional partnerships', icon: '🤝', size: '2.1 MB' },
        { name: 'Faculty Profiles Directory', desc: 'Searchable directory of IITDH faculty and research', icon: '👨‍🏫', size: '4.3 MB' },
      ]
    },
    {
      title: 'Visa & Immigration',
      items: [
        { name: 'Visa Checklist', desc: 'Step-by-step checklist for visa application', icon: '✅', size: '0.6 MB' },
        { name: 'Document Requirements', desc: 'Detailed list of required documents for various visas', icon: '📑', size: '0.9 MB' },
        { name: 'e-FRRO Guide', desc: 'Guide to online registration for international students', icon: '🌐', size: '1.1 MB' },
      ]
    }
  ]

  return (
    <div>
      <HeroSection
        title="Downloads"
        subtitle="Essential resources and documents"
      />

      {downloadSections.map((section, sectionIdx) => (
        <section key={sectionIdx} className={sectionIdx % 2 === 0 ? '' : 'bg-gray-50'}>
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-brand-purpleDark mb-12">{section.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, idx) => (
                <Card key={idx} className="hover:border-blue-300 border border-transparent">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-brand-purpleDark mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.size}</span>
                        <button className="text-brand-purple hover:text-brand-marigoldDark font-semibold text-sm flex items-center gap-1">
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Bulk Download */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <SectionHeader
            title="Download All Resources"
            subtitle="Get all documents in one ZIP file"
          />
          <button className="bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center gap-2">
            ⬇️ Download All Files (ZIP - 18 MB)
          </button>
        </div>
      </section>

      {/* Video Library */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Video Library"
          subtitle="Helpful video guides and tutorials"
        />
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-4">
              <span className="text-5xl">▶️</span>
            </div>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-2">Visa Application Guide</h3>
            <p className="text-sm text-gray-700 mb-4">Step-by-step video guide for student visa application</p>
            <span className="text-xs text-gray-500">Duration: 8 mins</span>
          </Card>

          <Card>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-4">
              <span className="text-5xl">▶️</span>
            </div>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-2">Campus Orientation</h3>
            <p className="text-sm text-gray-700 mb-4">Virtual tour and orientation for new students</p>
            <span className="text-xs text-gray-500">Duration: 15 mins</span>
          </Card>

          <Card>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-4">
              <span className="text-5xl">▶️</span>
            </div>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-2">e-FRRO Registration</h3>
            <p className="text-sm text-gray-700 mb-4">How to complete your e-FRRO registration online</p>
            <span className="text-xs text-gray-500">Duration: 6 mins</span>
          </Card>
        </div>
      </section>

      {/* Contact for Custom Requests */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <SectionHeader
            title="Can't Find What You Need?"
            subtitle="Contact the IRO for additional resources"
          />
          <Card className="text-center max-w-xl mx-auto">
            <p className="text-gray-700 mb-6">
              We can provide customized documents and additional resources for your specific needs.
            </p>
            <div className="space-y-2 text-gray-700 mb-6">
              <p><strong>Email:</strong> <a href="mailto:iro@iitdh.ac.in" className="text-brand-purple hover:underline">iro@iitdh.ac.in</a></p>
              <p><strong>Phone:</strong> <a href="tel:+91-8364-241-200" className="text-brand-purple hover:underline">+91-8364-241-200</a></p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
