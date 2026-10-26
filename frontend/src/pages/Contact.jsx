import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import { RiMailLine, RiPhoneLine, RiMapPinLine, RiExternalLinkLine } from '@remixicon/react'

import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import { resolveMediaUrl } from '../utils/media'

const FALLBACK_CONTACTS = [
  { name: 'Dr. Sagnik Sen', title: 'Chairperson, International Relations Office', email: 'chairperson.iro@iitdh.ac.in', phone: '', address: '' },
  { name: 'Ms. Kavitha G R', title: 'Advisor, International Relations', email: 'advisor.iro@iitdh.ac.in', phone: '+91 9444536574', address: '' },
  { name: 'Mr. Arun Verma', title: 'Assistant Registrar', email: 'office.iro@iitdh.ac.in', phone: '(+91)8193814275 / 7017304843', address: '' },
  { name: '', title: 'Inbound Coordinator', email: 'inbound.iro@iitdh.ac.in', phone: '9444536574', address: '' }
]

const OFFICE_DETAILS = [
  { label: 'Building Location', value: 'Building 2, Near Central Library' },
  { label: 'Campus Address', value: 'IIT Dharwad, NH 48, Chikhaldroog Road, Dharwad - 580011, Karnataka, India' },
  { label: 'Office Hours', value: 'Mon-Fri: 9:00 AM - 5:30 PM | Sat: 10:00 AM - 2:00 PM' },
  { label: 'Phone', value: '+91-8364-241-200' },
  { label: 'Email', value: 'office.iro@iitdh.ac.in' }
]

export default function Contact() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiClient.get('/contacts?isActive=true')
        const fetched = res.data?.data?.contacts || res.data?.data || []
        setContacts(fetched.length > 0 ? fetched : FALLBACK_CONTACTS)
      } catch (err) {
        console.error('Failed to load contacts from API, falling back', err)
        setContacts(FALLBACK_CONTACTS)
      } finally {
        setLoading(false)
      }
    }
    fetchContacts()
  }, [])

  return (
    <div>
      <HeroSection
        title="Contact Us"
        subtitle="Get in touch with the International Relations Office"
        backgroundImage="/institute/Institute1.jpg"
        cta={{ label: 'Email Us', onClick: () => window.location.href = 'mailto:office.iro@iitdh.ac.in' }}
      />

      {/* Contact Cards */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="International Relations Contacts"
            subtitle="Reach out to the right person for your needs"
          />
          {loading ? (
            <p className="py-12 text-quiet">Loading contacts...</p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2">
              {contacts.map((contact, idx) => (
                <li key={contact.id || idx} className="flex gap-5 rounded-2xl border border-mist bg-white p-6">
                  {contact.photoUrl ? (
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-t-full bg-plum-tint">
                      <img
                        src={resolveMediaUrl(contact.photoUrl)}
                        alt={contact.name || contact.title}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div aria-hidden="true" className="flex h-24 w-20 shrink-0 items-end justify-center overflow-hidden rounded-t-full bg-plum-tint pb-3 font-heading! text-3xl text-plum">
                      {(contact.name || contact.title || '?').replace(/^(Dr|Prof|Mr|Ms|Mrs)\.?\s+/i, '').charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    {contact.name && (
                      <h3 className="text-xl font-medium leading-snug text-plum-deep">{contact.name}</h3>
                    )}
                    {contact.title && (
                      <p className={contact.name ? 'mt-0.5 text-sm font-medium text-saffron-deep' : 'text-xl font-heading! text-plum-deep'}>{contact.title}</p>
                    )}
                    <ul className="mt-4 space-y-2 text-[0.95rem]">
                      {contact.email && (
                        <li className="flex items-center gap-2.5">
                          <RiMailLine size={17} aria-label="Email" className="shrink-0 text-quiet" />
                          <a href={`mailto:${contact.email}`} className="break-all text-plum underline decoration-saffron/60 underline-offset-4 hover:decoration-plum">
                            {contact.email}
                          </a>
                        </li>
                      )}
                      {contact.phone && (
                        <li className="flex items-center gap-2.5">
                          <RiPhoneLine size={17} aria-label="Phone" className="shrink-0 text-quiet" />
                          <a href={`tel:${contact.phone}`} className="text-body hover:text-plum nums-tabular">
                            {contact.phone}
                          </a>
                        </li>
                      )}
                      {contact.address && (
                        <li className="flex items-start gap-2.5">
                          <RiMapPinLine size={17} aria-label="Address" className="mt-0.5 shrink-0 text-quiet" />
                          <span className="text-body">{contact.address}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Contact Email */}
      <section id="feedback" className="bg-plum-deep text-white py-20 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em]">Send us a message</h2>
            <p className="mt-3 max-w-xl text-lg text-white/70">Questions, feedback or a visit to plan: write to the office and we'll point you to the right person.</p>
          </div>
          <a href="mailto:office.iro@iitdh.ac.in" className="font-heading! text-3xl md:text-5xl text-saffron underline decoration-saffron/40 decoration-1 underline-offset-[10px] hover:decoration-saffron">
            office.iro@iitdh.ac.in
          </a>
        </div>
      </section>

      {/* Location Info */}
      <section id="campus-map" className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Visit Us"
            subtitle="International Relations Office Location"
          />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-mist bg-mist">
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
              </div>
              <a href="https://maps.app.goo.gl/o8Nfwf6Dbwsqdb4C9" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-plum underline decoration-saffron underline-offset-[6px] hover:decoration-plum">
                Open in Google Maps <RiExternalLinkLine size={16} aria-label="opens in a new tab" />
              </a>
            </div>
            <div className="lg:col-span-5">
              <h3 className="text-2xl font-medium text-plum-deep">Office Address</h3>
              <dl className="mt-6 divide-y divide-mist border-y border-mist">
                {OFFICE_DETAILS.map((item) => (
                  <div key={item.label} className="py-4">
                    <dt className="text-sm text-quiet">{item.label}</dt>
                    <dd className="mt-0.5 text-[0.98rem] text-plum-deep">
                      {item.label === 'Email' ? (
                        <a href={`mailto:${item.value}`} className="text-plum underline decoration-saffron/60 underline-offset-4 hover:decoration-plum">{item.value}</a>
                      ) : item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
