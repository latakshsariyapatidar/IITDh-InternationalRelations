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
