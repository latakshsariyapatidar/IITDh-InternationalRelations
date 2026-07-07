import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'

export default function Contact() {
  return (
    <div>
      <HeroSection
        title="Contact Us"
        subtitle="Get in touch with the International Relations Office"
        cta={{ label: 'Send Message', onClick: () => document.querySelector('form').scrollIntoView({ behavior: 'smooth' }) }}
      />

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="International Relations Contacts"
          subtitle="Reach out to the right person for your needs"
          badge="CONTACT"
        />
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {[
            { name: 'Dr. Chairperson', role: 'IRO Chairperson', email: 'chairperson@iitdh.ac.in', phone: '+91-8364-241-201' },
            { name: 'Ms. Priya Sharma', role: 'IRO Director', email: 'iro@iitdh.ac.in', phone: '+91-8364-241-202' },
            { name: 'Mr. Arun Kumar', role: 'International Mobility', email: 'mobility@iitdh.ac.in', phone: '+91-8364-241-203' },
            { name: 'Ms. Sneha Patel', role: 'Admissions', email: 'admission@iitdh.ac.in', phone: '+91-8364-241-204' }
          ].map((contact, idx) => (
            <Card key={idx} variant="light" border>
              <h3 className="text-lg font-bold text-brand-purpleDark mb-1">{contact.name}</h3>
              <p className="text-sm text-brand-marigold font-semibold mb-3">{contact.role}</p>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-brand-purple">Email:</span> <a href={`mailto:${contact.email}`} className="text-brand-purpleDark/80 hover:text-brand-marigold">{contact.email}</a></p>
                <p><span className="font-semibold text-brand-purple">Phone:</span> <a href={`tel:${contact.phone}`} className="text-brand-purpleDark/80 hover:text-brand-marigold">{contact.phone}</a></p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="feedback" className="bg-neutral-canvas py-16">
        <div className="max-w-2xl mx-auto px-4">
          <SectionHeader
            title="Send us a Message"
            subtitle="We'll get back to you within 24 hours"
            badge="FORM"
          />
          <form className="space-y-6 bg-white rounded-xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-brand-purpleDark mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border border-brand-purpleLight rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-purpleDark mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-brand-purpleLight rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition" placeholder="your@email.com" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-brand-purpleDark mb-2">Phone</label>
                <input type="tel" className="w-full px-4 py-2 border border-brand-purpleLight rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-purpleDark mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-2 border border-brand-purpleLight rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition" placeholder="Inquiry subject" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-purpleDark mb-2">Message</label>
              <textarea rows="5" className="w-full px-4 py-2 border border-brand-purpleLight rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition" placeholder="Your message..."></textarea>
            </div>

            <CTAButton label="Send Message" variant="primary" size="lg" className="w-full" onClick={() => alert('Message sent! We will contact you soon.')} />
          </form>
        </div>
      </section>

      {/* Location Info */}
      <section id="campus-map" className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Visit Us"
          subtitle="International Relations Office Location"
          badge="LOCATION"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl aspect-video flex items-center justify-center border border-brand-purpleLight/70">
            <p className="text-gray-400 text-center">Map Placeholder</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-purpleDark mb-6">Office Address</h3>
            <div className="space-y-4">
              {[
                { icon: 'BLD', label: 'Building Location', value: 'Building 2, Near Central Library' },
                { icon: 'ADDR', label: 'Campus Address', value: 'IIT Dharwad, NH 48, Chikhaldroog Road, Dharwad - 580011, Karnataka, India' },
                { icon: 'HRS', label: 'Office Hours', value: 'Mon-Fri: 9:00 AM - 5:30 PM | Sat: 10:00 AM - 2:00 PM' },
                { icon: 'TEL', label: 'Phone', value: '+91-8364-241-200' },
                { icon: 'MAIL', label: 'Email', value: 'iro@iitdh.ac.in' }
              ].map((item, idx) => (
                <Card key={idx} variant="light">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-brand-purple">{item.label}:</p>
                      {item.label === 'Email' ? (
                        <a href={`mailto:${item.value}`} className="text-brand-purpleDark/80 hover:text-brand-marigold">{item.value}</a>
                      ) : (
                        <p className="text-gray-700">{item.value}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

