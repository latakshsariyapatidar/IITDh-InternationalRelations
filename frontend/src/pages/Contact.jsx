import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'
import { RiBuilding2Line, RiMapPinLine, RiTimeLine, RiPhoneLine, RiMailLine, RiContactsBook2Line, RiMailSendLine, RiMapPin2Line } from '@remixicon/react'

export default function Contact() {
  return (
    <div>
      <HeroSection
        title="Contact Us"
        subtitle="Get in touch with the International Relations Office"
        cta={{ label: 'Email Us', onClick: () => window.location.href = 'mailto:iro@iitdh.ac.in' }}
      />

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="International Relations Contacts"
          subtitle="Reach out to the right person for your needs"
          badge={<RiContactsBook2Line size={24} />}
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

      {/* Contact Email */}
      <section id="feedback" className="bg-neutral-canvas py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <SectionHeader
            title="Send us a Message"
            subtitle="Reach out to us via email for any inquiries"
            badge={<RiMailSendLine size={24} />}
          />
          <div className="bg-white rounded-xl p-8 shadow-lg inline-block w-full">
            <p className="text-lg text-gray-700 mb-4">You can email us directly at:</p>
            <a href="mailto:iro@iitdh.ac.in" className="text-2xl font-bold text-brand-purple hover:text-brand-marigold transition-colors">iro@iitdh.ac.in</a>
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section id="campus-map" className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Visit Us"
          subtitle="International Relations Office Location"
          badge={<RiMapPin2Line size={24} />}
        />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-brand-purpleLight/70 shadow-lg relative group">
            <iframe 
              src="https://maps.google.com/maps?q=IIT%20Dharwad&t=&z=14&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="IIT Dharwad Location"
            ></iframe>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <a href="https://maps.app.goo.gl/o8Nfwf6Dbwsqdb4C9" target="_blank" rel="noopener noreferrer" className="bg-white text-brand-purple px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-brand-marigold hover:text-white transition-colors pointer-events-auto">
                Open in Google Maps
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-purpleDark mb-6">Office Address</h3>
            <div className="space-y-4">
              {[
                { icon: <RiBuilding2Line className="text-brand-purple" size={24} />, label: 'Building Location', value: 'Building 2, Near Central Library' },
                { icon: <RiMapPinLine className="text-brand-purple" size={24} />, label: 'Campus Address', value: 'IIT Dharwad, NH 48, Chikhaldroog Road, Dharwad - 580011, Karnataka, India' },
                { icon: <RiTimeLine className="text-brand-purple" size={24} />, label: 'Office Hours', value: 'Mon-Fri: 9:00 AM - 5:30 PM | Sat: 10:00 AM - 2:00 PM' },
                { icon: <RiPhoneLine className="text-brand-purple" size={24} />, label: 'Phone', value: '+91-8364-241-200' },
                { icon: <RiMailLine className="text-brand-purple" size={24} />, label: 'Email', value: 'iro@iitdh.ac.in' }
              ].map((item, idx) => (
                <Card key={idx} variant="light">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5">{item.icon}</span>
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

