import { useEffect, useState } from "react";
import CTAButton from "../components/ui/CTAButton";
import apiClient from "../api/client";
import { useSiteContent } from "../contexts/SiteContentContext";
import { Link } from "react-router-dom";

export default function Home() {
  const slideshowImages = [
    "/institute/Institute1.jpg",
    "/institute/Institute2.jpg",
    "/institute/Institute3.jpg",
    "/institute/Institute4.jpg",
    "/institute/Institute5.jpg",
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const { getContent } = useSiteContent();

  const renderRichText = (text, className = "") => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, idx) => (
      <p key={idx} className={className}>{paragraph}</p>
    ));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    
    // Fetch upcoming events and testimonials
    const fetchHomeData = async () => {
      try {
        const eventsRes = await apiClient.get('/events?upcoming=true&limit=3');
        setEvents(eventsRes.data?.data?.events || []);
        
        const testRes = await apiClient.get('/testimonials?limit=6');
        setTestimonials(testRes.data?.data?.testimonials || []);
      } catch (error) {
        console.error('Failed to load home data', error);
      }
    };
    
    fetchHomeData();

    return () => clearInterval(intervalId);
  }, [slideshowImages.length]);

  return (
    <div className="pb-24">
      <section className="relative min-h-[70vh] flex flex-col justify-center text-brand-purpleDark py-20 overflow-hidden border-b border-brand-purpleLight/70">
        <div className="absolute inset-0 z-0">
          {slideshowImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 z-1 bg-linear-to-b from-brand-purpleLight/20 via-neutral-canvas/80 to-neutral-canvas" />
        <div className="container mx-auto max-w-7xl px-6 z-10 text-center">
          <p className="text-brand-marigold font-semibold tracking-widest uppercase mb-4 text-sm">
            {getContent("home.hero.tagline", "Globally Connected • Locally Rooted")}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {getContent("home.hero.title", "International Relations Office")}
          </h1>
          <div className="text-xl text-brand-purpleDark/75 max-w-3xl mx-auto mb-12 space-y-4">
            {renderRichText(getContent("home.hero.subtitle", "The core campus framework for global research, collaborative innovation, and cross-border student-faculty exchanges."))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <CTAButton
              to="/collaboration"
              label="For Inbound Scholars"
              className="bg-brand-marigold text-brand-purpleDark font-bold hover:bg-brand-marigoldDark"
            />
            <CTAButton
              to="/collaboration"
              label="For Outgoing IITDH Cohort"
              className="bg-white text-brand-purpleDark border border-brand-purpleLight font-bold hover:bg-brand-purpleLight/35"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-brand-purpleDark text-white border-y border-white">
        <div className="container mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-white">
          <div className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              {getContent("home.stats.stat1Number", "77")}
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              {getContent("home.stats.stat1Label", "NIRF Engineering Rank")}
            </p>
          </div>
          <div className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              {getContent("home.stats.stat2Number", "500+")}
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              {getContent("home.stats.stat2Label", "Acre Permanent Green Campus")}
            </p>
          </div>
          <div className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              {getContent("home.stats.stat3Number", "2016")}
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              {getContent("home.stats.stat3Label", "Est. (Mentored by IIT Bombay)")}
            </p>
          </div>
        </div>
      </section>



      {/* Director's Message */}
      <section className="py-24 bg-neutral-canvas">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-textDark mb-3">
              Directors message to the international community
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-purpleLight/70 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
              <div className="relative w-24 h-24 overflow-hidden object-center bg-brand-purpleLight/60 rounded-full shrink-0 flex items-center justify-center text-brand-purpleDark text-sm font-bold">
                <img
                  src="/director/director.JPG"
                  alt="Director of IIT Dharwad"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-sm text-brand-marigoldDark font-semibold mb-4">
                  {getContent("home.leadership.directorName", "Prof. Venkappayya R. Desai")}<br/>
                  {getContent("home.leadership.directorTitle", "Director, IIT Dharwad")}
                </p>
                <div className="text-neutral-textDark/80 text-sm leading-relaxed space-y-4">
                  {renderRichText(getContent("home.leadership.directorQuote", "Dear International Students/Academicians,\n\nIt gives me great pleasure to welcome you to IIT Dharwad.\n\nAs a growing Institute of National Importance, IIT Dharwad is committed to excellence in education, research, and innovation, with a strong and expanding global outlook. Our International Relations Office plays a pivotal role in building meaningful academic partnerships and fostering vibrant cross-cultural engagement.\n\nLocated in Dharwad, Karnataka, the Institute offers an intellectually stimulating and culturally enriching environment. We believe that international collaboration strengthens our academic ecosystem and brings valuable global perspectives to our campus.\n\nWe look forward to welcoming students, scholars, and partners from across the world to be part of the IIT Dharwad community."))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-textDark mb-3">
              Opportunities
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-canvas p-8 rounded-2xl border border-brand-purpleLight/60 shadow-sm">
              <h3 className="text-2xl font-bold text-brand-purpleDark mb-4">
                IITDH Students:
              </h3>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-brand-marigoldDark mb-2">SCHOLARSHIPS</h4>
                <p className="text-sm text-neutral-textDark/80">
                  <strong>Name of the program:</strong> INSPIRE FELLOWSHIPS<br/>
                  <strong>Program details:</strong> .
                </p>
              </div>
            </div>
            <div className="bg-neutral-canvas p-8 rounded-2xl border border-brand-purpleLight/60 shadow-sm">
              <h3 className="text-2xl font-bold text-brand-purpleDark mb-4">
                IITDH Faculty Programs:
              </h3>
              <h4 className="text-lg font-bold text-brand-marigoldDark mb-2">FUNDING</h4>
              <div className="space-y-4 text-sm text-neutral-textDark/80">
                <p><strong>1) Name of the program:</strong> India–Japan Cooperative Science Programme (IJCSP)</p>
                <p><strong>Program details:</strong> IJCSP is a bilateral initiative that supports collaborative research projects between Indian and Japanese researchers in frontier areas of science and technology.</p>
                <p>The programme provides an excellent opportunity to strengthen research partnerships with Japanese institutions, facilitate faculty exchanges, promote joint research activities, and enhance international research visibility.</p>
                <p>Faculty members who already have collaborators in Japan, or those interested in establishing research partnerships with Japanese universities and research institutions, are strongly encouraged to explore this opportunity and submit proposals.</p>
                <p>Some of the key objectives of the programme include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Promotion of collaborative research between Indian and Japanese scientists.</li>
                  <li>Exchange visits of researchers and faculty members.</li>
                  <li>Development of long-term institutional and research partnerships.</li>
                  <li>Strengthening international research networks and capacity building.</li>
                </ul>
                <p>Interested faculty members are requested to review the programme guidelines and eligibility criteria and consider submitting applications within the stipulated deadline.</p>
                <p>This programme aligns well with IIT Dharwad’s efforts to expand international research collaborations and enhance engagement with leading institutions in Japan.</p>
                <hr className="border-brand-purpleLight/50 my-4" />
                <p>The Department of Science & Technology (fDST), Government of India, and the Japan Society for the Promotion of Science (JSPS) invite proposals for:</p>
                <p><strong>Who Can Apply?</strong><br/>Eligible Indian researchers and scientists</p>
                <p><strong>Priority Research Areas</strong><br/>
                1. Physical Sciences<br/>
                2. Chemical Sciences<br/>
                3. Life Sciences & Agriculture<br/>
                4. Mathematics & Computational Science<br/>
                5. Astronomy & Earth Sciences<br/>
                6. Materials Science & Engineering
                </p>
                <p className="bg-yellow-200 text-yellow-900 font-bold p-2 rounded inline-block">Last Date for Proposal Submission: September 3, 2026</p>
                <p>For details and applications: <a href="http://www.onlinedst.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.onlinedst.gov.in</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events (Moved below Opportunities) */}
      <section className="py-20 bg-neutral-canvas">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-neutral-textDark mb-3">
                Upcoming Events
              </h2>
              <p className="text-neutral-textDark/70 max-w-2xl">
                Stay updated with the latest happenings, visits, and opportunities.
              </p>
            </div>
            {events.length > 0 && (
              <Link to="/visits" className="text-brand-marigoldDark font-semibold hover:underline mt-4 md:mt-0">
                View all events →
              </Link>
            )}
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl border border-brand-purpleLight/60 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                  {event.imageUrl ? (
                    <div className="aspect-video w-full overflow-hidden bg-brand-purpleLight/30 relative">
                      <img 
                        src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${event.imageUrl}`} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-brand-purple font-bold text-sm shadow-sm">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-brand-purpleLight/30 border-b border-brand-purpleLight/50">
                      <div className="bg-white inline-block px-3 py-1 rounded-md text-brand-purple font-bold text-sm shadow-sm">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-marigold/20 text-brand-marigoldDark">
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-brand-purpleDark mb-2 group-hover:text-brand-marigoldDark transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-neutral-textDark/70 text-sm line-clamp-3 mb-4 flex-1">
                      {event.description}
                    </p>
                    {event.link && (
                      <a href={event.link} target="_blank" rel="noreferrer" className="text-brand-purple font-semibold text-sm hover:underline mt-auto inline-flex items-center gap-1">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-brand-purpleLight/60 text-center text-neutral-textDark/60">
              No upcoming events scheduled at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-brand-purpleDark text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
          <div className="container mx-auto max-w-7xl px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Global Community Says
              </h2>
              <div className="w-24 h-1 bg-brand-marigold mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <div key={item.id} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 flex flex-col">
                  <div className="text-brand-marigold mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.017 21L16.41 14.5916C16.6146 13.9712 16.7169 13.661 16.7169 13.3444C16.7169 12.0163 15.6543 10.9392 14.3435 10.9392C13.8824 10.9392 13.5684 11.0825 13.2625 11.3693C13.0645 11.5549 12.9238 11.8398 12.9238 12.1818C12.9238 12.6074 13.1166 12.8777 13.4357 13.1557C13.7909 13.465 14.1292 13.7548 14.1292 14.3981C14.1292 14.6547 14.0321 14.9312 13.8296 15.3456L11.5 21H14.017ZM7.01696 21L9.41014 14.5916C9.61461 13.9712 9.71686 13.661 9.71686 13.3444C9.71686 12.0163 8.65429 10.9392 7.34352 10.9392C6.88243 10.9392 6.56837 11.0825 6.26249 11.3693C6.06448 11.5549 5.92375 11.8398 5.92375 12.1818C5.92375 12.6074 6.11656 12.8777 6.43575 13.1557C6.79089 13.465 7.12918 13.7548 7.12918 14.3981C7.12918 14.6547 7.03208 14.9312 6.82959 15.3456L4.5 21H7.01696Z"/>
                    </svg>
                  </div>
                  <p className="text-white/90 mb-8 italic flex-1">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    {item.photoUrl ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-brand-marigold">
                        <img 
                          src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.photoUrl}`} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-marigold text-brand-purpleDark flex items-center justify-center font-bold text-lg shrink-0">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-brand-marigold uppercase tracking-wider font-semibold">
                        {[item.program, item.country].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* IITDH Video */}
      <section className="py-20 bg-neutral-canvas">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-textDark mb-3">
              IIT Dharwad
            </h2>
            <p className="text-neutral-textDark/70 max-w-2xl mx-auto">
              A quick look at campus.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-purpleLight/70 bg-brand-purpleLight/30 aspect-video flex items-center justify-center">
            <iframe
              src="https://www.youtube.com/embed/gPA85GPmEwk"
              title="IIT Dharwad"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-2xl"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
