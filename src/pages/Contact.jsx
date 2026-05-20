import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import ContactCard from '../components/ui/ContactCard'
import { mockData } from '../data/mockData'

export default function Contact() {
  return (
    <div>
      <HeroSection title="Contact Us" subtitle="Get in touch with the International Relations Office" />

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="International Relations Contacts"
          subtitle="Reach out to the right person for your needs"
        />
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <ContactCard {...mockData.contacts.chairperson} />
          <ContactCard {...mockData.contacts.iro} />
          <ContactCard {...mockData.contacts.internationalMobility} />
          <ContactCard {...mockData.contacts.admission} />
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <SectionHeader
            title="Send us a Message"
            subtitle="We'll get back to you within 24 hours"
          />
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none" placeholder="your@email.com" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none" placeholder="Inquiry subject" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
              <textarea rows="5" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none" placeholder="Your message..."></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Location Info */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Visit Us"
          subtitle="International Relations Office Location"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-100 rounded-lg aspect-video flex items-center justify-center">
            <p className="text-gray-500">Map Placeholder</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Office Address</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900">Building Location:</p>
                <p className="text-gray-700">Building 2, Near Central Library</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Campus Address:</p>
                <p className="text-gray-700">IIT Dharwad, NH 48, Chikhaldroog Road<br />Dharwad - 580011, Karnataka, India</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Office Hours:</p>
                <p className="text-gray-700">Monday - Friday: 9:00 AM - 5:30 PM<br />Saturday: 10:00 AM - 2:00 PM<br />Sunday & Holidays: Closed</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phone:</p>
                <p className="text-gray-700">+91-8364-241-200</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email:</p>
                <a href="mailto:iro@iitdh.ac.in" className="text-blue-700 hover:underline">iro@iitdh.ac.in</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
