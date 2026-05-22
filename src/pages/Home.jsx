import { motion } from "framer-motion"
import CTAButton from "../components/ui/CTAButton"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export default function Home() {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pb-24"
    >
        <section className="relative min-h-[70vh] flex flex-col justify-center bg-gradient-to-b from-brand-purpleLight/45 via-neutral-canvas to-neutral-canvas text-brand-purpleDark py-20 overflow-hidden border-b border-brand-purpleLight/70">
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="geom" patternUnits="userSpaceOnUse" width="100" height="100">
                <path d="M 0 100 L 100 0 M -25 25 L 25 -25 M 75 125 L 125 75" stroke="#89288F" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#geom)" />
            </svg>
        </div>
        <div className="container mx-auto max-w-7xl px-6 z-10 text-center">
          <motion.p variants={itemVariants} className="text-brand-marigold font-semibold tracking-widest uppercase mb-4 text-sm">Globally Connected &bull; Locally Rooted</motion.p>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">International Relations Office</motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-brand-purpleDark/75 max-w-3xl mx-auto mb-12">The core campus framework for global research, collaborative innovation, and cross-border student-faculty exchanges.</motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6">
            <CTAButton to="/collaboration" label="For Inbound Scholars" className="bg-brand-marigold text-brand-purpleDark font-bold hover:bg-brand-marigoldDark" />
            <CTAButton to="/collaboration" label="For Outgoing IITDH Cohort" className="bg-white text-brand-purpleDark border border-brand-purpleLight font-bold hover:bg-brand-purpleLight/35" />
            </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-brand-purpleDark text-white border-y border-white">
          <div className="container mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-white">
              <motion.div variants={itemVariants} className="pt-6 md:pt-0">
                  <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">77</h3>
                  <p className="text-sm uppercase tracking-wider font-semibold opacity-90">NIRF Engineering Rank</p>
              </motion.div>
              <motion.div variants={itemVariants} className="pt-6 md:pt-0">
                  <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">500+</h3>
                  <p className="text-sm uppercase tracking-wider font-semibold opacity-90">Acre Permanent Green Campus</p>
              </motion.div>
              <motion.div variants={itemVariants} className="pt-6 md:pt-0">
                  <h3 className="text-5xl font-extrabold mb-2 text-brand-marigold">2016</h3>
                  <p className="text-sm uppercase tracking-wider font-semibold opacity-90">Est. (Mentored by IIT Bombay)</p>
              </motion.div>
          </div>
      </section>

      {/* Messages */}
      <section className="py-24 bg-neutral-canvas">
          <div className="container mx-auto max-w-7xl px-6">
              <h2 className="text-3xl font-bold text-center text-neutral-textDark mb-16">Leadership Insights</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-purpleLight/70 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-brand-purpleLight/60 rounded-full flex-shrink-0 flex items-center justify-center text-brand-purpleDark text-sm font-bold">DIR</div>
                      <div>
                          <h3 className="text-xl font-bold text-brand-purple mb-1">Prof. Venkappayya R. Desai</h3>
                          <p className="text-sm text-brand-marigoldDark font-semibold mb-4">Director, IIT Dharwad</p>
                          <p className="text-neutral-textDark/80 text-sm leading-relaxed">"Our vision is to build a vibrant global ecosystem where knowledge knows no borders. The IRO bridges our campus with the world's leading minds."</p>
                      </div>
                  </motion.div>
              <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-purpleLight/70 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-brand-purpleLight/60 rounded-full flex-shrink-0 flex items-center justify-center text-brand-purpleDark text-sm font-bold">REG</div>
                      <div>
                          <h3 className="text-xl font-bold text-brand-purple mb-1">Shri Sandeep Karmakar</h3>
                          <p className="text-sm text-brand-marigoldDark font-semibold mb-4">Registrar, IIT Dharwad</p>
                          <p className="text-neutral-textDark/80 text-sm leading-relaxed">"We are committed to providing seamless administrative support for our international visitors, ensuring a comfortable and enriching stay."</p>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>
    </motion.div>
  )
}

