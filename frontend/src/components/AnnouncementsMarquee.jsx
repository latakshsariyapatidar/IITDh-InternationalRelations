import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { formatDay } from "../utils/formatDay";
import { RiCalendarLine } from "@remixicon/react";

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
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-medium hover:underline">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const publicAnnouncements = announcements.filter(a => a.isPublic !== false);
  if (publicAnnouncements.length === 0) return null;

  return (
    <section className="relative z-50 bg-brand-marigold text-brand-purpleDark py-2.5 group cursor-pointer overflow-visible border-b border-brand-marigoldDark/20 shadow-xs w-full">
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-16 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 text-xs sm:text-sm font-extrabold tracking-widest uppercase">
              <span className="opacity-70">&bull;</span>
              <span>{publicAnnouncements.length} Announcements & Updates</span>
              <span className="opacity-70">&bull;</span>
              <span className="font-semibold text-xs lowercase tracking-normal opacity-80">(hover to read all)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dropdown Overlay */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-white shadow-2xl rounded-b-2xl border border-brand-purpleLight/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-y-95 group-hover:scale-y-100 max-h-[60vh] overflow-y-auto z-[9999]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-purpleLight/40 pb-3 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-purpleDark">Campus Announcements & Updates</h3>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {publicAnnouncements.length} active updates
            </span>
          </div>

          <div className="flex flex-col divide-y divide-brand-purpleLight/30">
            {publicAnnouncements.map((ann) => (
              <div key={ann.id} className="py-4 first:pt-0 last:pb-0 hover:bg-brand-purpleLight/5 px-2.5 rounded-lg transition-colors flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {ann.type && (
                      <span className="text-[10px] font-bold text-brand-marigoldDark uppercase tracking-wider bg-brand-marigold/15 px-2 py-0.5 rounded shrink-0">
                        {ann.type}
                      </span>
                    )}
                    <h4 className="text-base sm:text-lg font-bold text-brand-purpleDark leading-snug">{ann.title}</h4>
                  </div>
                  {/* 3.26: Show publish date */}
                  {ann.publishedAt && (
                    <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0 font-medium">
                      <RiCalendarLine size={13} className="text-brand-purple" />
                      {formatDay(ann.publishedAt, 'en-US')}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm pl-0 whitespace-pre-wrap leading-relaxed">{renderContentWithLinks(ann.content)}</p>

                {/* 3.25: Support link if provided */}
                {ann.linkUrl && (
                  <a href={ann.linkUrl} target="_blank" rel="noreferrer" className="text-brand-purple font-semibold text-xs hover:underline mt-1 inline-flex items-center gap-1 self-start">
                    {ann.linkText || 'Read more'} <span>&rarr;</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
