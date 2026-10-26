import HeroSection from "../components/HeroSection";
import SectionHeader from "../components/ui/SectionHeader";
import PhotoFrame from "../components/ui/PhotoFrame";
import { RiExternalLinkLine, RiPlaneLine, RiRoadMapLine, RiTrainLine } from "@remixicon/react";

// Distances by road from IIT Dharwad (approximate).
const DISTANCES = [
  ['Hubballi Airport', '15 km'],
  ['Goa', '210 km'],
  ['Bengaluru', '430 km'],
  ['Mumbai', '465 km'],
];

const CONNECTIVITY = [
  { icon: RiPlaneLine, title: 'By air', text: 'Hubballi Airport (HBX), about 15 km from IIT Dharwad, is well connected to Bengaluru, Mumbai, Hyderabad, Goa and other major cities.' },
  { icon: RiRoadMapLine, title: 'By road', text: 'On NH-48, the Mumbai–Bengaluru highway: about 430 km to Bengaluru and 210 km to Goa.' },
  { icon: RiTrainLine, title: 'By rail', text: 'Hubballi Junction, a major railway hub on the Mumbai–Chennai line, connects to Bengaluru, Mumbai, Pune, Hyderabad, Chennai and beyond.' },
];

const externalLink = "inline-flex items-center gap-1.5 text-sm font-semibold text-plum underline decoration-saffron underline-offset-[6px] hover:decoration-plum";

