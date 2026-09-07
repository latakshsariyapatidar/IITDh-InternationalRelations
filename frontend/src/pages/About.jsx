import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'
import { useState, useEffect } from 'react'
import { RiHandHeartLine, RiUserStarLine, RiGroupLine } from '@remixicon/react'
import apiClient from '../api/client'

export default function About() {
  const [team, setTeam] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const teamRes = await apiClient.get('/team?limit=100');
        setTeam(teamRes.data?.data?.team || []);
        
        const facRes = await apiClient.get('/faculty?limit=100');
        setFaculty(facRes.data?.data?.faculty || []);
      } catch (err) {
        console.error('Failed to fetch about data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <HeroSection
        title="About Us"
        subtitle="International Collaborations and International Academic Programs"
        cta={{ label: 'Learn More', onClick: () => document.querySelector('section').scrollIntoView({ behavior: 'smooth' }) }}
      />

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4 text-lg">
          <p>
            Internationalisation is an inherent aspect of the Indian Institutes and the International Relations Office at IIT Dharwad is committed to achieving its goals through a focused approach, supported by two verticals, <strong>“International Collaborations and International Academic Programs”</strong>.
          </p>
          <p>
            We look forward to welcoming the international community to our midst, in the spirit of mutually beneficial partnerships. To broaden the experience -- both yours and ours -- of academic and cultural life, to be better equipped to participate in multicultural, globalised workspaces; and to contribute meaningfully to a dynamic, more integrated world.
          </p>
          <p>
            The departments and centers of IIT Dharwad are responsible for teaching, research, and industrial consultancy. With our excellent faculty, students who excel both in academics and extra-curricular activities, dedicated staff members, and state-of-the-art research facilities, the first decade of our existence is proving to be an exciting phase. Going forward, we expect to have:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>International student admissions to full time taught and research programs</li>
            <li>Semester abroad student exchanges with partner institutes, research internships, immersion programs, study tours, project work.</li>
            <li>Twinning arrangements to collaboratively design and offer programs, and jointly award degrees</li>
            <li>Course-specific tie-ups and blended teaching-learning</li>
            <li>Visiting faculty exchanges</li>
            <li>Joint Research & Development on projects of relevance to either/both/ all concerned countries to offer just an indicative list.</li>
          </ul>
        </div>
      </section>

      {/* Chairperson Message */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 bg-white rounded-xl aspect-[3/4] flex flex-col items-center justify-center border-2 border-brand-purpleLight/50 p-4 shadow-sm overflow-hidden">
                <div className="w-full h-full rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  <img src="https://res.cloudinary.com/db69ffwwa/image/upload/v1784037495/Chairperson_zja8c3.png" alt="Chairperson" className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="text-xl font-bold text-brand-purple mb-1 text-center">Chairperson</h3>
                <p className="text-sm text-brand-marigold font-semibold text-center">International Relations Office</p>
            </div>
            <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-brand-purpleLight/50">
              <SectionHeader
                title="Chairperson's Welcome Note"
                centered={false}
                badge={<RiHandHeartLine size={24} />}
              />
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p><strong>Dear Members of the International Community,</strong></p>
                <p>
                  A warm welcome to the International Relations Office at the Indian Institute of Technology Dharwad.
                </p>
                <p>
                  It is our pleasure to welcome students, faculty members, researchers, and academic partners from around the world to our vibrant and growing academic community. At IIT Dharwad, we believe that international engagement is built through meaningful academic collaboration, mutual respect, and shared learning.
                </p>
                <p>
                  The International Relations Office serves as a bridge between the Institute and the global academic community. We are committed to facilitating international partnerships, student and faculty mobility, collaborative research, academic exchanges, and other initiatives that foster global learning and intercultural understanding. Our team strives to ensure that every international visitor experiences a smooth transition and feels welcomed, supported, and connected throughout their journey at the Institute.
                </p>
                <p>
                  Beyond academics, IIT Dharwad offers an opportunity to experience India's rich cultural heritage while being part of an innovative and inclusive campus environment. We encourage you to engage with our students and faculty, explore new ideas, build lasting friendships, and contribute your unique perspectives to our academic community.
                </p>
                <p>
                  We look forward to welcoming you to IIT Dharwad and to building enduring partnerships that advance knowledge, innovation, and global cooperation.
                </p>
                <p className="pt-4">
                  With warm regards,<br/>
                  <strong>Chairperson</strong><br/>
                  International Relations Office<br/>
                  Indian Institute of Technology Dharwad
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty */}
      {faculty.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-brand-purple text-xs font-bold tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
                <RiUserStarLine size={16} /> Faculty
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Faculty Leaders</h2>
              <div className="w-24 h-1 bg-brand-marigold mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {faculty.filter(f => f.isActive).map((member) => (
                <div key={member.id} className="bg-neutral-canvas/40 rounded-2xl p-6 border border-brand-purpleLight/30 hover:shadow-md transition-all text-center flex flex-col group">
                  <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 border-2 border-brand-purple/20 group-hover:border-brand-marigold transition-colors mb-4 shadow-sm shrink-0 overflow-hidden">
                    {member.photoUrl ? (
                      <img 
                        src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${member.photoUrl}`} 
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-brand-purpleLight/30 flex items-center justify-center text-brand-purpleDark font-bold text-xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-brand-purple font-semibold mb-2">{member.designation}</p>
                  <p className="text-xs text-gray-500 mb-4">{member.department}</p>
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline mt-auto inline-block">
                      {member.email}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* IR Students Team */}
      {team.length > 0 && (
        <section className="bg-brand-purpleDark py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <p className="text-brand-marigold text-xs font-bold tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
                <RiGroupLine size={16} /> Team
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">IITDH Students for International Relations</h2>
              <p className="text-gray-100 max-w-2xl mx-auto">Student heads driving international initiatives</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.filter(t => t.isActive).map((member) => (
                <Card key={member.id} variant="default" className="flex flex-col h-full bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-colors group overflow-hidden">
                  <div className="text-center flex-grow flex flex-col pt-4 w-full max-w-full">
                    <div className="bg-white/10 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center border-2 border-brand-marigold shrink-0 relative overflow-hidden text-gray-200 shadow-lg">
                      {member.photoUrl ? (
                        <img 
                          src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}${member.photoUrl}`} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="text-2xl font-bold text-brand-marigold">{member.name.charAt(0)}</div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-sm text-brand-marigold font-bold mb-1">{member.role}</p>

                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-xs text-blue-300 hover:text-white transition-colors mb-3">
                        {member.email}
                      </a>
                    )}

                    {member.responsibilities && member.responsibilities !== '<p><br></p>' && (
                      <div 
                        className="text-xs text-gray-300 leading-relaxed px-4 mt-2 mb-4 text-left prose prose-invert prose-sm max-w-none w-full break-words overflow-hidden [&_ol]:pl-4 [&_ul]:pl-4"
                        dangerouslySetInnerHTML={{ __html: member.responsibilities }}
                      />
                    )}
                    
                    
                    {member.year && (
                      <div className="mt-auto pt-4 flex justify-center">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">
                          {member.year}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
