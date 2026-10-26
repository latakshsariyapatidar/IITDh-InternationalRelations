import { Link } from 'react-router-dom'
import { useSiteContent } from '../contexts/SiteContentContext'
import SubNavigationData from '../data/SubNavigationData'

const SOCIAL_LINKS = [
  {
    label: 'IIT Dharwad on LinkedIn',
    href: 'https://www.linkedin.com/school/indian-institute-of-technology-dharwad-india/posts/?feedView=all',
    path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.469v6.766z',
  },
  {
    label: 'IIT Dharwad on Facebook',
    href: 'https://www.facebook.com/iitdharwadofficial/',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'IIT Dharwad on X',
    href: 'https://x.com/iitdhrwd',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'IIT Dharwad on YouTube',
    href: 'https://www.youtube.com/c/iitdharwadofficialchannel',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
]

const QUICK_LINKS = [
  { label: 'Opportunities', to: '/opportunities' },
  { label: 'FAQs', to: '/international-admissions#faqs' },
  { label: 'Campus Map', to: '/contact#campus-map' },
  { label: 'IITDH Faculty Research Profiles', to: '/about#faculty' },
  { label: 'Feedback', to: '/contact#feedback' },
  { label: 'Students Council', to: '/life' },
  { label: 'IITDh Student Portal', to: '/students' },
  { label: 'IITDh Faculty Portal', to: '/faculty-portal' },
  { label: 'Guesthouse', to: '/visits#visitor-info' },
  { label: 'Gallery', to: '/gallery' },
]

const linkClass = 'text-white/70 hover:text-white transition-colors'

export default function Footer() {
  const { getContent } = useSiteContent();

  return (
    <footer className="bg-plum-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src={getContent("site.logoUrl", "/IITDh logo white.svg")} alt="IIT Dharwad" className="h-12 w-auto" />
              <div className="border-l border-white/15 pl-3">
                <p className="font-heading! text-lg leading-tight">International Relations Office</p>
                <p className="text-xs text-white/60 mt-0.5">IIT Dharwad</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              {getContent("footer.tagline", "International Relations Office - Your gateway to global opportunities at IIT Dharwad")}
            </p>
            {/* Social Media Icons */}
            <ul className="mt-6 flex gap-2">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset ring-white/15 text-white/75 transition-colors hover:bg-saffron hover:text-plum-deep hover:ring-saffron"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d={item.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The six main sections */}
          <nav aria-label="Main sections" className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-saffron mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {SubNavigationData.map((item) => (
                <li key={item.to}><Link to={item.to} className={linkClass}>{item.label}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Quicklinks */}
          <nav aria-label="Quicklinks" className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-saffron mb-4">Quicklinks</h4>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}><Link to={item.to} className={linkClass}>{item.label}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Contact & Address */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-saffron mb-4">Office Address</h4>
            <address className="not-italic text-sm leading-relaxed text-white/70">
              International Relations Office<br />
              IIT Dharwad, Chikkamalligawad<br />
              Dharwad, Karnataka 580 011<br />
              India
            </address>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-white/50 w-14 shrink-0">Email</dt>
                <dd><a href="mailto:iro@iitdh.ac.in" className="text-white hover:text-saffron transition-colors">iro@iitdh.ac.in</a></dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-white/50 w-14 shrink-0">Phone</dt>
                <dd className="text-white nums-tabular">{getContent("footer.phone", "+91-836-XXXXXXX")}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/50">
          <p>{getContent("footer.copyrightText", "© 2026 International Relations Office, IIT Dharwad. All rights reserved.")}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            <a href="https://www.iitdh.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Visit IITDH Main Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
