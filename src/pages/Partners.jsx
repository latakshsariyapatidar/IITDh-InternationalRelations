import { useState } from 'react'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import { mockData } from '../data/mockData'

export default function Partners() {
  const [showMoreUniversities, setShowMoreUniversities] = useState(false)

  const universities = mockData.partnerships.universities
  const featuredUniversities = universities.slice(0, 3)
  const hiddenUniversities = universities.slice(3)
  const marqueeUniversities = [...universities, ...universities]

  return (
    <div className="bg-white text-brand-purpleDark">
      <HeroSection
        title="Our Partners"
        subtitle="A global network designed to help students move, study, research, and connect with confidence"
      />


      <section className="relative py-10">
        <div className="mb-10 w-screen relative left-1/2 right-1/2 -translate-x-1/2 overflow-hidden border-y border-brand-purpleLight bg-white">
          <div className="overflow-hidden px-4 py-4 md:px-8">
            <div className="marquee-track flex w-max items-center gap-8">
              {marqueeUniversities.map((uni, idx) => (
                <div key={`${uni.name}-${idx}`} className="flex min-w-70 items-center gap-3 text-brand-purpleDark">
                  <span className="h-2 w-2 rounded-full bg-brand-marigold" />
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em]">{uni.name}</p>
                    <p className="text-xs text-brand-purpleDark/65">{uni.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-purpleDark/55">Featured universities</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-purpleDark md:text-3xl">
                Three featured institutions, evenly presented.
              </h2>
            </div>
            <p className="hidden text-sm text-brand-purpleDark/60 md:block">Additional partners can be expanded below</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredUniversities.map((uni, idx) => (
              <Card key={idx} variant="default" className="flex min-h-48 flex-col justify-center border-brand-purpleLight text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-purpleLight text-sm font-bold text-brand-purpleDark">
                  {uni.name.charAt(0)}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-brand-purpleDark">{uni.name}</h3>
                <p className="text-sm text-brand-purpleDark/70">{uni.country}</p>
              </Card>
            ))}
          </div>

          {hiddenUniversities.length > 0 && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowMoreUniversities((current) => !current)}
                aria-expanded={showMoreUniversities}
                aria-controls="more-universities-panel"
                className="inline-flex items-center gap-3 rounded-full border border-brand-purpleLight bg-white px-5 py-3 text-sm font-semibold text-brand-purple transition hover:border-brand-purple hover:bg-brand-purpleLight/20"
              >
                <span>{showMoreUniversities ? 'Hide' : 'Show'} more universities</span>
                <span className="rounded-full bg-brand-purple px-2.5 py-1 text-xs text-white">{hiddenUniversities.length}</span>
              </button>

              <div
                id="more-universities-panel"
                className={`grid gap-4 overflow-hidden transition-all duration-500 ease-custom-bezier ${showMoreUniversities ? 'mt-6 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  {hiddenUniversities.map((uni, idx) => (
                    <Card key={idx} variant="default" className="flex min-h-48 flex-col justify-center border-brand-purpleLight p-4 text-center">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-purpleLight text-sm font-bold text-brand-purpleDark">
                        {uni.name.charAt(0)}
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-brand-purpleDark">{uni.name}</h3>
                      <p className="text-sm text-brand-purpleDark/70">{uni.country}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white/80 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            title="Partner Organizations"
            subtitle="Collaborating bodies and agencies"
            badge="NETWORK"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {mockData.partnerships.organizations.map((org, idx) => (
              <Card key={idx} variant="default" className="border-brand-purpleLight">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-purpleDark">{org.name}</h3>
                  <span className="text-2xl text-brand-marigold">NET</span>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-brand-purpleDark/70">Country/Region:</p>
                  <p className="font-semibold text-brand-purpleDark">{org.country}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-purpleDark/70">Focus Area:</p>
                  <p className="font-semibold text-brand-marigold">{org.focus}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          title="Partnership Benefits"
          subtitle="What our collaborations offer"
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <Card variant="default" className="border-brand-purpleLight">
            <h3 className="mb-4 text-xl font-semibold text-brand-purpleDark">For Students</h3>
            <ul className="space-y-3 text-brand-purpleDark/80">
              <li>✓ Exchange semester opportunities</li>
              <li>✓ Joint degree programs</li>
              <li>✓ Research collaborations</li>
              <li>✓ Global networking</li>
              <li>✓ Internship placements</li>
            </ul>
          </Card>

          <Card variant="default" className="border-brand-purpleLight">
            <h3 className="mb-4 text-xl font-semibold text-brand-purpleDark">For Faculty</h3>
            <ul className="space-y-3 text-brand-purpleDark/80">
              <li>✓ Research partnerships</li>
              <li>✓ Joint publications</li>
              <li>✓ Faculty exchange programs</li>
              <li>✓ Collaborative funding</li>
              <li>✓ Knowledge sharing</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}