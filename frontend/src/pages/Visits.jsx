import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllPages } from '../api/fetchAllPages'
import { resolveMediaUrl } from '../utils/media'

// Labels for the backend's EventType values shown in the Events section
// (VISIT events are listed above, as delegation visits).
const EVENT_TYPE_LABELS = {
  CONFERENCE: 'Conference',
  WORKSHOP: 'Workshop',
  EXCHANGE: 'Exchange',
  OTHER: 'Event',
};

const formatEventDate = (startDate, endDate) => {
  if (!startDate) return '';
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const startStr = new Date(startDate).toLocaleDateString('en-US', options);
  if (!endDate) return startStr;
  const endStr = new Date(endDate).toLocaleDateString('en-US', options);
  return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
};

function EventCard({ event }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-purpleLight/60 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      {event.imageUrl ? (
        <div className="aspect-video w-full overflow-hidden bg-brand-purpleLight/30 relative">
          <img
            src={resolveMediaUrl(event.imageUrl)}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-brand-purple font-bold text-xs shadow-sm">
            {formatEventDate(event.startDate, event.endDate)}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-brand-purpleLight/30 border-b border-brand-purpleLight/50">
          <div className="bg-white inline-block px-3 py-1 rounded-md text-brand-purple font-bold text-xs shadow-sm">
            {formatEventDate(event.startDate, event.endDate)}
          </div>
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-marigold/20 text-brand-marigoldDark">
            {EVENT_TYPE_LABELS[event.type] || event.type}
          </span>
          {event.location && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              📍 {event.location}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-brand-purpleDark mb-2 group-hover:text-brand-marigoldDark transition-colors">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-neutral-textDark/70 text-sm whitespace-pre-wrap line-clamp-4">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [otherEvents, setOtherEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        // Every public event, every page (the route returns at most 50 at a
        // time): visits are listed as delegation visits, the rest as events.
        const [eventsRes] = await Promise.allSettled([
          fetchAllPages('/events', 'events', { pageSize: 50, params: { isPublic: true } }),
        ]);
        const allEvents = eventsRes.status === 'fulfilled' ? eventsRes.value : [];
        setOtherEvents(allEvents.filter((ev) => ev.type !== 'VISIT'));

        const eventItems = allEvents
          .filter((ev) => ev.type === 'VISIT')
          .map(ev => ({
            id: ev.id,
            type: 'event',
            title: ev.title,
            description: ev.description,
            startDate: ev.startDate,
            endDate: ev.endDate,
            location: ev.location,
            imageUrl: ev.imageUrl,
          }));

        // Combine and sort by startDate descending
        const combined = [...eventItems].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setVisits(combined);
      } catch (err) {
        console.error('Failed to fetch visits', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  // Upcoming or ongoing (the event ends today or later), nearest first; then
  // past events, most recent first.
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const isCurrent = (ev) => {
      const start = ev.startDate ? new Date(ev.startDate).getTime() : 0;
      const end = ev.endDate ? new Date(ev.endDate).getTime() : start;
      return end >= todayStart;
    };
    const byStart = (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return {
      upcomingEvents: otherEvents.filter(isCurrent).sort(byStart),
      pastEvents: otherEvents.filter((ev) => !isCurrent(ev)).sort((a, b) => byStart(b, a)),
    };
  }, [otherEvents]);

  return (
    <div>
      <HeroSection
        title="Visits"
        subtitle="Hosted delegations and collaborative missions"
        backgroundImage="/institute/institute8.webp"
      />

      {/* Upcoming Visits */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Delegation Visits"
          subtitle="Recent and scheduled international delegations hosted at IIT Dharwad"
        />

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading visits...</div>
        ) : visits.length > 0 ? (
          <div className="grid md:grid-cols-1 gap-6">
            {visits.map((visit) => (
              <Card key={visit.id} className="group hover:border-brand-purple/40 transition-colors">
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  {visit.imageUrl && (
                    <div className="md:col-span-3 rounded-lg overflow-hidden aspect-video bg-neutral-canvas flex items-center justify-center">
                      <img
                        src={resolveMediaUrl(visit.imageUrl)}
                        alt={visit.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className={visit.imageUrl ? "md:col-span-9" : "md:col-span-12"}>
                    <div className="grid md:grid-cols-2 gap-4 items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">Dates</p>
                        <p className="font-semibold text-neutral-textDark mb-3">
                          {new Date(visit.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {visit.endDate && ` - ${new Date(visit.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </p>

                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">
                          {visit.type === 'visitor' ? 'Visitor / Delegation' : 'Event / Delegation'}
                        </p>
                        <p className="font-bold text-neutral-textDark text-lg mb-1 group-hover:text-brand-purple transition-colors">
                          {visit.title}
                        </p>
                        {visit.organisation && (
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            {visit.organisation}{visit.country ? `, ${visit.country}` : ''}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">Purpose / Details</p>
                        <p className="text-neutral-textDark/80 mb-3 whitespace-pre-wrap line-clamp-3 text-sm">
                          {visit.description}
                        </p>

                        {visit.location && (
                          <>
                            <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple mb-1">Host / Location</p>
                            <p className="text-neutral-textDark font-medium text-sm">{visit.location}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No visits currently available.</div>
        )}
      </section>

      {/* Other events: conferences, workshops, exchanges and the rest */}
      <section id="events" className="bg-brand-cream/40 border-y border-brand-purpleLight/40 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Events"
            subtitle="Conferences, workshops, exchanges and other events at IIT Dharwad"
          />

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading events...</div>
          ) : otherEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No events currently available.</div>
          ) : (
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-bold text-brand-purpleDark mb-5">Upcoming & Ongoing</h3>
                {upcomingEvents.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming events scheduled at the moment.</p>
                )}
              </div>

              {pastEvents.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-brand-purpleDark mb-5">Past Events</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pastEvents.map((event) => <EventCard key={event.id} event={event} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Visitor Information (the footer's "Guesthouse" link lands here) */}
      <section id="visitor-info" className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Visitor Information"
            subtitle="Everything visiting delegations need to know"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-bold text-neutral-textDark mb-4">Campus Access</h3>
              <ul className="space-y-3 text-neutral-textDark/80 text-sm">
                <li><strong>Entry Process:</strong> Security gate clearance coordinated via IRO through host faculty</li>
                <li><strong>Parking:</strong> Visitor parking available near the main gate</li>
                <li><strong>Reception:</strong> Main reception in Building 1</li>
                <li><strong>Facilities:</strong> High-speed campus Wi-Fi access credentials provided on arrival</li>
                <li><strong>Transportation:</strong> Campus shuttle service available</li>
              </ul>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Information</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li><strong>Nearest Airport:</strong> Hubballi Airport (90 km)</li>
                <li><strong>Railway Station:</strong> Dharwad Railway Station (8 km)</li>
                <li><strong>Hotels:</strong> Institute Guest House on campus and city hotels in Dharwad/Hubballi</li>
                <li><strong>Currency:</strong> Indian Rupee (INR)</li>
                <li><strong>Climate:</strong> Moderate, pleasant during Oct-Feb</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
