import { useEffect, useState } from "react";
import apiClient from "../api/client";

export default function AnnouncementsMarquee() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await apiClient.get('/announcements?limit=5');
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

  if (announcements.length === 0) return null;

  return (
    <section className="relative z-50 bg-brand-marigold text-brand-purpleDark py-3 group cursor-pointer overflow-visible border-b border-brand-marigoldDark/20 shadow-md w-full">
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-16 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 text-sm font-extrabold tracking-widest uppercase">
              <span className="opacity-70">&bull;</span>
              <span>{announcements.filter(a => a.isPublic).length} New Announcements</span>
              <span className="opacity-70">&bull;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dropdown Overlay */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-white shadow-2xl rounded-b-2xl border border-brand-purpleLight/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-y-95 group-hover:scale-y-100 max-h-[60vh] overflow-y-auto z-[9999]">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-brand-purpleDark mb-6 border-b border-brand-purpleLight/40 pb-2">Latest Updates</h3>
          <div className="flex flex-col divide-y divide-brand-purpleLight/40">
            {announcements.filter(a => a.isPublic).map(ann => (
              <div key={ann.id} className="py-4 first:pt-0 last:pb-0 hover:bg-brand-purpleLight/5 px-2 transition-colors flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-brand-marigoldDark uppercase tracking-wider bg-brand-marigold/10 px-2 py-0.5 rounded shrink-0">{ann.type || 'General'}</span>
                  <h4 className="text-lg font-bold text-brand-purpleDark leading-tight">{ann.title}</h4>
                </div>
                <p className="text-gray-600 text-sm pl-0 whitespace-pre-wrap">{renderContentWithLinks(ann.content)}</p>
                {ann.linkUrl && (
                  <a href={ann.linkUrl} target="_blank" rel="noreferrer" className="text-brand-purple font-semibold text-sm hover:underline mt-1 inline-flex items-center gap-1">
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
