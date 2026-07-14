import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";

async function main() {
  console.log("[SEED] Starting...");

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ?? "changeme_in_production";
  const adminHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: "admin@iitdh.ac.in" },
    update: { passwordHash: adminHash },
    create: { email: "admin@iitdh.ac.in", passwordHash: adminHash },
  });
  console.log("[SEED] ✓ Admin");

  // ── Contacts ───────────────────────────────────────────────────────────────
  const contacts = [
    {
      type: "CHAIRPERSON" as const,
      name: "Dr. Rajesh Kumar",
      title: "Chairperson – International Collaboration",
      email: "r.kumar@iitdh.ac.in",
      phone: "+91-8364-241-113",
      address: "International Relations Office, IITDH, Dharwad - 580011",
    },
    {
      type: "IRO_OFFICE" as const,
      name: undefined,
      title: "Office of International Relations",
      email: "iro@iitdh.ac.in",
      phone: "+91-8364-241-200",
      address: "Building 2, IITDH Campus, Dharwad - 580011",
    },
    {
      type: "MOBILITY" as const,
      name: "Dr. Priya Singh",
      title: "International Mobility – Students",
      email: "mobility@iitdh.ac.in",
      phone: "+91-8364-241-214",
      address: undefined,
    },
    {
      type: "ADMISSION" as const,
      name: "Ms. Sneha Patel",
      title: "International Admission",
      email: "international@iitdh.ac.in",
      phone: "+91-8364-241-215",
      address: undefined,
    },
  ];

  for (const c of contacts) {
    await prisma.contact.upsert({
      where: {
        id:
          (await prisma.contact.findFirst({ where: { type: c.type } }))?.id ??
          "00000000-0000-0000-0000-000000000000",
      },
      update: c,
      create: c,
    });
  }
  console.log("[SEED] ✓ Contacts");

  // ── Faculty ────────────────────────────────────────────────────────────────
  const faculty = [
    {
      name: "Prof. Ramesh Chandra",
      redirectUrl: "https://www.iitdh.ac.in/faculty/ramesh-chandra",
    },
    {
      name: "Prof. Anjali Sharma",
      redirectUrl: "https://www.iitdh.ac.in/faculty/anjali-sharma",
    },
    {
      name: "Prof. Vikram Patel",
      redirectUrl: "https://www.iitdh.ac.in/faculty/vikram-patel",
    },
    {
      name: "Prof. Neha Gupta",
      redirectUrl: "https://www.iitdh.ac.in/faculty/neha-gupta",
    },
    {
      name: "Prof. Arvind Mishra",
      redirectUrl: "https://www.iitdh.ac.in/faculty/arvind-mishra",
    },
  ];

  for (const f of faculty) {
    const existing = await prisma.faculty.findFirst({
      where: { name: f.name },
    });
    if (existing) {
      await prisma.faculty.update({ where: { id: existing.id }, data: f });
    } else {
      await prisma.faculty.create({ data: f });
    }
  }
  console.log("[SEED] ✓ Faculty");

  // ── IRO Team ───────────────────────────────────────────────────────────────
  const team = [
    { name: "Arjun Verma", role: "Coordinator", year: "Senior" },
    { name: "Priya Kapoor", role: "Outreach Lead", year: "Junior" },
    { name: "Aditya Nair", role: "Events Manager", year: "Junior" },
    { name: "Divya Reddy", role: "Communications", year: "Sophomore" },
  ];

  for (const t of team) {
    const existing = await prisma.iROTeamMember.findFirst({
      where: { name: t.name },
    });
    if (existing) {
      await prisma.iROTeamMember.update({
        where: { id: existing.id },
        data: t,
      });
    } else {
      await prisma.iROTeamMember.create({ data: t });
    }
  }
  console.log("[SEED] ✓ IRO Team");

  // ── Partners ───────────────────────────────────────────────────────────────
  const universities = [
    {
      name: "University of Toronto",
      country: "Canada",
      type: "UNIVERSITY" as const,
    },
    { name: "TU Darmstadt", country: "Germany", type: "UNIVERSITY" as const },
    { name: "Osaka University", country: "Japan", type: "UNIVERSITY" as const },
    {
      name: "NTU Singapore",
      country: "Singapore",
      type: "UNIVERSITY" as const,
    },
    {
      name: "University of Melbourne",
      country: "Australia",
      type: "UNIVERSITY" as const,
    },
    { name: "ETH Zurich", country: "Switzerland", type: "UNIVERSITY" as const },
  ];

  const organisations = [
    {
      name: "DAAD",
      country: "Germany",
      type: "ORGANIZATION" as const,
      focus: "Student Mobility",
    },
    {
      name: "British Council",
      country: "United Kingdom",
      type: "ORGANIZATION" as const,
      focus: "Academic Programs",
    },
    {
      name: "Campus France",
      country: "France",
      type: "ORGANIZATION" as const,
      focus: "Research Collaboration",
    },
  ];

  for (const p of [...universities, ...organisations]) {
    const existing = await prisma.partner.findFirst({
      where: { name: p.name },
    });
    if (existing) {
      await prisma.partner.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.partner.create({ data: p });
    }
  }
  console.log("[SEED] ✓ Partners");

  // ── Testimonials ───────────────────────────────────────────────────────────
  const testimonials = [
    {
      name: "Marco Rossi",
      country: "Italy",
      program: "MS in Computer Science",
      text: "My experience at IITDH was transformative. The faculty, facilities, and international environment exceeded my expectations.",
    },
    {
      name: "Yuki Tanaka",
      country: "Japan",
      program: "PhD in Mechanical Engineering",
      text: "The research opportunities and collaborative culture made my academic journey enriching and productive.",
    },
    {
      name: "Sarah Mueller",
      country: "Germany",
      program: "Semester Exchange",
      text: "IITDH provided exceptional support and a welcoming environment for international students. Highly recommended!",
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: t.name },
    });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("[SEED] ✓ Testimonials");

  // ── FAQs ───────────────────────────────────────────────────────────────────
  const faqs = [
    {
      question: "What is the admission timeline for international students?",
      answer:
        "Applications are accepted year-round. Regular admissions are processed in March-April for fall enrollment. Refer to our admissions page for detailed timelines.",
      order: 1,
    },
    {
      question: "What are the visa requirements for studying in India?",
      answer:
        "Student visa (X-category) requires an admission letter, financial documents, and passport. Our office provides complete guidance through the e-FRRO registration process.",
      order: 2,
    },
    {
      question: "Are scholarships available for international students?",
      answer:
        "Yes, we offer merit-based scholarships, ICCR scholarships, and institutional financial aid. Check our opportunities page for details.",
      order: 3,
    },
    {
      question: "What facilities are available on campus?",
      answer:
        "IITDH offers hostel accommodation, dining facilities, sports complexes, medical center, library, and recreational spaces for all students.",
      order: 4,
    },
    {
      question: "How can I exchange abroad as an IITDH student?",
      answer:
        "Our office facilitates semester exchanges, research internships, and study tours. Contact our mobility team for available opportunities.",
      order: 5,
    },
  ];

  for (const f of faqs) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: f.question },
    });
    if (existing) {
      await prisma.fAQ.update({ where: { id: existing.id }, data: f });
    } else {
      await prisma.fAQ.create({ data: f });
    }
  }
  console.log("[SEED] ✓ FAQs");

  // ── Programs ───────────────────────────────────────────────────────────────
  const programs = [
    {
      name: "B.Tech Computer Science",
      level: "UNDERGRADUATE" as const,
      redirectUrl: "https://www.iitdh.ac.in/academics/btech-cse",
    },
    {
      name: "B.Tech Mechanical Engineering",
      level: "UNDERGRADUATE" as const,
      redirectUrl: "https://www.iitdh.ac.in/academics/btech-mech",
    },
    {
      name: "B.Tech Civil Engineering",
      level: "UNDERGRADUATE" as const,
      redirectUrl: "https://www.iitdh.ac.in/academics/btech-civil",
    },
    {
      name: "M.Tech Computer Science",
      level: "POSTGRADUATE" as const,
      redirectUrl: "https://www.iitdh.ac.in/academics/mtech-cse",
    },
    {
      name: "M.Tech Mechanical Engineering",
      level: "POSTGRADUATE" as const,
      redirectUrl: "https://www.iitdh.ac.in/academics/mtech-mech",
    },
    {
      name: "MS Research Programs",
      level: "POSTGRADUATE" as const,
      redirectUrl: "https://www.iitdh.ac.in/academics/ms-research",
    },
    {
      name: "PhD in Engineering",
      level: "PHD" as const,
      redirectUrl: "https://www.iitdh.ac.in/academics/phd-engineering",
    },
    {
      name: "PhD in Science",
      level: "PHD" as const,
      redirectUrl: "https://www.iitdh.ac.in/academics/phd-science",
    },
  ];

  for (const p of programs) {
    const existing = await prisma.program.findFirst({
      where: { name: p.name },
    });
    if (existing) {
      await prisma.program.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.program.create({ data: p });
    }
  }
  console.log("[SEED] ✓ Programs");

  // ── Site Content ───────────────────────────────────────────────────────────
  const siteContent = [
    {
      key: "site.logoUrl",
      label: "Site Logo",
      page: "global",
      type: "IMAGE" as const,
      value: "/IITDh logo white.svg",
    },

    {
      key: "home.hero.tagline",
      label: "Homepage Hero Tagline",
      page: "home",
      type: "TEXT" as const,
      value: "Globally Connected • Locally Rooted",
    },
    {
      key: "home.hero.title",
      label: "Homepage Hero Title",
      page: "home",
      type: "TEXT" as const,
      value: "International Relations Office",
    },
    {
      key: "home.hero.subtitle",
      label: "Homepage Hero Subtitle",
      page: "home",
      type: "RICH_TEXT" as const,
      value:
        "The core campus framework for global research, collaborative innovation, and cross-border student-faculty exchanges.",
    },

    {
      key: "home.stats.stat1Number",
      label: "Stat 1 Number",
      page: "home",
      type: "NUMBER" as const,
      value: "77",
    },
    {
      key: "home.stats.stat1Label",
      label: "Stat 1 Label",
      page: "home",
      type: "TEXT" as const,
      value: "NIRF Engineering Rank",
    },
    {
      key: "home.stats.stat2Number",
      label: "Stat 2 Number",
      page: "home",
      type: "NUMBER" as const,
      value: "500+",
    },
    {
      key: "home.stats.stat2Label",
      label: "Stat 2 Label",
      page: "home",
      type: "TEXT" as const,
      value: "Acre Permanent Green Campus",
    },
    {
      key: "home.stats.stat3Number",
      label: "Stat 3 Number",
      page: "home",
      type: "NUMBER" as const,
      value: "2016",
    },
    {
      key: "home.stats.stat3Label",
      label: "Stat 3 Label",
      page: "home",
      type: "TEXT" as const,
      value: "Est. (Mentored by IIT Bombay)",
    },

    {
      key: "home.leadership.directorName",
      label: "Director Name",
      page: "home",
      type: "TEXT" as const,
      value: "Prof. Venkappayya R. Desai",
    },
    {
      key: "home.leadership.directorTitle",
      label: "Director Title",
      page: "home",
      type: "TEXT" as const,
      value: "Director, IIT Dharwad",
    },
    // directorQuote demonstrates the RICH_TEXT paragraph contract (Part 31.2):
    // every paragraph lives in this one string, separated by a blank line
    // ("\n\n"). The frontend splits on that and renders one <p> per piece, so
    // a future edit that collapses this to two paragraphs — or expands it to
    // eight — needs no key changes and no schema changes, just a new value.
    {
      key: "home.leadership.directorQuote",
      label: "Director's Welcome Message (Homepage)",
      page: "home",
      type: "RICH_TEXT" as const,
      value:
        "Dear International Students/Academicians,\n\n" +
        "It gives me great pleasure to welcome you to IIT Dharwad.\n\n" +
        "As a growing Institute of National Importance, IIT Dharwad is committed to excellence in education, research, and innovation, with a strong and expanding global outlook. Our International Relations Office plays a pivotal role in building meaningful academic partnerships and fostering vibrant cross-cultural engagement.\n\n" +
        "Located in Dharwad, Karnataka, the Institute offers an intellectually stimulating and culturally enriching environment. We believe that international collaboration strengthens our academic ecosystem and brings valuable global perspectives to our campus.\n\n" +
        "We look forward to welcoming students, scholars, and partners from across the world to be part of the IIT Dharwad community.",
    },
    {
      key: "home.leadership.registrarName",
      label: "Registrar Name",
      page: "home",
      type: "TEXT" as const,
      value: "Shri Sandeep Karmakar",
    },
    {
      key: "home.leadership.registrarTitle",
      label: "Registrar Title",
      page: "home",
      type: "TEXT" as const,
      value: "Registrar, IIT Dharwad",
    },
    {
      key: "home.leadership.registrarQuote",
      label: "Registrar Quote",
      page: "home",
      type: "RICH_TEXT" as const,
      value:
        "We are committed to providing seamless administrative support for our international visitors, ensuring a comfortable and enriching stay.",
    },

    {
      key: "footer.tagline",
      label: "Footer Tagline",
      page: "footer",
      type: "TEXT" as const,
      value:
        "International Relations Office - Your gateway to global opportunities at IIT Dharwad",
    },
    {
      key: "footer.phone",
      label: "Footer Phone Number",
      page: "footer",
      type: "TEXT" as const,
      value: "+91-836-XXXXXXX",
    },
    {
      key: "footer.copyrightText",
      label: "Footer Copyright Line",
      page: "footer",
      type: "TEXT" as const,
      value:
        "© 2026 International Relations Office, IIT Dharwad. All rights reserved.",
    },

    {
      key: "admission.facts.mous",
      label: "Admission Key Fact — MOUs",
      page: "admission",
      type: "TEXT" as const,
      value: "50+",
    },
    {
      key: "admission.facts.countries",
      label: "Admission Key Fact — Countries",
      page: "admission",
      type: "TEXT" as const,
      value: "25+",
    },
    {
      key: "admission.facts.faculty",
      label: "Admission Key Fact — Faculty",
      page: "admission",
      type: "TEXT" as const,
      value: "500+",
    },
    {
      key: "admission.facts.students",
      label: "Admission Key Fact — Students",
      page: "admission",
      type: "TEXT" as const,
      value: "10K+",
    },
  ];

  for (const c of siteContent) {
    await prisma.siteContent.upsert({
      where: { key: c.key },
      update: c,
      create: c,
    });
  }
  console.log("[SEED] ✓ Site Content");

  // ── Student Application (fictional demo data) ────────────────────────────
  const existingDemoApplication = await prisma.studentApplication.findFirst({
    where: { email: "demo.applicant@example.com" },
  });

  if (!existingDemoApplication) {
    await prisma.studentApplication.create({
      data: {
        firstName: "Demo",
        lastName: "Applicant",
        dateOfBirth: new Date("2002-03-10"),
        gender: "OTHER",
        nationality: "Fictional Country",
        countryOfResidence: "Fictional Country",
        passportNumber: "X0000000",
        passportExpiryDate: new Date("2031-01-01"),
        email: "demo.applicant@example.com",
        phone: "+00-000-000-0000",
        currentAddress: "123 Demo Street, Fictional City",
        emergencyContactName: "Demo Guardian",
        emergencyContactPhone: "+00-000-000-0001",
        programLevel: "POSTGRADUATE",
        programAppliedFor: "M.Tech Computer Science",
        intendedIntake: "Fall 2026",
        highestQualification: "Bachelor's Degree",
        previousInstitution: "Demo University",
        previousGradeOrGPA: "9.0/10",
        englishTestType: "IELTS",
        englishTestScore: "7.5",
        requiresVisaSponsorship: true,
        status: "SUBMITTED",
      },
    });
  }
  console.log("[SEED] ✓ Demo student application");

  console.log("[SEED] Done.");
}

main()
  .catch((e) => {
    console.error("[SEED] Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
