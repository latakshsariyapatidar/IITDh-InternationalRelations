import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import { useState, useEffect, useMemo } from 'react'
import { RiMapPinLine } from '@remixicon/react'
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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-mist bg-white">
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
        <p className="text-sm font-semibold text-plum nums-tabular">{formatEventDate(event.startDate, event.endDate)}</p>
        <h3 className="mt-2 text-xl font-medium leading-snug text-plum-deep">
          {event.title}
        </h3>
        {event.description && (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-quiet whitespace-pre-wrap line-clamp-4">
            {event.description}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-mist pt-4 text-xs text-quiet">
          <span className="rounded-full bg-saffron-tint px-2.5 py-1 font-semibold text-saffron-deep">
            {EVENT_TYPE_LABELS[event.type] || event.type}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <RiMapPinLine size={14} aria-hidden="true" /> {event.location}
            </span>
          )}
        </div>
      </div>
    </article>
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

      {/* Delegation visits: a timeline, newest first */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Delegation Visits"
            subtitle="Recent and scheduled international delegations hosted at IIT Dharwad"
          />

          {loading ? (
            <p className="py-12 text-quiet">Loading visits...</p>
          ) : visits.length > 0 ? (
            <ol className="relative border-l border-mist lg:ml-40">
              {visits.map((visit) => (
                <li key={visit.id} className="relative pb-12 pl-8 last:pb-0 lg:pl-10">
                  <span aria-hidden="true" className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-saffron ring-4 ring-porcelain" />
                  {/* Date sits in the left margin on large screens */}
                  <p className="text-sm font-semibold text-plum nums-tabular lg:absolute lg:-left-40 lg:top-0.5 lg:w-32 lg:text-right">
                    {new Date(visit.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {visit.endDate && <span className="block font-normal text-quiet">to {new Date(visit.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                  </p>
                  <div className="mt-2 grid gap-6 lg:mt-0 md:grid-cols-12">
                    <div className={visit.imageUrl ? 'md:col-span-8' : 'md:col-span-12'}>
                      <h3 className="text-2xl font-medium leading-snug text-plum-deep">{visit.title}</h3>
                      {visit.organisation && (
                        <p className="mt-1 text-[0.95rem] font-medium text-body">
                          {visit.organisation}{visit.country ? `, ${visit.country}` : ''}
                        </p>
                      )}
                      {visit.description && (
                        <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-body whitespace-pre-wrap line-clamp-4">
                          {visit.description}
                        </p>
                      )}
                      {visit.location && (
                        <p className="mt-3 flex items-center gap-1.5 text-sm text-quiet">
                          <RiMapPinLine size={15} aria-hidden="true" /> {visit.location}
                        </p>
                      )}
                    </div>
                    {visit.imageUrl && (
                      <div className="md:col-span-4 aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
                        <img
                          src={resolveMediaUrl(visit.imageUrl)}
                          alt={visit.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-2xl border border-dashed border-mist bg-white p-10 text-center text-quiet">No visits currently available.</p>
          )}
        </div>
      </section>

      {/* Other events: conferences, workshops, exchanges and the rest */}
      <section id="events" className="bg-white border-y border-mist py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Events"
            subtitle="Conferences, workshops, exchanges and other events at IIT Dharwad"
          />

          {loading ? (
            <p className="py-12 text-quiet">Loading events...</p>
          ) : otherEvents.length === 0 ? (
            <p className="py-12 text-quiet">No events currently available.</p>
          ) : (
            <div className="space-y-14">
              <div>
                <h3 className="mb-6 text-2xl font-medium text-plum-deep">Upcoming and ongoing</h3>
                {upcomingEvents.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
                  </div>
                ) : (
                  <p className="text-quiet">No upcoming events scheduled at the moment.</p>
                )}
              </div>

              {pastEvents.length > 0 && (
                <div>
                  <h3 className="mb-6 text-2xl font-medium text-plum-deep">Past events</h3>
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
      <section id="visitor-info" className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Visitor Information"
            subtitle="Everything visiting delegations need to know"
          />
          <div className="grid gap-12 md:grid-cols-2">
            {[
              {
                title: 'Campus access',
                items: [
                  ['Entry process', 'Security gate clearance coordinated via IRO through host faculty'],
                  ['Parking', 'Visitor parking available near the main gate'],
                  ['Reception', 'Main reception in Building 1'],
                  ['Facilities', 'High-speed campus Wi-Fi access credentials provided on arrival'],
                  ['Transportation', 'Campus shuttle service available'],
                ],
              },
              {
                title: 'Local information',
                items: [
                  ['Nearest airport', 'Hubballi Airport (about 15 km)'],
                  ['Railway station', 'Dharwad Railway Station (8 km); Hubballi Junction for long-distance trains'],
                  ['Hotels', 'Institute Guest House on campus and city hotels in Dharwad/Hubballi'],
                  ['Currency', 'Indian Rupee (INR)'],
                  ['Climate', 'Moderate, pleasant during Oct-Feb'],
                ],
              },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="text-2xl font-medium text-plum-deep">{group.title}</h3>
                <dl className="mt-5 divide-y divide-mist border-y border-mist">
                  {group.items.map(([term, text]) => (
                    <div key={term} className="grid gap-1 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                      <dt className="font-semibold text-plum-deep">{term}</dt>
                      <dd className="text-body">{text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
