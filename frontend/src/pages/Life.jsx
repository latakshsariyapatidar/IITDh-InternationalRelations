import HeroSection from "../components/HeroSection";
import SectionHeader from "../components/ui/SectionHeader";
import Card from "../components/ui/Card";
import { RiExternalLinkLine } from "@remixicon/react";

export default function Life() {
  return (
    <div>
      <HeroSection
        title="Life at IIT Dharwad"
        subtitle="Experience vibrant campus life in scenic Dharwad"
      />

      {/* About Dharwad and Karnataka */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="About Dharwad and Karnataka"
          subtitle="A vibrant blend of knowledge, culture, heritage and opportunity"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">About Dharwad</h3>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm">
              Located in northwestern Karnataka, Dharwad is a vibrant educational, cultural, and administrative centre that, together with the neighbouring city of Hubballi, forms the <strong>Hubballi–Dharwad Twin City</strong>. Situated about <strong>430 km northwest of Bengaluru</strong> on National Highway 48, the region enjoys a pleasant climate throughout the year and offers an ideal environment for learning, research, and innovation.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm">
              Often referred to as the <strong>"Oxford of Karnataka,"</strong> Dharwad has earned a distinguished reputation for its academic institutions, literary heritage, and cultural richness. The city is also globally known for its <strong>GI-tagged Dharwad Peda</strong>, a traditional sweet that has become synonymous with the region.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm">
              Dharwad has a strong agricultural heritage and is home to the University of Agricultural Sciences, Dharwad, which developed the renowned Dharwad Cotton Hybrid (DCH). Complementing its academic excellence, Dharwad has emerged as an important industrial destination. The region hosts a manufacturing facility of Tata Motors, one of India's leading automobile manufacturers.
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-brand-purpleDark mb-4">About Karnataka</h3>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm">
              Karnataka, located in southern India, is one of the country's most progressive and diverse states. It is the <strong>largest state in South India</strong> and the <strong>sixth-largest state in India by area</strong>. The state shares its borders with the Arabian Sea to the west, Goa and Maharashtra to the north, Telangana and Andhra Pradesh to the east, and Tamil Nadu and Kerala to the south.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm">
              The state capital, <strong>Bengaluru (Bangalore)</strong>, is internationally renowned as <strong>India's Silicon Valley</strong> and is one of the world's leading technology and innovation hubs.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm">
              Karnataka offers an exceptional blend of <strong>history, culture, nature, and modern development</strong>. The state is home to UNESCO World Heritage Sites such as <strong>Hampi</strong> and the <strong>Sacred Ensembles of the Hoysalas</strong>, magnificent temples at Belur, Halebidu, and Somanathapura, the royal heritage of Mysuru, the scenic Western Ghats, and the pristine beaches of Gokarna, Udupi, and Karwar along the Arabian Sea.
            </p>
          </Card>
        </div>
      </section>

      {/* About Campus */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="About Campus"
            subtitle="State-of-the-art infrastructure in a serene environment"
          />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Indian Institute of Technology Dharwad (IIT Dharwad) is located on a modern, fully residential campus designed to provide an excellent environment for learning, research, innovation, and campus life. Surrounded by the natural beauty of Karnataka, the campus combines state-of-the-art infrastructure with open green spaces, creating a vibrant and welcoming atmosphere for students, faculty, researchers, and visitors from around the world.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The campus features well-equipped academic buildings, advanced teaching and research laboratories, modern classrooms, a central library, innovation and incubation facilities, student hostels, faculty and staff residences, sports and recreation facilities, healthcare services, banking and ATM facilities, dining halls, and convenience stores. High-speed Wi-Fi connectivity is available across the campus, enabling seamless access to digital learning and research resources.
              </p>
              <p className="text-gray-700 leading-relaxed">
                As a fully residential campus, IIT Dharwad promotes a close-knit academic community where students and faculty interact beyond the classroom through research, innovation, cultural activities, sports, technical clubs, and community events.
              </p>
            </div>
            <div className="bg-brand-purpleLight/40 rounded-lg aspect-video overflow-hidden flex items-center justify-center">
              <img src="/institute/Institute3.jpg" alt="IIT Dharwad Campus" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Hostel Life */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Hostel Life"
          subtitle="Comfortable and safe living spaces"
        />
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            As a fully residential institute, IIT Dharwad provides on-campus accommodation for all students, fostering a vibrant, inclusive, and collaborative learning environment. All students, including international students, are mandatorily accommodated in the campus hostels.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Institute currently has two hostel complexes—<strong>Hostel Block I and Hostel Block II</strong>—equipped with modern amenities to ensure a comfortable living experience. Separate accommodation is provided for female students, with dedicated hostel sections designed to ensure privacy, comfort, and security.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            The hostels are maintained to high standards of cleanliness and are supported by essential facilities, including Wi-Fi connectivity, common rooms, laundry services, recreational spaces, and dining facilities. The campus provides a safe and secure environment with <strong>24×7 security surveillance</strong>, controlled access to hostel premises, and round-the-clock support for students. International students are provided <strong>individual (single-occupancy) rooms</strong> to ensure privacy, comfort, and a conducive environment for study and research.
          </p>
          <div>
            <a
              href="https://studentswelfare.iitdh.ac.in/hostels"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple text-white text-sm font-semibold hover:bg-brand-purpleDark shadow-sm transition-all group"
            >
              <span>Visit IIT Dharwad Hostels Portal</span>
              <RiExternalLinkLine size={16} className="text-brand-marigold transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Dining & Food Facilities */}
      <section className="bg-neutral-canvas py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Dining & Food Facilities"
            subtitle="Diverse culinary options for all preferences"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Mess Block</h3>
              <p className="text-gray-700 mb-3 text-sm">
                The hostel complex includes a well-equipped Mess Block with spacious dining halls and a modern mechanized kitchen, managed by professional outsourced catering service providers. Students are served nutritious and hygienically prepared meals in a comfortable dining environment.
              </p>
              <p className="text-gray-700 mb-3 text-sm">
                The Institute offers <strong>both vegetarian and multi-cuisine meal options</strong> across three dining halls, catering to the diverse dietary preferences of the campus community.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a
                  href="https://studentswelfare.iitdh.ac.in/mess_canteen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purpleDark font-semibold text-sm transition-colors group"
                >
                  <span>Explore Mess & Canteen Facilities</span>
                  <RiExternalLinkLine size={16} className="text-brand-marigold transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </Card>
            <Card>
              <h3 className="text-xl font-bold text-brand-purpleDark mb-4">Shared Kitchen & Cafeterias</h3>
              <p className="text-gray-700 mb-3 text-sm">
                Recognizing the diverse culinary preferences of its international community, IIT Dharwad also provides a <strong>shared kitchen facility</strong> where international students can prepare their own meals. This enables students to cook familiar dishes from their home countries and accommodates specific dietary, cultural, or religious requirements.
              </p>
              <p className="text-gray-700 text-sm">
                In addition, a campus canteen remains open until late at night, providing snacks, beverages, and light meals for students.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a
                  href="https://studentswelfare.iitdh.ac.in/mess_canteen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purpleDark font-semibold text-sm transition-colors group"
                >
                  <span>View Canteen & Dining Details</span>
                  <RiExternalLinkLine size={16} className="text-brand-marigold transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
