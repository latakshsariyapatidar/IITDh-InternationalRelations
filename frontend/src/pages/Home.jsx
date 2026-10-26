import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { fetchAllPages } from "../api/fetchAllPages";
import { useSiteContent } from "../contexts/SiteContentContext";
import { Link } from "react-router-dom";
import { resolveMediaUrl } from "../utils/media";
import PhotoFrame from "../components/ui/PhotoFrame";
import ArchFrame from "../components/ui/ArchFrame";
import CTAButton from "../components/ui/CTAButton";
import { RiArrowRightUpLine, RiMapPinLine, RiDoubleQuotesL } from "@remixicon/react";

// Where a visitor most likely wants to go first, by who they are.
const ROUTES = [
  {
    title: 'Study at IIT Dharwad',
    text: 'Full-time Masters and PhD admission for international students.',
    to: '/international-admissions',
  },
  {
    title: 'Come on exchange',
    text: 'Semester exchange, research, project work and internships.',
    to: '/international-mobility',
  },
  {
    title: 'Partner with us',
    text: 'MoUs, consortia, joint research and faculty exchange.',
    to: '/partners',
  },
  {
    title: 'Plan your arrival',
    text: 'Visas, FRRO registration and settling in on campus.',
    to: '/visa',
  },
];

export default function Home() {
  const slideshowImages = [
    "/institute/Institute1.jpg",
    "/institute/Institute2.jpg",
    "/institute/Institute3.jpg",
    "/institute/Institute4.jpg",
    "/institute/Institute5.jpg",
    "/institute/institute6.webp",
    "/institute/institute7.webp",
    "/institute/institute8.webp",
    "/institute/institute9.webp",
    "/institute/institute10.webp",
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [events, setEvents] = useState([]);
  // True when nothing is upcoming and the section falls back to past events.
  const [showingRecentEvents, setShowingRecentEvents] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const { getContent } = useSiteContent();

  const renderRichText = (text, className = "") => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, idx) => (
      <p key={idx} className={className}>{paragraph}</p>
    ));
  };

  const formatEventDate = (startDate, endDate) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (!endDate) return startStr;
    const end = new Date(endDate);
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (startStr === endStr) return startStr;
    return `${startStr} – ${endStr}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);

    // 1.10 Load independent requests separately so one failure doesn't blank the other
    // 1.5 Ask only for public content
    const fetchEvents = async () => {
      try {
        // The events list is newest-first, so one page of it holds the
        // furthest-off events, not the nearest. Load every event that starts
        // from now on, plus the most recently started ones (some still running).
        const [futureEvents, startedRes] = await Promise.all([
          fetchAllPages('/events', 'events', { pageSize: 50, params: { isPublic: true, upcoming: true } }),
          apiClient.get('/events', { params: { isPublic: true, upcoming: false, limit: 50 } }),
        ]);
        const startedEvents = startedRes.data?.data?.events || [];

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        // 1. Find upcoming or ongoing events (event ends today or in the future)
        const ongoing = startedEvents.filter(ev => {
          const start = ev.startDate ? new Date(ev.startDate).getTime() : 0;
          const end = ev.endDate ? new Date(ev.endDate).getTime() : start;
          return end >= todayStart;
        });
        const upcoming = [...ongoing, ...futureEvents];

        if (upcoming.length > 0) {
          // Sort ascending so the nearest events appear first (Item 3.3 fix)
          upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          setEvents(upcoming.slice(0, 3));
          setShowingRecentEvents(false);
        } else {
          // Fallback: If all events are in the past, show the 3 most recent public events
          // (the started list is already newest-first)
          setEvents(startedEvents.slice(0, 3));
          setShowingRecentEvents(startedEvents.length > 0);
        }
      } catch (error) {
        console.error('Failed to load home events', error);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const testRes = await apiClient.get('/testimonials?isActive=true&limit=6');
        setTestimonials(testRes.data?.data?.testimonials || []);
      } catch (error) {
        console.error('Failed to load home testimonials', error);
      }
    };

    fetchEvents();
    fetchTestimonials();

    return () => clearInterval(intervalId);
  }, [slideshowImages.length]);

  return (
    <div>
      {/* ── Hero: the office's name beside a view of the campus ──────────── */}
      <section className="relative overflow-hidden bg-plum-deep text-white">
        {/* A faint meridian grid: the office faces the rest of the world */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 700">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <ellipse key={i} cx="900" cy="350" rx={60 + i * 95} ry="520" />
            ))}
            {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
              <line key={i} x1="0" x2="1200" y1={350 + i * 95} y2={350 + i * 95} />
            ))}
          </g>
        </svg>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 md:grid-cols-12 lg:px-8 lg:pt-20 lg:pb-24">
          <div className="md:col-span-7">
            <p className="text-saffron text-base font-medium">
              {getContent("home.hero.tagline", "Globally Connected • Locally Rooted")}
            </p>
            <h1 className="mt-4 text-[2.9rem] sm:text-6xl lg:text-[4.6rem] font-medium leading-[1.02] tracking-[-0.025em]">
              {getContent("home.hero.title", "International Relations Office")}
            </h1>
            <div className="mt-6 max-w-xl text-lg text-white/75 leading-relaxed space-y-3">
              {renderRichText(getContent("home.hero.subtitle", "The core campus framework for global research, collaborative innovation, and cross-border student-faculty exchanges."))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTAButton label="International admissions" to="/international-admissions" variant="accent" size="lg" />
              <CTAButton label="Exchange programmes" to="/international-mobility" variant="inverse" size="lg" />
            </div>
            {/* Founding year, from the site content's "established" stat.
                font-heading! needs the !important: index.css sets font-family
                on * outside any layer, which beats plain font utilities. */}
            <p className="mt-12 flex items-center gap-3.5">
              <span aria-hidden="true" className="h-px w-10 bg-saffron" />
              <span className="font-heading! text-lg italic text-white/80">
                {getContent("home.stats.stat3Label", "Established")} {getContent("home.stats.stat3Number", "2016")}
              </span>
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col items-center md:items-end">
            <PhotoFrame className="aspect-[4/3] w-full max-w-[30rem]">
              {slideshowImages.map((image, index) => (
                <div
                  key={image}
                  aria-hidden={index !== activeSlide}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 motion-reduce:transition-none ${index === activeSlide ? "opacity-100" : "opacity-0"}`}
                  style={{ backgroundImage: `url(${image})` }}
                />
              ))}
            </PhotoFrame>
            {/* Slide picker: one short bar per photograph */}
            <div className="mt-6 flex w-full max-w-[30rem] gap-1.5" role="group" aria-label="Campus photographs">
              {slideshowImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show photograph ${index + 1} of ${slideshowImages.length}`}
                  aria-pressed={index === activeSlide}
                  className="group flex-1 cursor-pointer py-2"
                >
                  <span className={`block h-[3px] rounded-full transition-colors ${index === activeSlide ? 'bg-saffron' : 'bg-white/20 group-hover:bg-white/45'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Routes: where to start, by who you are ─────────────────────────── */}
      <section aria-labelledby="routes-heading" className="bg-white border-b border-mist">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="routes-heading" className="sr-only">Where to start</h2>
          <ul className="grid divide-y divide-mist sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {ROUTES.map((route, i) => (
              <li key={route.to} className={`${i % 2 === 1 ? 'sm:border-l sm:border-mist lg:border-l-0' : ''} ${i > 1 ? 'sm:border-t sm:border-mist lg:border-t-0' : ''}`}>
                <Link to={route.to} className="group flex h-full flex-col gap-2 px-1 py-8 sm:px-6 lg:px-8 transition-colors hover:bg-porcelain">
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-heading! text-[1.4rem] leading-snug text-plum-deep">{route.title}</span>
                    <RiArrowRightUpLine aria-hidden="true" size={22} className="mt-1 shrink-0 text-saffron-deep transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="text-sm leading-relaxed text-quiet">{route.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Director's Message ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-12 lg:px-8">
          <div className="md:col-span-4">
            <ArchFrame
              src="/director/director.webp"
              alt="Director of IIT Dharwad"
              imgClassName="object-cover object-top"
              className="aspect-[4/5] w-full max-w-[18rem]"
            />
            <p className="mt-6 font-heading! text-xl text-plum-deep">
              {getContent("home.leadership.directorName", "Prof. Venkappayya R. Desai")}
            </p>
            <p className="text-sm text-quiet">{getContent("home.leadership.directorTitle", "Director, IIT Dharwad")}</p>
          </div>

          <div className="md:col-span-8 lg:col-span-7 lg:col-start-6">
            <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] text-plum-deep">
              Director's message to the international community
            </h2>
            <div className="mt-8 prose-copy text-[1.05rem] text-body [&>p:first-child]:font-heading! [&>p:first-child]:text-xl [&>p:first-child]:text-plum-deep">
              {renderRichText(getContent("home.leadership.directorQuote", "Dear International Students/Academicians,\n\nIt gives me great pleasure to welcome you to IIT Dharwad.\n\nAs a growing Institute of National Importance, IIT Dharwad is committed to excellence in education, research, and innovation, with a strong and expanding global outlook. Our International Relations Office plays a pivotal role in building meaningful academic partnerships and fostering vibrant cross-cultural engagement.\n\nLocated in Dharwad, Karnataka, the Institute offers an intellectually stimulating and culturally enriching environment. We believe that international collaboration strengthens our academic ecosystem and brings valuable global perspectives to our campus.\n\nWe look forward to welcoming students, scholars, and partners from across the world to be part of the IIT Dharwad community."))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Opportunities: for IITDH students and faculty ──────────────────── */}
      <section aria-labelledby="opportunities-heading" className="bg-plum-deep text-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="opportunities-heading" className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em]">
                Opportunities
              </h2>
              <p className="mt-3 max-w-xl text-white/70 text-lg">
                Scholarships, exchanges and research funding, collected by the office for the IIT Dharwad community.
              </p>
            </div>
            <CTAButton label="See all opportunities" to="/international-mobility#opportunities" variant="accent" />
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2">
            <Link to="/international-mobility#opportunities" className="group bg-plum-deep p-8 lg:p-10 transition-colors hover:bg-plum">
              <h3 className="text-2xl font-medium">For IITDH students</h3>
              <p className="mt-3 text-white/70 leading-relaxed">
                Scholarships and fellowships such as INSPIRE, semester exchanges with partner universities, and research internships abroad.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron">
                Student opportunities <RiArrowRightUpLine size={18} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
            <Link to="/international-mobility#faculty-programs" className="group bg-plum-deep p-8 lg:p-10 transition-colors hover:bg-plum">
              <h3 className="text-2xl font-medium">For IITDH faculty</h3>
              <p className="mt-3 text-white/70 leading-relaxed">
                Bilateral research funding such as the India–Japan Cooperative Science Programme, and visiting-faculty schemes like GIAN, VAJRA and SPARC.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron">
                Faculty programmes <RiArrowRightUpLine size={18} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events (or the most recent ones when nothing is scheduled) */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] text-plum-deep">
                {showingRecentEvents ? 'Recent events' : 'Upcoming events'}
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-quiet">
                Stay updated with the latest happenings, visits, and opportunities.
              </p>
            </div>
            {events.length > 0 && (
              <Link to="/visits" className="text-sm font-semibold text-plum underline decoration-saffron underline-offset-[6px] hover:decoration-plum">
                All events and delegations
              </Link>
            )}
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {events.map((event) => (
                <article key={event.id} className="flex flex-col overflow-hidden rounded-2xl border border-mist bg-white">
                  {event.imageUrl && (
                    <div className="aspect-[16/10] w-full overflow-hidden bg-mist">
                      <img
                        src={resolveMediaUrl(event.imageUrl)}
                        alt={event.title}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm font-semibold text-plum nums-tabular">
                      {formatEventDate(event.startDate, event.endDate)}
                    </p>
                    <h3 className="mt-2 text-xl font-medium leading-snug text-plum-deep">
                      {event.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-quiet line-clamp-3">
                      {event.description}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-mist pt-4 text-xs text-quiet">
                      <span className="rounded-full bg-saffron-tint px-2.5 py-1 font-semibold capitalize text-saffron-deep">
                        {event.type?.toLowerCase()}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <RiMapPinLine size={14} aria-hidden="true" /> {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-mist bg-white p-10 text-center text-quiet">
              No upcoming events scheduled at the moment. <Link to="/visits" className="font-semibold text-plum underline decoration-saffron underline-offset-4">See past events and visits</Link>.
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="bg-plum-deep text-white py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em]">
              What our global community says
            </h2>

            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => (
                <figure key={item.id} className="flex flex-col border-t border-white/15 pt-6">
                  <RiDoubleQuotesL size={28} aria-hidden="true" className="text-saffron" />
                  <blockquote className="mt-4 flex-1 font-heading! text-lg leading-relaxed text-white/90">
                    {item.text}
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    {item.photoUrl ? (
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                        <img
                          src={resolveMediaUrl(item.photoUrl)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-saffron text-lg font-bold text-plum-deep">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-white/60">
                        {[item.program, item.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── IITDH Video ────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-mist py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] text-plum-deep">
              IIT Dharwad
            </h2>
            <p className="mt-3 text-lg text-quiet">
              A quick look at campus.
            </p>
            <Link to="/life" className="mt-6 inline-block text-sm font-semibold text-plum underline decoration-saffron underline-offset-[6px] hover:decoration-plum">
              Life at IIT Dharwad
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="aspect-video overflow-hidden rounded-2xl bg-mist">
              <iframe
                src="https://www.youtube.com/embed/gPA85GPmEwk"
                title="IIT Dharwad"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
