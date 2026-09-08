import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { toCountryCode } from "../shared/utils/country.js";

async function main() {
  console.log("[SEED] Starting...");

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@iitdh.ac.in";

  if (!adminPassword) {
    throw new Error(
      "[SEED] SEED_ADMIN_PASSWORD is not set. Choose a strong password and put " +
        "it in your .env before seeding — there is deliberately no default.",
    );
  }

  if (adminPassword.length < 12) {
    throw new Error(
      `[SEED] SEED_ADMIN_PASSWORD must be at least 12 characters (got ${adminPassword.length}).`,
    );
  }

  const resetAdminPassword = process.env.SEED_RESET_ADMIN_PASSWORD === "true";
  const adminHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: resetAdminPassword ? { passwordHash: adminHash } : {},
    create: { email: adminEmail, passwordHash: adminHash },
  });
  console.log(
    `[SEED] ✓ Admin (${adminEmail})` +
      (resetAdminPassword ? " — password reset" : " — existing password kept"),
  );

  // ── Contacts ───────────────────────────────────────────────────────────────
  const contacts = [
    {
      type: "CHAIRPERSON" as const,
      name: "Dr. Sagnik Sen",
      title: "Chairperson, International Relations Office",
      email: "chairperson.iro@iitdh.ac.in",
      phone: null,
      address: "Indian Institute of Technology Dharwad",
    },
    {
      type: "ADVISOR" as const,
      name: "Ms. Kavitha G R",
      title: "Advisor, International Relations",
      email: "advisor.iro@iitdh.ac.in",
      phone: "+91 9444536574",
      address: "International Admissions & Inbound Programs, International Relations Office",
    },
    {
      type: "ASSISTANT_REGISTRAR" as const,
      name: "Mr. Arun Verma",
      title: "Assistant Registrar, International Relation Office",
      email: "office.iro@iitdh.ac.in",
      phone: "(+91)8193814275 / 7017304843",
      address: null,
    },
    {
      type: "IRO_OFFICE" as const,
      name: null,
      title: "Office of International Relations",
      email: "iro@iitdh.ac.in",
      phone: "+91-8364-241-200",
      address: "IITDH Campus, Dharwad - 580011",
    },
    {
      type: "MOBILITY" as const,
      name: "Inbound Coordinator",
      title: "Inbound Coordinator",
      email: "inbound.iro@iitdh.ac.in",
      phone: "9444536574",
      address: null,
    }
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
      name: "Dr. Sagnik Sen",
      email: "chairperson.iro@iitdh.ac.in",
      redirectUrl: "https://www.iitdh.ac.in/faculty/sagnik-sen",
    },
    {
      name: "Prof. Venkappayya R. Desai",
      email: "director@iitdh.ac.in",
      redirectUrl: "https://www.iitdh.ac.in/faculty/director",
    },
    // Keep some original demo ones for functionality
    {
      name: "Prof. Ramesh Chandra",
      email: "ramesh.chandra@iitdh.ac.in",
      redirectUrl: "https://www.iitdh.ac.in/faculty/ramesh-chandra",
    }
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
    { name: "Prajwal N Prasad", role: "IRO Student Head", year: "Student", responsibilities: "1. Oversee the activities of the student body of the IRO\n2. Coordinate between the IR Office and the Heads of all verticals" },
    { name: "Samartha", role: "Outbound head", email: "cs23bt019@iitdh.ac.in", year: "Student", responsibilities: "1. Manage and create the database of scholarships and international programmes\n2. Coordinate with Kavitha ma'am for MoU signing, renewal and outreach" },
    { name: "Nilesh Barandwal", role: "Head – Inbound Programs", email: "cs24mt018@iitdh.ac.in", year: "Student", responsibilities: "* Selection and management of buddies\n* Coordinating with IRO Head and IRO office for inbound activities\n* Organizing events and supporting international students" },
    { name: "Ishabh Janjuha", role: "Management Head", email: "me23bt006@iitdh.ac.in", year: "Student", responsibilities: "i) Selection of various domains of the management team.\nii) Guiding the team for various events /publicity, and design tasks." },
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

  // ── Partners & MoUs ────────────────────────────────────────────────────────
  const partnersData = [
    {
      name: "University of New Brunswick",
      country: "Canada",
      type: "UNIVERSITY" as const,
      championName: "Prof Rajeswara Rao M / Prof Ruma Ghosh",
      mouSigned: new Date("2024-02-01"),
      mouExpiry: new Date("2029-02-01"),
      particulars: "Exchange programs, Research Collaboration"
    },
    {
      name: "University of Saskatchewan",
      country: "Canada",
      type: "UNIVERSITY" as const,
      championName: "Prof Neelkamal and Prof Sridevi",
      mouSigned: new Date("2020-09-02"),
      mouExpiry: new Date("2025-09-01"),
      particulars: "Exchange programs, Research Collaboration"
    },
    {
      name: "Carleton University",
      country: "Canada",
      type: "UNIVERSITY" as const,
      championName: "Prof Rajshekhar Bhat",
      mouSigned: new Date("2023-02-02"),
      mouExpiry: new Date("2028-02-01"),
      particulars: "Exchange programs, Research Collaboration"
    },
    {
      name: "École de technologie supérieure (ÉTS)",
      country: "Canada",
      type: "UNIVERSITY" as const,
      championName: "Prof. Pratyasa Bhui, Prof S R M Prasanna",
      mouSigned: new Date("2023-02-02"),
      mouExpiry: new Date("2028-02-01"),
      particulars: "Exchange programs, Research Collaboration"
    },
    {
      name: "Centre national de la recherche scientifique (CNRS)",
      country: "France",
      type: "ORGANIZATION" as const,
      championName: "Prof. Vigneshwara Raja",
      mouSigned: new Date("2023-07-24"),
      mouExpiry: new Date("2028-07-23"),
      particulars: "Exchange programs, International cooperation"
    },
    {
      name: "ROMA, TRE",
      country: "Italy",
      type: "UNIVERSITY" as const,
      championName: "Prof. Satish Naik",
      mouSigned: new Date("2023-01-11"),
      mouExpiry: new Date("2028-01-10"),
      particulars: "Exchange programs, Research Collaboration"
    },
    {
      name: "University of Agder",
      country: "Norway",
      type: "UNIVERSITY" as const,
      championName: "Prof Rajesh Hegde",
      mouSigned: new Date("2023-06-02"),
      mouExpiry: new Date("2028-06-01"),
      particulars: "Exchange programs, Research Collaboration"
    },
    {
      name: "Norwegian University of Science and Technology (NTNU)",
      country: "Norway",
      type: "UNIVERSITY" as const,
      championName: "Dr. Dileep A D",
      mouSigned: new Date("2025-11-04"),
      mouExpiry: new Date("2029-11-03"),
      particulars: "Exchange programs, Research Collaboration"
    },
    {
      name: "National Cheng Kung University",
      country: "Taiwan",
      type: "UNIVERSITY" as const,
      championName: "Prof Naveen Kadayinti & Bharat B N",
      mouSigned: new Date("2021-04-08"),
      mouExpiry: new Date("2026-04-07"),
      particulars: "Departmental Agreement, Exchange programs, Research Collaboration"
    },
    {
      name: "Consortium of Finnish Universities",
      country: "Finland",
      type: "CONSORTIUM" as const,
      championName: "Prof Rakesh Lingam",
      mouSigned: new Date("2021-09-22"),
      mouExpiry: new Date("2026-09-21"),
      particulars: "Consortium MoU"
    },
    {
      name: "TU9 German Universities of Technology e. V. (DAAD)",
      country: "Germany",
      type: "NETWORK" as const,
      championName: "Prof Rajshekhar Bhat",
      mouSigned: new Date("2019-03-20"),
      mouExpiry: new Date("2022-07-01"),
      particulars: "Consortium MoU"
    },
    {
      name: "Indo French Network ENSI Poitiers-IITs",
      country: "France",
      type: "NETWORK" as const,
      championName: "",
      mouSigned: new Date("2022-03-08"),
      mouExpiry: new Date("2027-03-08"),
      particulars: "Consortium MoU"
    }
  ];

  for (const partner of partnersData) {
    const p = { 
      name: partner.name,
      country: partner.country,
      type: partner.type,
      championName: partner.championName,
      countryCode: toCountryCode(partner.country) 
    };
    
    let dbPartner = await prisma.partner.findFirst({
      where: { name: p.name },
    });
    
    if (dbPartner) {
      dbPartner = await prisma.partner.update({ where: { id: dbPartner.id }, data: p });
    } else {
      dbPartner = await prisma.partner.create({ data: p });
    }

    // Upsert MoU
    await prisma.mou.upsert({
      where: {
        id: (await prisma.mou.findFirst({ where: { partnerId: dbPartner.id, title: partner.particulars } }))?.id ?? "00000000-0000-0000-0000-000000000000"
      },
      update: {
        signedDate: partner.mouSigned,
        expiryDate: partner.mouExpiry,
        scope: partner.particulars,
      },
      create: {
        partnerId: dbPartner.id,
        title: partner.particulars,
        signedDate: partner.mouSigned,
        expiryDate: partner.mouExpiry,
        scope: partner.particulars,
      }
    });
  }
  console.log("[SEED] ✓ Partners & MoUs");

  // ── FAQs ───────────────────────────────────────────────────────────────────
  const faqs = [
    {
      question: "What kind of visa should I apply for (Course work)?",
      answer: "All students opting for course work should apply for only STUDENT visa.",
      order: 1,
    },
    {
      question: "Can I do my course work exchange in my first year of UG/PG?",
      answer: "Foreign students (UG) who want to apply for course work exchange are expected to have completed at least 3-4 semesters at their home institution. PG students are expected to have completed at least one semester at their home institution.",
      order: 2,
    },
    {
      question: "Can I take courses across different departments?",
      answer: "Yes, students can register for courses at any department at IITDH if the home Institution advisor approves.",
      order: 3,
    },
    {
      question: "Is there a minimum attendance requirement for exchange students?",
      answer: "Yes, students are requested to have a minimum of 80% attendance.",
      order: 4,
    },
    {
      question: "What kind of visa should I apply for (Research)?",
      answer: "Master’s by course work students can apply for a student visa. Master’s by research work and PhD students are requested to apply for a research visa.",
      order: 5,
    },
    {
      question: "Can a UG student do research work / project work / internship?",
      answer: "Yes, UG students can apply for research work, project work, and internship.",
      order: 6,
    },
    {
      question: "Will I get an additional scholarship from IIT Dharwad apart from what I receive from my Embassy?",
      answer: "No additional scholarships will be given to Embassy sponsored students.",
      order: 7,
    },
    {
      question: "What if a certain program is not sponsored by the Embassy?",
      answer: "In case the student is not sponsored by the Embassy, deserving students can apply directly to IIT Dharwad under Self Financed category.",
      order: 8,
    }
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
      value: "+91 9444536574",
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
      key: "about.intro",
      label: "About Us Intro",
      page: "about",
      type: "RICH_TEXT" as const,
      value:
        "Internationalisation is an inherent aspect of the Indian Institutes and the International Relations Office at IIT Dharwad is committed to achieving its goals through a focused approach, supported by two verticals, 'International Collaborations and International Academic Programs'.\n\n" +
        "We look forward to welcoming the international community to our midst, in the spirit of mutually beneficial partnerships. To broaden the experience -- both yours and ours -- of academic and cultural life, to be better equipped to participate in multicultural, globalised workspaces; and to contribute meaningfully to a dynamic, more integrated world.\n\n" +
        "The departments and centers of IIT Dharwad are responsible for teaching, research, and industrial consultancy. With our excellent faculty, students who excel both in academics and extra-curricular activities, dedicated staff members, and state-of-the-art research facilities, the first decade of our existence is proving to be an exciting phase. Going forward, we expect to have:\n" +
        "• International student admissions to full time taught and research programs\n" +
        "• Semester abroad student exchanges with partner institutes\n" +
        "• Research internships, immersion programs, study tours, project work.\n" +
        "• Twinning arrangements to collaboratively design and offer programs, and jointly award degrees\n" +
        "• Course-specific tie-ups and blended teaching-learning\n" +
        "• Visiting faculty exchanges\n" +
        "• Joint Research & Development on projects of relevance to either/both/ all concerned countries to offer just an indicative list."
    },
    {
      key: "about.chairpersonMessage",
      label: "Chairperson's Message",
      page: "about",
      type: "RICH_TEXT" as const,
      value:
        "Dear International Community,\n\n" +
        "A warm welcome to the International Relations Office at the Indian Institute of Technology Dharwad.\n\n" +
        "It is our pleasure to welcome students, faculty members, researchers, and academic partners from around the world to our vibrant and growing academic community. At IIT Dharwad, we believe that international engagement is built through meaningful academic collaboration, mutual respect, and shared learning.\n\n" +
        "The International Relations Office serves as a bridge between the Institute and the global academic community. We are committed to facilitating international partnerships, student and faculty mobility, collaborative research, academic exchanges, and other initiatives that foster global learning and intercultural understanding. Our team strives to ensure that every international visitor experiences a smooth transition and feels welcomed, supported, and connected throughout their journey at the Institute.\n\n" +
        "Beyond academics, IIT Dharwad offers an opportunity to experience India's rich cultural heritage while being part of an innovative and inclusive campus environment. We encourage you to engage with our students and faculty, explore new ideas, build lasting friendships, and contribute your unique perspectives to our academic community.\n\n" +
        "We look forward to welcoming you to IIT Dharwad and to building enduring partnerships that advance knowledge, innovation, and global cooperation.\n\n" +
        "With warm regards,\n" +
        "Chairperson\n" +
        "International Relations Office\n" +
        "Indian Institute of Technology Dharwad"
    }
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

  // ── Opportunities ──────────────────────────────────────────────────────────
  const opportunities = [
    {
      title: "INSPIRE FELLOWSHIPS",
      description: "Scholarships for IITDH Students.",
      audience: "STUDENT" as const,
      category: "SCHOLARSHIP" as const,
      organisation: "INSPIRE",
      country: "India",
      countryCode: "IN",
      externalUrl: null,
      applicationDeadline: null,
      publishedAt: new Date(),
    },
    {
      title: "India–Japan Cooperative Science Programme (IJCSP)",
      description: "IJCSP is a bilateral initiative that supports collaborative research projects between Indian and Japanese researchers in frontier areas of science and technology. The programme provides an excellent opportunity to strengthen research partnerships with Japanese institutions, facilitate faculty exchanges, promote joint research activities, and enhance international research visibility.",
      audience: "FACULTY" as const,
      category: "GRANT" as any, 
      organisation: "DST and JSPS",
      country: "Japan",
      countryCode: "JP",
      externalUrl: "https://www.onlinedst.gov.in",
      applicationDeadline: new Date("2026-09-03"),
      publishedAt: new Date(),
    },
    {
      title: "Global Initiative of Academic Networks (GIAN)",
      description: "Through GIAN, internationally renowned academicians, researchers, scientists, and industry experts are invited to offer short-term, intensive courses, typically ranging from one to three weeks. A lump-sum amount of up to US$ 8000 for 12 to 14 hours of contact and up to US$ 12000 for 20 to 28 hours of contact can be paid to the foreign experts covering their travel and honorarium.",
      audience: "FACULTY" as const,
      category: "FELLOWSHIP" as const,
      organisation: "Ministry of Education, Government of India",
      country: "India",
      countryCode: "IN",
      externalUrl: "https://gian.iitkgp.ac.in/",
      applicationDeadline: null,
      publishedAt: new Date(),
    },
    {
      title: "Visiting Advanced Joint Research (VAJRA) Faculty Scheme",
      description: "It is a dedicated program exclusively for overseas scientists and academicians with emphasis on Non-resident Indians (NRI) and Persons of Indian Origin (PIO) / Overseas Citizen of India (OCI) to work as adjunct/visiting faculty for a specific period of time in Indian public funded academic and research institutions. The Faculty will work for a minimum of 1 month and a maximum of 3 months a year in an institution in India.",
      audience: "FACULTY" as const,
      category: "RESEARCH" as const,
      organisation: "SERB",
      country: "India",
      countryCode: "IN",
      externalUrl: "https://www.vajra-india.in/",
      applicationDeadline: null,
      publishedAt: new Date(),
    },
    {
      title: "Scheme for Promotion of Academic and Research Collaboration (SPARC)",
      description: "Aims at improving the research ecosystem of India’s Higher Educational Institutions by facilitating academic and research collaborations between Indian Institutions and the best institutions in the world from 28 selected nations. The proposal will be for a period of two years. Budget up to ₹ 100 lakhs.",
      audience: "FACULTY" as const,
      category: "RESEARCH" as const,
      organisation: "Ministry of Education",
      country: "India",
      countryCode: "IN",
      externalUrl: "https://sparc.iitkgp.ac.in/index.php",
      applicationDeadline: null,
      publishedAt: new Date(),
    },
    {
      title: "Finnish Indian Consortia for Research and Education network (FICORE)",
      description: "Funding Landscape for India Collaboration – EU, Finland, and India contexts. FICORE involves 23 IITs and 15 Finnish Higher Education Institutions.",
      audience: "FACULTY" as const,
      category: "RESEARCH" as const,
      organisation: "FICORE",
      country: "Finland",
      countryCode: "FI",
      externalUrl: "https://www.aalto.fi/en/events/funding-landscape-for-india-collaboration-eu-finland-and-india-contexts",
      applicationDeadline: null,
      publishedAt: new Date(),
    }
  ];

  for (const o of opportunities) {
    let cat = o.category;
    const existing = await prisma.opportunity.findFirst({ where: { title: o.title } });
    if (existing) {
      await prisma.opportunity.update({ where: { id: existing.id }, data: { ...o, category: cat as any } });
    } else {
      await prisma.opportunity.create({ data: { ...o, category: cat as any } });
    }
  }
  console.log("[SEED] ✓ Opportunities");

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
