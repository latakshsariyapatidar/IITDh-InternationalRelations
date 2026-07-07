import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

export default function About() {
  const irStudents = [
    {
      name: "Prajwal N Prasad",
      role: "IRO Student Head",
      email: "",
      responsibilities: [
        "Oversee the activities of the student body of the IRO",
        "Coordinate between the IR Office and the Heads of all verticals"
      ],
      imageUrl: "/students/prajwal.jpg"
    },
    {
      name: "Samartha",
      role: "Outbound head",
      email: "cs23bt019@iitdh.ac.in",
      responsibilities: [
        "Manage and create the database of scholarships and international programmes",
        "Coordinate with Kavitha ma'am for MoU signing, renewal and outreach"
      ]
    },
    {
      name: "Nilesh Barandwal",
      role: "Head – Inbound Programs",
      email: "cs24mt018@iitdh.ac.in",
      responsibilities: [
        "Selection and management of buddies",
        "Coordinating with IRO Head and IRO office for inbound activities",
        "Organizing events and supporting international students"
      ]
    },
    {
      name: "Ishabh Janjuha",
      role: "Management Head",
      email: "me23bt006@iitdh.ac.in",
      responsibilities: [
        "Selection of various domains of the management team.",
        "Guiding the team for various events/publicity, and design tasks."
      ]
    }
  ];

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
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-400 font-medium">Chairperson Picture</span>
                </div>
                <h3 className="text-xl font-bold text-brand-purple mb-1 text-center">Chairperson</h3>
                <p className="text-sm text-brand-marigold font-semibold text-center">International Relations Office</p>
            </div>
            <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-brand-purpleLight/50">
              <SectionHeader
                title="Chairperson's Welcome Note"
                centered={false}
                badge="WELCOME"
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

      {/* IR Students Team */}
      <section className="bg-brand-purpleDark py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-brand-marigold text-xs font-bold tracking-widest uppercase mb-3">Team</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">IITDH Students for International Relations</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">Student heads driving international initiatives</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {irStudents.map((member, idx) => (
              <Card key={idx} variant="default" className="flex flex-col h-full">
                <div className="text-center flex-grow flex flex-col">
                  <div className="bg-brand-purple rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center border-2 border-brand-marigold shrink-0 relative overflow-hidden text-gray-200">
                    {/* Placeholder for Photo */}
                    {/* <span className="text-xs text-center px-2">Photo Placeholder</span> */}
                    <img src={member.imageUrl} alt="" className='w-full h-full object-cover'/>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-800 mb-1">{member.name}</h3>
                  <p className="text-sm text-brand-purpleDark font-bold mb-2">{member.role}</p>
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-xs text-brand-marigoldDark hover:underline mb-4 block">
                      {member.email}
                    </a>
                  )}
                  <div className="text-left mt-auto bg-neutral-canvas/50 p-3 rounded-lg flex-grow">
                    <p className="text-xs font-bold text-gray-700 mb-2">Responsibilities:</p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                      {member.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
