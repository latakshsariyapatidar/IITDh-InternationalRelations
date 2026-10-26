import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import ArchFrame from '../components/ui/ArchFrame'
import { useState, useEffect } from 'react'
import { RiExternalLinkLine, RiMailLine } from '@remixicon/react'
import DOMPurify from 'dompurify'
import { fetchAllPages } from '../api/fetchAllPages'
import { useSiteContent } from '../contexts/SiteContentContext'
import { resolveMediaUrl } from '../utils/media'

const AMBITIONS = [
  'International student admissions to full time taught and research programs',
  'Semester abroad student exchanges with partner institutes, research internships, immersion programs, study tours, project work',
  'Twinning arrangements to collaboratively design and offer programs, and jointly award degrees',
  'Course-specific tie-ups and blended teaching-learning',
  'Visiting faculty exchanges',
  'Joint Research & Development on projects of relevance to either/both/all concerned countries',
]

export default function About() {
  const [team, setTeam] = useState([]);
  const [faculty, setFaculty] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const { getContent } = useSiteContent();

  const aboutIntro = getContent('about.intro');
  const chairpersonMessage = getContent('about.chairpersonMessage');

  useEffect(() => {
    // 1.10 Load independent requests separately (every page of each)
    const fetchTeam = async () => {
      try {
        setTeam(await fetchAllPages('/team', 'team', { pageSize: 100 }));
      } catch (err) {
        console.error('Failed to fetch team data', err);
      }
    };

    const fetchFaculty = async () => {
      try {
        setFaculty(await fetchAllPages('/faculty', 'faculty', { pageSize: 100 }));
      } catch (err) {
        console.error('Failed to fetch faculty data', err);
      }
    };

    setLoading(true);
    Promise.allSettled([fetchTeam(), fetchFaculty()]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <HeroSection
        title="About Us"
        subtitle="International Collaborations and International Academic Programs"
        backgroundImage="/institute/Institute1.jpg"
        cta={{ label: 'Learn More', onClick: () => document.getElementById('about-intro')?.scrollIntoView({ behavior: 'smooth' }) }}
      />

      {/* Intro Section (3.8 reads about.intro from site content) */}
      <section id="about-intro" className="bg-white border-b border-mist py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] text-plum-deep">
              Internationalisation at IIT Dharwad
            </h2>
            {/* The office's two verticals */}
            <dl className="mt-8 space-y-4">
              <div className="border-l-2 border-plum pl-4">
                <dt className="font-heading! text-lg text-plum-deep">International Collaborations</dt>
                <dd className="text-sm text-quiet">Partnerships, MoUs and joint research</dd>
              </div>
              <div className="border-l-2 border-ink pl-4">
                <dt className="font-heading! text-lg text-ink">International Academic Programs</dt>
                <dd className="text-sm text-quiet">Admissions, exchange and mobility</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {aboutIntro ? (
              <div className="prose-copy text-[1.05rem] text-body whitespace-pre-wrap">
                {aboutIntro}
              </div>
            ) : (
              <div className="prose-copy text-[1.05rem] text-body">
                <p>
                  Internationalisation is an inherent aspect of the Indian Institutes and the International Relations Office at IIT Dharwad is committed to achieving its goals through a focused approach, supported by two verticals, <strong className="font-semibold text-plum-deep">“International Collaborations and International Academic Programs”</strong>.
                </p>
                <p>
                  We look forward to welcoming the international community to our midst, in the spirit of mutually beneficial partnerships. To broaden the experience — both yours and ours — of academic and cultural life, to be better equipped to participate in multicultural, globalised workspaces; and to contribute meaningfully to a dynamic, more integrated world.
                </p>
                <p>
                  The departments and centers of IIT Dharwad are responsible for teaching, research, and industrial consultancy. With our excellent faculty, students who excel both in academics and extra-curricular activities, dedicated staff members, and state-of-the-art research facilities, the first decade of our existence is proving to be an exciting phase. Going forward, we expect to have:
                </p>
              </div>
            )}

            {!aboutIntro && (
              <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-mist bg-mist sm:grid-cols-2">
                {AMBITIONS.map((item) => (
                  <li key={item} className="bg-porcelain p-5 text-[0.95rem] leading-relaxed text-body">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Chairperson Message (3.8 reads about.chairpersonMessage from site content) */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-12 lg:px-8">
          <div className="md:col-span-4">
            <ArchFrame
              src="https://res.cloudinary.com/db69ffwwa/image/upload/v1784037495/Chairperson_zja8c3.png"
              alt="Chairperson, International Relations Office"
              imgClassName="object-cover object-top"
              className="aspect-[4/5] w-full max-w-[18rem]"
            />
            <p className="mt-6 font-heading! text-xl text-plum-deep">Chairperson</p>
            <p className="text-sm text-quiet">International Relations Office</p>
          </div>

          <div className="md:col-span-8 lg:col-span-7 lg:col-start-6">
            <h2 className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] text-plum-deep">
              Chairperson's welcome note
            </h2>
            {chairpersonMessage ? (
              <div className="mt-8 prose-copy text-[1.05rem] text-body whitespace-pre-wrap">
                {chairpersonMessage}
              </div>
            ) : (
              <div className="mt-8 prose-copy text-[1.05rem] text-body">
                <p className="font-heading! text-xl text-plum-deep">Dear International Community,</p>
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
                <p className="pt-2">
                  With warm regards,<br />
                  <strong className="font-semibold text-plum-deep">Chairperson</strong><br />
                  International Relations Office<br />
                  Indian Institute of Technology Dharwad
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Faculty */}
      {faculty.length > 0 && (
        <section id="faculty" className="bg-white border-y border-mist py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Our Faculty Leaders"
              subtitle="Faculty who lead and champion the office's international work."
            />

            <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {faculty.filter(f => f.isActive).map((member) => (
                <li key={member.id} className="flex flex-col">
                  <div className="aspect-[4/5] w-full max-w-[12rem] overflow-hidden rounded-t-full bg-mist">
                    {member.photoUrl ? (
                      <img
                        src={resolveMediaUrl(member.photoUrl)}
                        alt={member.name}
                        className="h-full w-full object-cover object-top"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-heading! text-4xl text-plum/40">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 text-xl font-medium leading-snug text-plum-deep">
                    {member.redirectUrl ? (
                      <a
                        href={member.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-plum hover:underline decoration-saffron underline-offset-4"
                      >
                        {member.name}
                        <RiExternalLinkLine size={15} aria-label="Research profile, opens in a new tab" className="text-quiet" />
                      </a>
                    ) : (
                      member.name
                    )}
                  </h3>
                  {member.designation && <p className="mt-1 text-sm font-medium text-plum">{member.designation}</p>}
                  {member.department && <p className="mt-0.5 text-sm text-quiet">{member.department}</p>}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="mt-3 inline-flex items-center gap-1.5 text-sm text-body break-all hover:text-plum">
                      <RiMailLine size={15} aria-hidden="true" className="shrink-0 text-saffron-deep" />
                      {member.email}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* IR Students Team */}
      {team.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="IITDH Students for International Relations"
              subtitle="Student heads driving international initiatives"
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {team.filter(t => t.isActive).map((member) => (
                <article key={member.id} className="flex flex-col rounded-2xl border border-mist bg-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-t-full bg-mist">
                      {member.photoUrl ? (
                        <img
                          src={resolveMediaUrl(member.photoUrl)}
                          alt={member.name}
                          className="h-full w-full object-cover object-top"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-heading! text-2xl text-plum/50">{member.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium leading-snug text-plum-deep">{member.name}</h3>
                      <p className="text-sm font-medium text-saffron-deep">{member.role}</p>
                    </div>
                  </div>

                  {member.email && (
                    <a href={`mailto:${member.email}`} className="mt-4 text-sm text-body break-all hover:text-plum">
                      {member.email}
                    </a>
                  )}

                  {member.responsibilities && member.responsibilities !== '<p><br></p>' && (
                    <div
                      className="mt-4 border-t border-mist pt-4 text-sm leading-relaxed text-quiet max-w-none break-words [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-1"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(member.responsibilities) }}
                    />
                  )}

                  {member.year && (
                    <p className="mt-auto pt-4 text-xs text-quiet">
                      {member.year}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
