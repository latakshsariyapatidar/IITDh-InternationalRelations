import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import { RiPlayCircleLine, RiImage2Line, RiCalendarEventLine } from '@remixicon/react'

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await apiClient.get('/gallery?limit=100');
        setImages(res.data?.data?.images || []);
      } catch (err) {
        console.error('Failed to fetch gallery images', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const getCategoryTitle = (category) => {
    const titles = {
      CAMPUS: 'Campus Photos',
      EVENTS: 'Events & Celebrations',
      STUDENT_LIFE: 'Student Life',
      COLLABORATIONS: 'Collaborations & Visits',
      OTHER: 'Gallery'
    };
    return titles[category] || 'Gallery';
  };

  const groupedImages = images.reduce((acc, current) => {
    if (!acc[current.category]) acc[current.category] = [];
    acc[current.category].push(current);
    return acc;
  }, {});

  return (
    <div>
      <HeroSection
        title="Gallery"
        subtitle="Explore campus life through photos and videos"
      />

      {loading ? (
        <div className="py-24 text-center">Loading gallery...</div>
      ) : images.length > 0 ? (
        Object.keys(groupedImages).map((category, sectionIdx) => (
          <section key={sectionIdx} className={sectionIdx % 2 === 0 ? 'bg-white py-16' : 'bg-neutral-canvas py-16'}>
            <div className="max-w-7xl mx-auto px-4">
              <SectionHeader
                title={getCategoryTitle(category)}
                subtitle={`Visual tour of ${getCategoryTitle(category).toLowerCase()}`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedImages[category].map((item) => (
                  <div
                    key={item.id}
                    className="bg-brand-purpleLight/20 rounded-lg aspect-square flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden relative"
                  >
                    {item.imageUrl ? (
                      <>
                        <img 
                          src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.imageUrl}`} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold text-sm leading-tight mb-1">{item.title}</h3>
                          {item.caption && <p className="text-white/80 text-xs line-clamp-2">{item.caption}</p>}
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <RiImage2Line size={32} className="mx-auto text-brand-purple/50 mb-2" />
                        <p className="text-gray-600 font-semibold text-sm group-hover:text-brand-purple transition">
                          {item.title}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        <div className="py-24 text-center text-gray-500">No images available in the gallery.</div>
      )}

      {/* Video Section */}
      <section className="bg-brand-purpleDark py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Featured Videos</h2>
            <p className="text-white/70">Campus tours and student testimonials</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg aspect-video flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-brand-marigold group">
              <div className="text-center">
                <div className="flex justify-center mb-2 transition-transform group-hover:scale-110"><RiPlayCircleLine size={64} /></div>
                <p className="text-white font-semibold text-sm">Campus Tour</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg aspect-video flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-brand-marigold group">
              <div className="text-center">
                <div className="flex justify-center mb-2 transition-transform group-hover:scale-110"><RiPlayCircleLine size={64} /></div>
                <p className="text-white font-semibold text-sm">Student Life</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg aspect-video flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-brand-marigold group">
              <div className="text-center">
                <div className="flex justify-center mb-2 transition-transform group-hover:scale-110"><RiPlayCircleLine size={64} /></div>
                <p className="text-white font-semibold text-sm">International Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
