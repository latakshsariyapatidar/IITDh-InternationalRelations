import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import { RiBookReadLine, RiFilePaper2Line, RiHomeOfficeLine, RiSlideshowLine, RiCalendarEventLine, RiBookOpenLine, RiFilePaperLine, RiFileTextLine, RiGroupLine, RiListCheck2, RiFileList3Line, RiGlobalLine, RiPlayCircleLine, RiDownloadCloud2Line } from '@remixicon/react'

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await apiClient.get('/downloads?limit=100');
        setDownloads(res.data?.data?.downloads || []);
      } catch (err) {
        console.error('Failed to fetch downloads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  const getCategoryTitle = (category) => {
    const titles = {
      ADMISSION_FORM: 'Admission Forms',
      VISA_GUIDE: 'Visa & Immigration Guides',
      MOU_DOCUMENT: 'Partnership & MOU Documents',
      BROCHURE: 'Brochures & Factsheets',
      OTHER: 'General Resources'
    };
    return titles[category] || 'Resources';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      ADMISSION_FORM: <RiFilePaper2Line size={36} className="text-brand-purple" />,
      VISA_GUIDE: <RiGlobalLine size={36} className="text-brand-purple" />,
      MOU_DOCUMENT: <RiFilePaperLine size={36} className="text-brand-purple" />,
      BROCHURE: <RiBookReadLine size={36} className="text-brand-purple" />,
      OTHER: <RiFileTextLine size={36} className="text-brand-purple" />
    };
    return icons[category] || <RiFileTextLine size={36} className="text-brand-purple" />;
  };

  const groupedDownloads = downloads.reduce((acc, current) => {
    if (!acc[current.category]) acc[current.category] = [];
    acc[current.category].push(current);
    return acc;
  }, {});

  const downloadSections = Object.keys(groupedDownloads).map(category => ({
    title: getCategoryTitle(category),
    items: groupedDownloads[category].map(item => ({
      name: item.title,
      desc: item.description,
      icon: getCategoryIcon(category),
      size: item.fileType ? `${item.fileType.toUpperCase()}` : 'FILE',
      fileUrl: item.fileUrl
    }))
  }));

  return (
    <div>
      <HeroSection
        title="Downloads"
        subtitle="Essential resources and documents"
      />

      {loading ? (
        <div className="py-24 text-center">Loading resources...</div>
      ) : downloadSections.length > 0 ? (
        downloadSections.map((section, sectionIdx) => (
          <section key={sectionIdx} className={sectionIdx % 2 === 0 ? '' : 'bg-gray-50'}>
            <div className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="text-3xl font-bold text-brand-purpleDark mb-12">{section.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, idx) => (
                  <Card key={idx} className="hover:border-brand-purpleLight/60 border border-transparent flex flex-col h-full">
                    <div className="flex items-start gap-4 h-full flex-col">
                      <div className="flex items-start gap-4 w-full">
                        <div className="flex-shrink-0 mt-1 bg-brand-purpleLight/20 p-3 rounded-lg">{item.icon}</div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-brand-purpleDark mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-100">
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{item.size}</span>
                        <a 
                          href={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${item.fileUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-brand-purple hover:text-brand-marigoldDark font-semibold text-sm flex items-center gap-1 bg-brand-purpleLight/10 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <RiDownloadCloud2Line size={16} /> Download
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        <div className="py-24 text-center text-gray-500">No resources available for download currently.</div>
      )}

      {/* Video Library */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Video Library"
          subtitle="Helpful video guides and tutorials"
        />
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-4 text-brand-purple hover:text-brand-marigold transition-colors cursor-pointer">
              <RiPlayCircleLine size={64} />
            </div>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-2">Visa Application Guide</h3>
            <p className="text-sm text-gray-700 mb-4">Step-by-step video guide for student visa application</p>
            <span className="text-xs text-gray-500">Duration: 8 mins</span>
          </Card>

          <Card>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-4 text-brand-purple hover:text-brand-marigold transition-colors cursor-pointer">
              <RiPlayCircleLine size={64} />
            </div>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-2">Campus Orientation</h3>
            <p className="text-sm text-gray-700 mb-4">Virtual tour and orientation for new students</p>
            <span className="text-xs text-gray-500">Duration: 15 mins</span>
          </Card>

          <Card>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-4 text-brand-purple hover:text-brand-marigold transition-colors cursor-pointer">
              <RiPlayCircleLine size={64} />
            </div>
            <h3 className="text-lg font-bold text-brand-purpleDark mb-2">e-FRRO Registration</h3>
            <p className="text-sm text-gray-700 mb-4">How to complete your e-FRRO registration online</p>
            <span className="text-xs text-gray-500">Duration: 6 mins</span>
          </Card>
        </div>
      </section>

      {/* Contact for Custom Requests */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <SectionHeader
            title="Can't Find What You Need?"
            subtitle="Contact the IRO for additional resources"
          />
          <Card className="text-center max-w-xl mx-auto">
            <p className="text-gray-700 mb-6">
              We can provide customized documents and additional resources for your specific needs.
            </p>
            <div className="space-y-2 text-gray-700 mb-6">
              <p><strong>Email:</strong> <a href="mailto:iro@iitdh.ac.in" className="text-brand-purple hover:underline">iro@iitdh.ac.in</a></p>
              <p><strong>Phone:</strong> <a href="tel:+91-8364-241-200" className="text-brand-purple hover:underline">+91-8364-241-200</a></p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
