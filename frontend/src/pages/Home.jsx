import { useEffect, useState } from "react";
import CTAButton from "../components/ui/CTAButton";
import apiClient from "../api/client";

export default function Home() {
  const slideshowImages = [
    "/institute/Institute1.jpg",
    "/institute/Institute2.jpg",
    "/institute/Institute3.jpg",
    "/institute/Institute4.jpg",
    "/institute/Institute5.jpg",
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [slideshowImages.length]);

  return (
    <div className="pb-24">
      <section className="relative min-h-[70vh] flex flex-col justify-center text-brand-purpleDark py-20 overflow-hidden border-b border-brand-purpleLight/70">
        <div className="absolute inset-0 z-0">
          {slideshowImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 z-1 bg-linear-to-b from-brand-purpleLight/20 via-neutral-canvas/80 to-neutral-canvas" />
        <div className="container mx-auto max-w-7xl px-6 z-10 text-center">
          <p className="text-brand-marigold font-semibold tracking-widest uppercase mb-4 text-sm">
            Globally Connected &bull; Locally Rooted
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            International Relations Office
          </h1>
          <p className="text-xl text-brand-purpleDark/75 max-w-3xl mx-auto mb-12">
            The core campus framework for global research, collaborative
            innovation, and cross-border student-faculty exchanges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <CTAButton
              to="/collaboration"
              label="For Inbound Scholars"
              className="bg-brand-marigold text-brand-purpleDark font-bold hover:bg-brand-marigoldDark"
            />
            <CTAButton
              to="/collaboration"
              label="For Outgoing IITDH Cohort"
              className="bg-white text-brand-purpleDark border border-brand-purpleLight font-bold hover:bg-brand-purpleLight/35"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-brand-purpleDark text-white border-y border-white">
        <div className="container mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-white">
          <div className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              77
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              NIRF Engineering Rank
            </p>
          </div>
          <div className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              500+
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              Acre Permanent Green Campus
            </p>
          </div>
          <div className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              2016
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              Est. (Mentored by IIT Bombay)
            </p>
          </div>
        </div>
      </section>



      {/* Director's Message */}
      <section className="py-24 bg-neutral-canvas">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-textDark mb-3">
              Directors message to the international community
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-purpleLight/70 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
              <div className="relative w-24 h-24 overflow-hidden object-center bg-brand-purpleLight/60 rounded-full shrink-0 flex items-center justify-center text-brand-purpleDark text-sm font-bold">
                <img
                  src="/director/director.JPG"
                  alt="Director of IIT Dharwad"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-sm text-brand-marigoldDark font-semibold mb-4">
                  Director<br/>
                  Indian Institute of Technology Dharwad
                </p>
                <div className="text-neutral-textDark/80 text-sm leading-relaxed space-y-4">
                  <p>Dear International Students/Academicians,</p>
                  <p>It gives me great pleasure to welcome you to IIT Dharwad.</p>
                  <p>As a growing Institute of National Importance, IIT Dharwad is committed to excellence in education, research, and innovation, with a strong and expanding global outlook. Our International Relations Office plays a pivotal role in building meaningful academic partnerships and fostering vibrant cross-cultural engagement.</p>
                  <p>Located in Dharwad, Karnataka, the Institute offers an intellectually stimulating and culturally enriching environment. We believe that international collaboration strengthens our academic ecosystem and brings valuable global perspectives to our campus.</p>
                  <p>We look forward to welcoming students, scholars, and partners from across the world to be part of the IIT Dharwad community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-textDark mb-3">
              Opportunities
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-canvas p-8 rounded-2xl border border-brand-purpleLight/60 shadow-sm">
              <h3 className="text-2xl font-bold text-brand-purpleDark mb-4">
                IITDH Students:
              </h3>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-brand-marigoldDark mb-2">SCHOLARSHIPS</h4>
                <p className="text-sm text-neutral-textDark/80">
                  <strong>Name of the program:</strong> INSPIRE FELLOWSHIPS<br/>
                  <strong>Program details:</strong> .
                </p>
              </div>
            </div>
            <div className="bg-neutral-canvas p-8 rounded-2xl border border-brand-purpleLight/60 shadow-sm">
              <h3 className="text-2xl font-bold text-brand-purpleDark mb-4">
                IITDH Faculty Programs:
              </h3>
              <h4 className="text-lg font-bold text-brand-marigoldDark mb-2">FUNDING</h4>
              <div className="space-y-4 text-sm text-neutral-textDark/80">
                <p><strong>1) Name of the program:</strong> India–Japan Cooperative Science Programme (IJCSP)</p>
                <p><strong>Program details:</strong> IJCSP is a bilateral initiative that supports collaborative research projects between Indian and Japanese researchers in frontier areas of science and technology.</p>
                <p>The programme provides an excellent opportunity to strengthen research partnerships with Japanese institutions, facilitate faculty exchanges, promote joint research activities, and enhance international research visibility.</p>
                <p>Faculty members who already have collaborators in Japan, or those interested in establishing research partnerships with Japanese universities and research institutions, are strongly encouraged to explore this opportunity and submit proposals.</p>
                <p>Some of the key objectives of the programme include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Promotion of collaborative research between Indian and Japanese scientists.</li>
                  <li>Exchange visits of researchers and faculty members.</li>
                  <li>Development of long-term institutional and research partnerships.</li>
                  <li>Strengthening international research networks and capacity building.</li>
                </ul>
                <p>Interested faculty members are requested to review the programme guidelines and eligibility criteria and consider submitting applications within the stipulated deadline.</p>
                <p>This programme aligns well with IIT Dharwad’s efforts to expand international research collaborations and enhance engagement with leading institutions in Japan.</p>
                <hr className="border-brand-purpleLight/50 my-4" />
                <p>The Department of Science & Technology (fDST), Government of India, and the Japan Society for the Promotion of Science (JSPS) invite proposals for:</p>
                <p><strong>Who Can Apply?</strong><br/>Eligible Indian researchers and scientists</p>
                <p><strong>Priority Research Areas</strong><br/>
                1. Physical Sciences<br/>
                2. Chemical Sciences<br/>
                3. Life Sciences & Agriculture<br/>
                4. Mathematics & Computational Science<br/>
                5. Astronomy & Earth Sciences<br/>
                6. Materials Science & Engineering
                </p>
                <p className="bg-yellow-200 text-yellow-900 font-bold p-2 rounded inline-block">Last Date for Proposal Submission: September 3, 2026</p>
                <p>For details and applications: <a href="http://www.onlinedst.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.onlinedst.gov.in</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IITDH Video */}
      <section className="py-20 bg-neutral-canvas">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-textDark mb-3">
              IIT Dharwad
            </h2>
            <p className="text-neutral-textDark/70 max-w-2xl mx-auto">
              A quick look at campus.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-purpleLight/70 bg-brand-purpleLight/30 aspect-video flex items-center justify-center">
            <iframe
              src="https://www.youtube.com/embed/gPA85GPmEwk"
              title="IIT Dharwad"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-2xl"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
