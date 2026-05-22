import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brand-purpleDark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/IITDh logo white.svg" alt="IIT Dharwad" className="h-10 w-auto" />
              <div>
                <h3 className="text-lg font-bold text-white">IRO IITDH</h3>
              </div>
            </div>
            <p className="text-brand-purpleLight/80 text-sm leading-relaxed mb-6">
              International Relations Office - Your gateway to global opportunities at IIT Dharwad
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/company/iit-dharwad?originalSubdomain=in" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-marigold/20 flex items-center justify-center transition-colors text-brand-purpleLight">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.469v6.766z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/iitdharwadofficial/" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-marigold/20 flex items-center justify-center transition-colors text-brand-purpleLight">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://x.com/iitdhrwd" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-marigold/20 flex items-center justify-center transition-colors text-brand-purpleLight">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-3 1" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@IITDharwadOfficialChannel" className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-marigold/20 flex items-center justify-center transition-colors text-brand-purpleLight">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-brand-marigold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/admission" className="text-brand-purpleLight/80 hover:text-brand-marigold transition">International Admission</Link></li>
              <li><Link to="/collaboration" className="text-brand-purpleLight/80 hover:text-brand-marigold transition">Collaboration & Mobility</Link></li>
              <li><Link to="/partners" className="text-brand-purpleLight/80 hover:text-brand-marigold transition">Our Partners</Link></li>
              <li><Link to="/visa" className="text-brand-purpleLight/80 hover:text-brand-marigold transition">Visa & Immigration</Link></li>
              <li><Link to="/gallery" className="text-brand-purpleLight/80 hover:text-brand-marigold transition">Gallery</Link></li>
              <li><Link to="/life" className="text-brand-purpleLight/80 hover:text-brand-marigold transition">Life @ IITDH</Link></li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="text-lg font-bold text-brand-marigold mb-4">Office Address</h4>
            <p className="text-brand-purpleLight/80 text-sm leading-relaxed mb-4">
              International Relations Office<br />
              IIT Dharwad, Chikkamalligawad<br />
              Dharwad, Karnataka — 580 011<br />
              India
            </p>
            <div className="space-y-2 text-sm">
              <div className="text-brand-purpleLight/80">
                <span className="text-brand-marigold font-semibold">Email:</span> <a href="mailto:iro@iitdh.ac.in" className="hover:text-brand-marigold transition">iro@iitdh.ac.in</a>
              </div>
              <div className="text-brand-purpleLight/80">
                <span className="text-brand-marigold font-semibold">Phone:</span> +91-836-XXXXXXX
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-brand-marigold to-transparent my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>&copy; 2026 International Relations Office, IIT Dharwad. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-marigold transition">Privacy Policy</a>
            <a href="#" className="hover:text-brand-marigold transition">Accessibility</a>
            <a href="https://www.iitdh.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-brand-marigold transition">
              Visit IITDH Main Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
