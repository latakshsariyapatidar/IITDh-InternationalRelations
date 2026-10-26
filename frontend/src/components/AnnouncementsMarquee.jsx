import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { formatDay } from "../utils/formatDay";
import { RiCalendarLine, RiArrowDownSLine } from "@remixicon/react";

export default function AnnouncementsMarquee() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // 3.24 & 1.5: limit=20, includeExpired=false, isPublic=true
        const res = await apiClient.get('/announcements?limit=20&includeExpired=false&isPublic=true');
        setAnnouncements(res.data?.data?.announcements || []);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const renderContentWithLinks = (content) => {
    if (!content) return 'No content provided.';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-plum font-medium underline decoration-saffron/60 underline-offset-4 break-all hover:decoration-plum">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const publicAnnouncements = announcements.filter(a => a.isPublic !== false);
  if (publicAnnouncements.length === 0) return null;

  // The track scrolls by half its width, so it holds the same reel twice; the
  // reel repeats the titles enough times to be wider than any screen.
  const titles = publicAnnouncements.map((a) => a.title).filter(Boolean);
  const reel = Array.from({ length: Math.max(2, Math.ceil(8 / Math.max(titles.length, 1))) }, () => titles).flat();

  return (
    // Hover or keyboard focus opens the full list.
    <div
      tabIndex={0}
      aria-label={`${publicAnnouncements.length} announcements. Focus or hover to read them all.`}
      className="group relative z-50 w-full cursor-default bg-ink-deep text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron"
    >
      <div className="max-w-7xl mx-auto flex items-stretch px-4 sm:px-6 lg:px-8">
        <span className="relative z-10 flex shrink-0 items-center gap-2 bg-ink-deep pr-4 text-[0.8rem] font-semibold text-saffron">
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1.5 text-[0.7rem] font-bold text-ink-deep nums-tabular">
            {publicAnnouncements.length}
          </span>
          <span className="hidden sm:inline">Updates</span>
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden py-2.5 [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]">
          <div className="marquee-track flex w-max items-center pointer-events-none group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden="true" className="flex items-center">
                {reel.map((title, i) => (
                  <span key={`${copy}-${i}`} className="flex items-center whitespace-nowrap text-[0.85rem] text-white/85">
                    <span className="mx-6 h-1 w-1 rounded-full bg-saffron/70" />
                    {title}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <span className="relative z-10 hidden shrink-0 items-center gap-1 bg-ink-deep pl-4 text-[0.8rem] text-white/60 sm:flex">
          Read all
          <RiArrowDownSLine size={16} className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
        </span>
      </div>

      {/* Dropdown Overlay */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-white shadow-[0_24px_48px_-12px_rgb(23_40_56/0.35)] rounded-b-2xl border border-t-0 border-mist opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 max-h-[60vh] overflow-y-auto z-[9999] text-body">
        <div className="p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4 border-b border-mist pb-4 mb-2">
            <h3 className="text-2xl font-medium text-plum-deep">Announcements</h3>
            <span className="text-sm text-quiet nums-tabular">
              {publicAnnouncements.length} current
            </span>
          </div>

          <div className="flex flex-col divide-y divide-mist">
            {publicAnnouncements.map((ann) => (
              <article key={ann.id} className="py-5 flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="text-base sm:text-lg font-semibold text-plum-deep leading-snug">{ann.title}</h4>
                  {/* 3.26: Show publish date */}
                  {ann.publishedAt && (
                    <span className="text-xs text-quiet flex items-center gap-1 shrink-0 nums-tabular">
                      <RiCalendarLine size={13} className="text-saffron-deep" />
                      {formatDay(ann.publishedAt, 'en-US')}
                    </span>
                  )}
                </div>

                {/* Announcements have no separate link field; links written in
                    the content are made clickable here. */}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{renderContentWithLinks(ann.content)}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
