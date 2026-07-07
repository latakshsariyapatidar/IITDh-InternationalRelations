import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import CTAButton from '../components/ui/CTAButton'

export default function Collaboration() {
  return (
    <div>
      <HeroSection
        title="International Mobility"
        subtitle="Global opportunities for students, faculty, and institutions"
        cta={{ label: 'Explore Programs', onClick: () => document.querySelector('section').scrollIntoView({ behavior: 'smooth' }) }}
      />

      {/* International Students */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="International Students Programs"
          subtitle="Exchange and learning opportunities"
          badge="EXCHANGE"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '01', title: 'Coursework Exchange', desc: 'Spend a semester taking courses at IITDH while completing degree requirements from your home institution.', duration: '1 semester' },
            { icon: '02', title: 'Research Exchange', desc: 'Collaborate with IITDH faculty on cutting-edge research projects in various engineering disciplines.', duration: 'Flexible' },
            { icon: '03', title: 'Project Work', desc: 'Undertake industry-relevant projects under faculty guidance with hands-on experience.', duration: '2-6 months' },
            { icon: '04', title: 'Internships', desc: 'Gain practical experience through internships in laboratories or industry partner organizations.', duration: '2-4 months' },
            { icon: '05', title: 'Study Tours', desc: 'Educational trips combining classroom learning with visits to industry, heritage sites, and research centers.', duration: '1-2 weeks' },
            { icon: '06', title: "Master's Programs", desc: 'Pursue full MS degree with research focus under expert faculty guidance.', duration: '2 years' }
          ].map((prog, idx) => (
            <Card key={idx} variant="light" icon={prog.icon} title={prog.title}>
              <p className="text-gray-700 mb-4 text-sm">{prog.desc}</p>
              <p className="text-sm text-brand-marigold font-semibold">Duration: {prog.duration}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* International Faculty */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="International Faculty Programs"
            subtitle="Funding and collaboration schemes for faculty"
            badge="FACULTY"
          />
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'SPARC', desc: 'Scheme for Promotion of Academic and Research Collaboration - Government of India initiative for research partnerships.', points: ['Funding for international collaboration', 'Faculty exchange programs', 'Joint research projects'] },
              { title: 'VAJRA', desc: 'Visiting Advanced Joint Research Faculty scheme - enables world-class scientists to work with Indian institutions.', points: ['Visiting faculty positions', 'Research collaborations', 'Knowledge transfer programs'] },
              { title: 'GIAN', desc: 'Global Initiative of Academic Networks - facilitates international faculty to teach and conduct research.', points: ['Short-term visiting positions', 'Specialized courses', 'Research mentoring'] },
              { title: 'SERB', desc: 'Science and Engineering Research Board programs supporting international research initiatives.', points: ['Research grants', 'International bilateral programs', 'Collaborative projects'] }
            ].map((prog, idx) => (
              <Card key={idx} variant="default" title={prog.title}>
                <p className="text-gray-700 mb-4">{prog.desc}</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {prog.points.map((point, pidx) => (
                    <li key={pidx} className="flex items-center gap-2">
                      <span className="text-brand-marigold">✓</span> {point}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* IITDH Students Abroad */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="IITDH Students: Opportunities Abroad"
          subtitle="Exchange and learning programs for our students"
          badge="GLOBAL"
        />
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: '01', title: 'Undergraduate Exchange', desc: 'Study abroad during 3rd or 4th year at partner universities worldwide.', info: 'Eligibility: CGPA ≥ 7.0' },
            { icon: '02', title: 'Dual Degree Programs', desc: 'Earn dual degrees from IITDH and international partner institutions.', info: 'Duration: 4-5 years' },
            { icon: '03', title: 'Postgraduate Exchange', desc: 'Research internships and thesis work at leading universities globally.', info: 'For M.Tech and PhD students' },
            { icon: '04', title: 'Summer Internships', desc: 'Industry and research internships with companies and institutions abroad.', info: 'Typically 2 months in summer' },
            { icon: '05', title: 'Immersion Programs', desc: 'Short-term cultural and technical learning programs in partner countries.', info: 'Duration: 2-4 weeks' },
            { icon: '06', title: 'PhD Programs', desc: 'Pursue PhD at international universities with IITDH faculty collaboration.', info: 'Joint degree options available' }
          ].map((prog, idx) => (
            <Card key={idx} variant="light" icon={prog.icon} title={prog.title}>
              <p className="text-gray-700 mb-4">{prog.desc}</p>
              <p className="text-sm text-brand-purple font-semibold">{prog.info}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Faculty Funding */}
      <section className="bg-brand-purpleDark py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-brand-marigold text-xs font-bold tracking-widest uppercase mb-3">Funding</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">IITDH Faculty: International Funding</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">Government and institutional resources for collaboration</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Government Schemes', items: ['SPARC Program', 'VAJRA Scheme', 'GIAN Initiative', 'SERB Programs', 'DST-FIST'] },
              { title: 'University Partnerships', items: ['Research collaboration funds', 'Faculty exchange grants', 'Joint publications support', 'Dual appointment programs', 'Sabbatical positions'] },
              { title: 'Internal Support', items: ['Travel grants', 'Collaborative research funds', 'Visiting scholar support', 'Conference presentation aid', 'Publication grants'] }
            ].map((section, idx) => (
              <Card key={idx} variant="default" title={section.title.split(' ')[1]}>
                <ul className="space-y-2 text-sm">
                  {section.items.map((item, iidx) => (
                    <li key={iidx} className="flex items-center gap-2 text-[#2d0a1e]">
                      <span>•</span> {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* International Admissions */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="International Admissions"
          subtitle="Study in India programs and pathways"
          badge="SCHOLARSHIPS"
        />
        <div className="bg-brand-purpleLight/30 rounded-xl p-8 border border-brand-purpleLight/70">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'IN', title: 'SII Program', desc: 'Study in India - Government of India initiative promoting higher education for international students.' },
              { icon: 'SF', title: 'Self-Financed', desc: 'Direct admissions for self-funded international students with flexible payment options.' },
              { icon: 'IC', title: 'ICCR Scholarships', desc: 'Indian Council for Cultural Relations scholarships for nominated international students.' }
            ].map((prog, idx) => (
              <div key={idx}>
                <div className="text-4xl mb-3">{prog.icon}</div>
                <h3 className="text-xl font-bold text-brand-purple mb-3">{prog.title}</h3>
                <p className="text-gray-700 text-sm mb-4">{prog.desc}</p>
                <CTAButton label="Learn More" to="/admission" variant="primary" size="sm" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
