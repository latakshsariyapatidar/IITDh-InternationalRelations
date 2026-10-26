import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { formatDay } from "../utils/formatDay";
import { RiArrowDownSLine } from "@remixicon/react";

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
    if (!content) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-white underline decoration-saffron/70 underline-offset-4 break-all hover:decoration-saffron">
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

      {/* The full list hangs from the ticker as one dark drawer, the same
          width as the page content, so it reads as the bar opening up rather
          than a card floating over the hero. */}
      <div className="invisible absolute inset-x-0 top-full z-[9999] border-t border-white/10 bg-ink-deep opacity-0 shadow-[0_28px_40px_-24px_rgb(23_40_56/0.6)] transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 motion-reduce:transition-none">
        <div className="mx-auto max-h-[60vh] max-w-7xl overflow-y-auto px-4 sm:px-6 lg:px-8">
          <ol className="divide-y divide-white/10">
            {publicAnnouncements.map((ann) => (
              <li key={ann.id} className="grid gap-x-8 gap-y-1 py-6 sm:grid-cols-[9rem_1fr]">
                {/* 3.26: Show publish date */}
                <p className="text-sm text-saffron nums-tabular sm:pt-1">
                  {ann.publishedAt ? formatDay(ann.publishedAt, 'en-US') : ''}
                </p>
                <div className="max-w-3xl">
                  <h3 className="font-heading! text-xl leading-snug text-white">{ann.title}</h3>
                  {/* Announcements have no separate link field; links written in
                      the content are made clickable here. */}
                  {ann.content && (
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-white/70 whitespace-pre-wrap">{renderContentWithLinks(ann.content)}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