export default function Life() {
  return (
    <div>
      <HeroSection
        title="Life at IIT Dharwad"
        subtitle="Experience vibrant campus life in scenic Dharwad"
        backgroundImage="/institute/institute7.webp"
      />

      {/* About Dharwad and Karnataka */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="About Dharwad and Karnataka"
            subtitle="A vibrant blend of knowledge, culture, heritage and opportunity"
          />

          <div className="grid gap-12 lg:grid-cols-2">
            <article>
              <h3 className="text-2xl font-medium text-plum-deep">About Dharwad</h3>
              <div className="mt-4 prose-copy text-[1.02rem] text-body">
                <p>
                  Located in northwestern Karnataka, Dharwad is a vibrant educational, cultural, and administrative centre that, together with the neighbouring city of Hubballi, forms the <strong className="font-semibold text-plum-deep">Hubballi–Dharwad Twin City</strong>. Situated about <strong className="font-semibold text-plum-deep">430 km northwest of Bengaluru</strong> on National Highway 48, the region enjoys a pleasant climate throughout the year and offers an ideal environment for learning, research, and innovation.
                </p>
                <p>
                  Often referred to as the <strong className="font-semibold text-plum-deep">"Oxford of Karnataka,"</strong> Dharwad has earned a distinguished reputation for its academic institutions, literary heritage, and cultural richness. The city is also globally known for its <strong className="font-semibold text-plum-deep">GI-tagged Dharwad Peda</strong>, a traditional sweet that has become synonymous with the region.
                </p>
                <p>
                  The Hubballi–Dharwad Municipal Corporation is the second-largest in Karnataka after Bengaluru, covering over 202 square kilometres across 67 wards. Hubballi is a major commercial, industrial and transport hub; Dharwad is the academic and cultural heart of the region.
                </p>
                <p>
                  The name "Dharwad" comes from the Sanskrit <em>Dwarawata</em>: <em>dwara</em>, "door", and <em>wata</em>, "town". For centuries Dharwad was the gateway between the lush Malenadu (Western Ghats) and the fertile Bayalu Seeme (plains), a resting place for traders and travellers.
                </p>
                <p>
                  Dharwad has a strong agricultural heritage and is home to the University of Agricultural Sciences, Dharwad, which developed the renowned Dharwad Cotton Hybrid (DCH). Complementing its academic excellence, Dharwad has emerged as an important industrial destination. The region hosts a manufacturing facility of Tata Motors, one of India's leading automobile manufacturers.
                </p>
              </div>
            </article>

            <article>
              <h3 className="text-2xl font-medium text-plum-deep">About Karnataka</h3>
              <div className="mt-4 prose-copy text-[1.02rem] text-body">
                <p>
                  Karnataka, located in southern India, is one of the country's most progressive and diverse states. It is the <strong className="font-semibold text-plum-deep">largest state in South India</strong> and the <strong className="font-semibold text-plum-deep">sixth-largest state in India by area</strong>. The state shares its borders with the Arabian Sea to the west, Goa and Maharashtra to the north, Telangana and Andhra Pradesh to the east, and Tamil Nadu and Kerala to the south.
                </p>
                <p>
                  The state capital, <strong className="font-semibold text-plum-deep">Bengaluru (Bangalore)</strong>, is internationally renowned as <strong className="font-semibold text-plum-deep">India's Silicon Valley</strong> and is one of the world's leading technology and innovation hubs.
                </p>
                <p>
                  Karnataka offers an exceptional blend of history, culture, nature, and modern development. The state is home to UNESCO World Heritage Sites such as <strong className="font-semibold text-plum-deep">Hampi</strong> and the <strong className="font-semibold text-plum-deep">Sacred Ensembles of the Hoysalas</strong>, magnificent temples at Belur, Halebidu, and Somanathapura, the royal heritage of Mysuru, the scenic Western Ghats, and the pristine beaches of Gokarna, Udupi, and Karwar along the Arabian Sea.
                </p>
                <p>
                  The state is also celebrated for Yakshagana, Dollu Kunitha, Veeragase and Carnatic music, along with its festivals, diverse cuisine and renowned hospitality.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Getting here */}
      <section aria-labelledby="getting-here" className="bg-ink-deep text-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="getting-here" className="text-3xl md:text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em]">Getting to IIT Dharwad</h2>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-4">
            {DISTANCES.map(([place, km]) => (
              <div key={place} className="bg-ink-deep p-6">
                <dt className="text-sm text-white/60">To {place}</dt>
                <dd className="mt-1 font-heading! text-3xl md:text-4xl nums-tabular">{km}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-white/50">Approximate distances by road.</p>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {CONNECTIVITY.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon size={26} aria-hidden="true" className="text-saffron" />
                <h3 className="mt-3 text-xl font-medium">{title}</h3>
                <p className="mt-2 text-white/70 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Campus */}
      <section className="bg-white border-b border-mist py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <SectionHeader
              title="About Campus"
              subtitle="State-of-the-art infrastructure in a serene environment"
            />
            <div className="prose-copy text-[1.02rem] text-body">
              <p>
                The Indian Institute of Technology Dharwad (IIT Dharwad) is located on a modern, fully residential campus designed to provide an excellent environment for learning, research, innovation, and campus life. Surrounded by the natural beauty of Karnataka, the campus combines state-of-the-art infrastructure with open green spaces, creating a vibrant and welcoming atmosphere for students, faculty, researchers, and visitors from around the world.
              </p>
              <p>
                The campus features well-equipped academic buildings, advanced teaching and research laboratories, modern classrooms, a central library, innovation and incubation facilities, student hostels, faculty and staff residences, sports and recreation facilities, healthcare services, banking and ATM facilities, dining halls, and convenience stores. High-speed Wi-Fi connectivity is available across the campus.
              </p>
              <p>
                As a fully residential campus, IIT Dharwad promotes a close-knit academic community where students and faculty interact beyond the classroom through research, innovation, cultural activities, sports, technical clubs, and community events. Round-the-clock security, well-maintained residences and a peaceful setting make it a welcoming place for students from every background.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <PhotoFrame src="/institute/Institute3.jpg" alt="IIT Dharwad campus" className="aspect-[4/3] w-full max-w-[28rem]" />
          </div>
        </div>
      </section>

      {/* Hostel Life */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Hostel Life"
            subtitle="Comfortable and safe living spaces"
          />
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 prose-copy text-[1.02rem] text-body">
              <p>
                As a fully residential institute, IIT Dharwad provides on-campus accommodation for all students, fostering a vibrant, inclusive, and collaborative learning environment. <strong className="font-semibold text-plum-deep">All students, including international students, are mandatorily accommodated in the campus hostels.</strong>
              </p>
              <p>
                The Institute currently has two hostel complexes, <strong className="font-semibold text-plum-deep">Hostel Block I and Hostel Block II</strong>, equipped with modern amenities to ensure a comfortable living experience. Separate accommodation is provided for female students, with dedicated hostel sections designed to ensure privacy, comfort, and security.
              </p>
              <p>
                The hostels are maintained to high standards of cleanliness and are supported by Wi-Fi connectivity, common rooms, laundry services, recreational spaces, and dining facilities, with 24×7 security surveillance, controlled access to hostel premises, and round-the-clock support for students.
              </p>
              <p>
                <a href="https://studentswelfare.iitdh.ac.in/hostels" target="_blank" rel="noopener noreferrer" className={externalLink}>
                  Visit IIT Dharwad Hostels Portal <RiExternalLinkLine size={16} aria-label="opens in a new tab" />
                </a>
              </p>
            </div>
            <aside className="lg:col-span-5 space-y-4 self-start">
              <div className="rounded-2xl bg-plum p-7 text-white">
                <p className="font-heading! text-2xl leading-snug">International students get individual, single-occupancy rooms.</p>
                <p className="mt-3 text-white/75">For privacy, comfort, and a good environment for study and research.</p>
              </div>
              <ul className="divide-y divide-mist rounded-2xl border border-mist bg-white px-6 text-[0.95rem]">
                {['24×7 security surveillance', 'Wi-Fi across the hostels', 'Common rooms and recreational spaces', 'Laundry services', 'Separate sections for women students'].map((item) => (
                  <li key={item} className="py-3 text-body">{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* Dining & Food Facilities */}
      <section className="bg-white border-t border-mist py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Dining & Food Facilities"
            subtitle="Diverse culinary options for all preferences"
          />
          <div className="grid gap-6 md:grid-cols-3">
            <article className="flex flex-col rounded-2xl border border-mist p-7">
              <h3 className="text-2xl font-medium text-plum-deep">Mess Block</h3>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-body">
                Spacious dining halls and a modern mechanised kitchen, run by professional catering providers. Nutritious, hygienically prepared meals, with <strong className="font-semibold text-plum-deep">vegetarian and multi-cuisine options across three dining halls</strong>.
              </p>
              <a href="https://studentswelfare.iitdh.ac.in/mess_canteen" target="_blank" rel="noopener noreferrer" className={`${externalLink} mt-6`}>
                Explore Mess & Canteen Facilities <RiExternalLinkLine size={16} aria-label="opens in a new tab" />
              </a>
            </article>

            <article className="flex flex-col rounded-2xl bg-saffron-tint p-7 ring-1 ring-inset ring-saffron/30">
              <h3 className="text-2xl font-medium text-plum-deep">Shared kitchen for international students</h3>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-body">
                Recognizing the diverse culinary preferences of its international community, IIT Dharwad provides a <strong className="font-semibold text-plum-deep">shared kitchen facility</strong> where international students can prepare their own meals. Cook familiar dishes from home, and keep to specific dietary, cultural or religious requirements.
              </p>
            </article>

            <article className="flex flex-col rounded-2xl border border-mist p-7">
              <h3 className="text-2xl font-medium text-plum-deep">Campus canteen</h3>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-body">
                Open until late at night, with snacks, beverages and light meals.
              </p>
              <a href="https://studentswelfare.iitdh.ac.in/mess_canteen" target="_blank" rel="noopener noreferrer" className={`${externalLink} mt-6`}>
                View Canteen & Dining Details <RiExternalLinkLine size={16} aria-label="opens in a new tab" />
              </a>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
