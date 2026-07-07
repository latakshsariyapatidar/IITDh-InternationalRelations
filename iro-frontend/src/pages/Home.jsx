import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/ui/CTAButton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pb-24"
    >
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
          <motion.p
            variants={itemVariants}
            className="text-brand-marigold font-semibold tracking-widest uppercase mb-4 text-sm"
          >
            Globally Connected &bull; Locally Rooted
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            International Relations Office
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-brand-purpleDark/75 max-w-3xl mx-auto mb-12"
          >
            The core campus framework for global research, collaborative
            innovation, and cross-border student-faculty exchanges.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
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
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-brand-purpleDark text-white border-y border-white">
        <div className="container mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-white">
          <motion.div variants={itemVariants} className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              77
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              NIRF Engineering Rank
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              500+
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              Acre Permanent Green Campus
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="pt-6 md:pt-0">
            <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">
              2016
            </h3>
            <p className="text-sm uppercase tracking-wider font-semibold opacity-90">
              Est. (Mentored by IIT Bombay)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Director's Message */}
      <section className="py-24 bg-neutral-canvas">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-textDark mb-3">
              Director's Message
            </h2>
            <p className="text-neutral-textDark/70 max-w-2xl mx-auto">
              For the international community at IIT Dharwad
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-brand-purpleLight/70 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow"
            >
              <div className="relative w-24 h-24 overflow-hidden object-center bg-brand-purpleLight/60 rounded-full shrink-0 flex items-center justify-center text-brand-purpleDark text-sm font-bold">
                <img
                  src="/director/director.JPG"
                  alt="Director of IIT Dharwad"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-brand-purple mb-1">
                  Prof. Venkappayya R. Desai
                </h3>
                <p className="text-sm text-brand-marigoldDark font-semibold mb-4">
                  Director, IIT Dharwad
                </p>
                <p className="text-neutral-textDark/80 text-sm leading-relaxed">
                  "We welcome international learners, researchers, and partners
                  to join IIT Dharwad in building knowledge without borders and
                  creating lasting global impact."
                </p>
              </div>
            </motion.div>
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
            <p className="text-neutral-textDark/70 max-w-2xl mx-auto">
              Pathways for students and faculty to engage globally with IIT
              Dharwad.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={itemVariants}
              className="bg-neutral-canvas p-8 rounded-2xl border border-brand-purpleLight/60 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-brand-purpleDark mb-4">
                Students
              </h3>
              <ul className="list-disc list-inside space-y-3 text-sm text-neutral-textDark/80">
                <li>International admissions and degree pathways</li>
                <li>Semester exchange and short-term mobility</li>
                <li>Research internships with IITDH faculty</li>
                <li>Campus life support and cultural integration</li>
              </ul>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-neutral-canvas p-8 rounded-2xl border border-brand-purpleLight/60 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-brand-purpleDark mb-4">
                Faculty
              </h3>
              <ul className="list-disc list-inside space-y-3 text-sm text-neutral-textDark/80">
                <li>Joint research and funded collaboration programs</li>
                <li>Visiting professorships and lecture series</li>
                <li>Institutional MoUs and strategic partnerships</li>
                <li>International conferences and knowledge exchange</li>
              </ul>
            </motion.div>
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
          {/* <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-brand-purpleLight/70 bg-brand-purpleLight/30 aspect-video flex items-center justify-center"
          >
            <div className="text-center text-brand-purpleDark/70">
              <div className="text-5xl font-bold tracking-widest mb-2">VIDEO</div>
              <p className="text-sm">IIT Dharwad international overview</p>
            </div>
          </motion.div> */}
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
    </motion.div>
  );
}
