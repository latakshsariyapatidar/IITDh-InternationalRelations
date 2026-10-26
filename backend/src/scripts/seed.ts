import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";

// A first-run bootstrap, not a content fixture.
//
// This script used to insert invented partners, MOUs, FAQs, programs, faculty,
// team members, opportunities and a fictional applicant, and entrypoint.sh ran
// it on every container start. Two problems followed from that:
//
//   - Every block was written as `if (exists) update(...) else create(...)`,
//     so a restart rewrote rows an admin had edited in the panel. All eighteen
//     site-content values, the five office contacts and the whole team list
//     reverted to these defaults on each deploy, silently.
//
//   - Deleting a seeded row did not stick. The faculty directory doubles as the
//     faculty-portal allow-list, so a restart recreated a deleted entry with
//     `isPortalEnabled` back at its schema default of true — withdrawing portal
//     access through the admin panel was undone by the next reboot.
//
// Everything the admin panel can create itself is therefore gone from here.
// Contacts, faculty, team, partners, MOUs, FAQs, programs and opportunities all
// have POST, PATCH and DELETE routes, so the office enters its own real data
// and no restart competes with it.
//
// Two things remain, because nothing else can produce them:
//
//   1. The admin account. There is no sign-up route, so without this nobody can
//      sign in to a fresh deployment at all.
//
//   2. The site-content rows. That module has PATCH only — no create route, and
//      no `create` in its repository — so a key absent here can never come into
//      existence, and PATCH /site-content/:key answers 404 forever. These rows
//      are the CMS's structure (key, label, page, type); the values below are
//      only starting text for the admin to replace from the panel.
//
// Run it once, by hand, against a new database:
//
//     docker compose exec backend npm run seed
//
// Running it again is safe. Every write below is create-if-absent, so a second
// run cannot overwrite anything a person has since edited.

async function main() {
  console.log("[SEED] Starting...");

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@iitdh.ac.in";

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin && !adminPassword) {
    console.warn(
      "[SEED] ⚠️  SEED_ADMIN_PASSWORD is not set and no admin exists yet. " +
        "Admin account was not created. Provide SEED_ADMIN_PASSWORD in your .env to seed the initial admin.",
    );
  } else if (adminPassword) {
    if (adminPassword.length < 12) {
      console.warn(
        `[SEED] ⚠️  SEED_ADMIN_PASSWORD must be at least 12 characters (got ${adminPassword.length}). Admin skipped.`,
      );
    } else {
      const resetAdminPassword = process.env.SEED_RESET_ADMIN_PASSWORD === "true";
      const adminHash = await bcrypt.hash(adminPassword, 12);

      await prisma.admin.upsert({
        where: { email: adminEmail },
        update: resetAdminPassword ? { passwordHash: adminHash } : {},
        create: { email: adminEmail, passwordHash: adminHash },
      });
      console.log(
        `[SEED] ✓ Admin (${adminEmail})` +
          (resetAdminPassword ? " — password reset" : " — existing password kept or initialized"),
      );
    }
  } else {
    console.log(`[SEED] ✓ Admin exists (${adminEmail}) — skipped password update`);
  }

  // ── Site Content ───────────────────────────────────────────────────────────
  //
  // The CMS has no create route, so these rows have to exist before an admin
  // can edit anything. `value` is placeholder copy, not a claim of accuracy —
  // every one of these is editable at /admin/site-content.
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
        "• Joint Research & Development on projects of relevance to either/both/ all concerned countries to offer just an indicative list.",
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
        "Indian Institute of Technology Dharwad",
    },
  ];

  // `update: {}` is what makes this create-if-absent. An admin's saved value is
  // never touched, and the label/page/type scaffolding of an existing row is
  // left alone too — changing those is a migration, not a seed.
  let created = 0;

  for (const entry of siteContent) {
    const existing = await prisma.siteContent.findUnique({
      where: { key: entry.key },
      select: { key: true },
    });

    await prisma.siteContent.upsert({
      where: { key: entry.key },
      update: {},
      create: entry,
    });

    if (!existing) created += 1;
  }

  console.log(
    `[SEED] ✓ Site content (${created} created, ${siteContent.length - created} left untouched)`,
  );

  // ── Partners & MoUs ────────────────────────────────────────────────────────
  // Seed institutional partners and active/historical MoUs from institutional records.
  // Uses create-if-absent logic so admin panel modifications are preserved.
  const initialPartners = [
    {
      name: "The University of New Brunswick",
      country: "Canada",
      countryCode: "ca",
      type: "UNIVERSITY" as const,
      focus: "Exchange programs, Research Collaboration",
      championName: "Prof. Rajeswara Rao M / Chemistry & Prof. Ruma Ghosh / EECE",
      championEmail: "adean.rnd.outreach@iitdh.ac.in",
      championDesignation: "Faculty Champions",
      isActive: true,
      mous: [
        {
          title: "MoU - The University of New Brunswick",
          signedDate: new Date("2024-02-01T00:00:00.000Z"),
          expiryDate: new Date("2029-02-01T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Exchange programs, Research Collaboration",
          isPublic: true,
        },
      ],
    },
    {
      name: "University of Saskatchewan",
      country: "Canada",
      countryCode: "ca",
      type: "UNIVERSITY" as const,
      focus: "Exchange programs, Research Collaboration",
      championName: "Prof. Neelkamal & Prof. Sridevi",
      championEmail: null,
      championDesignation: "Faculty Champions",
      isActive: true,
      mous: [
        {
          title: "MoU - University of Saskatchewan",
          signedDate: new Date("2020-09-02T00:00:00.000Z"),
          expiryDate: new Date("2025-09-01T00:00:00.000Z"),
          status: "EXPIRED" as const,
          scope: "Exchange programs, Research Collaboration",
          isPublic: true,
        },
      ],
    },
    {
      name: "Carleton University",
      country: "Canada",
      countryCode: "ca",
      type: "UNIVERSITY" as const,
      focus: "Exchange programs, Research Collaboration",
      championName: "Prof. Rajshekhar Bhat",
      championEmail: "chairperson.ir@iitdh.ac.in",
      championDesignation: "Faculty Champion",
      isActive: true,
      mous: [
        {
          title: "MoU - Carleton University",
          signedDate: new Date("2023-02-02T00:00:00.000Z"),
          expiryDate: new Date("2028-02-01T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Exchange programs, Research Collaboration",
          isPublic: true,
        },
      ],
    },
    {
      name: "École de technologie supérieure (ÉTS)",
      country: "Canada",
      countryCode: "ca",
      type: "UNIVERSITY" as const,
      focus: "Exchange programs, Research Collaboration",
      championName: "Prof. Pratyasa Bhui / EECE & Prof. S R M Prasanna (Dean R&D)",
      championEmail: null,
      championDesignation: "Faculty Champions",
      isActive: true,
      mous: [
        {
          title: "MoU - École de technologie supérieure (ÉTS)",
          signedDate: new Date("2023-02-02T00:00:00.000Z"),
          expiryDate: new Date("2028-02-01T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Exchange programs, Research Collaboration",
          isPublic: true,
        },
      ],
    },
    {
      name: "Centre national de la recherche scientifique (CNRS)",
      country: "France",
      countryCode: "fr",
      type: "ORGANIZATION" as const,
      focus: "Exchange programs, International cooperation",
      championName: "Prof. Vigneshwara Raja / EECE",
      championEmail: "adean.rnd.outreach@iitdh.ac.in",
      championDesignation: "Associate Dean R&D Outreach",
      isActive: true,
      mous: [
        {
          title: "MoU - Centre national de la recherche scientifique (CNRS)",
          signedDate: new Date("2023-07-24T00:00:00.000Z"),
          expiryDate: new Date("2028-07-23T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Exchange programs, International cooperation",
          isPublic: true,
        },
      ],
    },
    {
      name: "Università degli Studi Roma Tre",
      country: "Italy",
      countryCode: "it",
      type: "UNIVERSITY" as const,
      focus: "Exchange programs, Research Collaboration",
      championName: "Prof. Satish Naik / EECE",
      championEmail: null,
      championDesignation: "Faculty Champion",
      isActive: true,
      mous: [
        {
          title: "MoU - Università degli Studi Roma Tre",
          signedDate: new Date("2023-01-11T00:00:00.000Z"),
          expiryDate: new Date("2028-01-10T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Exchange programs, Research Collaboration",
          isPublic: true,
        },
      ],
    },
    {
      name: "University of Agder",
      country: "Norway",
      countryCode: "no",
      type: "UNIVERSITY" as const,
      focus: "Exchange programs, Research Collaboration",
      championName: "Prof. Rajesh Hegde",
      championEmail: null,
      championDesignation: "Faculty Champion",
      isActive: true,
      mous: [
        {
          title: "MoU - University of Agder",
          signedDate: new Date("2023-06-02T00:00:00.000Z"),
          expiryDate: new Date("2028-06-01T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Exchange programs, Research Collaboration",
          isPublic: true,
        },
      ],
    },
    {
      name: "Norwegian University of Science and Technology (NTNU)",
      country: "Norway",
      countryCode: "no",
      type: "UNIVERSITY" as const,
      focus: "Exchange programs, Research Collaboration",
      championName: "Dr. Dileep A D / CSE",
      championEmail: null,
      championDesignation: "Faculty Champion",
      isActive: true,
      mous: [
        {
          title: "MoU - Norwegian University of Science and Technology (NTNU)",
          signedDate: new Date("2025-11-04T00:00:00.000Z"),
          expiryDate: new Date("2029-11-03T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Exchange programs, Research Collaboration",
          isPublic: true,
        },
      ],
    },
    {
      name: "National Cheng Kung University",
      country: "Taiwan",
      countryCode: "tw",
      type: "UNIVERSITY" as const,
      focus: "Departmental Agreement, Exchange programs, Research Collaboration",
      championName: "Prof. Naveen Kadayinti & Prof. Bharat B N / EECE",
      championEmail: null,
      championDesignation: "Faculty Champions",
      isActive: true,
      mous: [
        {
          title: "Departmental Agreement - National Cheng Kung University",
          signedDate: new Date("2021-04-08T00:00:00.000Z"),
          expiryDate: new Date("2026-04-07T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Departmental Agreement, Exchange programs, Research Collaboration",
          isPublic: true,
        },
      ],
    },
    {
      name: "Consortium of Finnish Universities",
      country: "Finland",
      countryCode: "fi",
      type: "CONSORTIUM" as const,
      focus: "Consortium MoU",
      championName: "Prof. Rakesh Lingam / ME",
      championEmail: null,
      championDesignation: "Faculty Champion",
      isActive: true,
      mous: [
        {
          title: "Consortium MoU - Consortium of Finnish Universities",
          signedDate: new Date("2021-09-22T00:00:00.000Z"),
          expiryDate: new Date("2026-09-21T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Consortium MoU, Collaborative Education & Research",
          isPublic: true,
        },
      ],
    },
    {
      name: "TU9 German Universities of Technology e. V. (DAAD)",
      country: "Germany",
      countryCode: "de",
      type: "CONSORTIUM" as const,
      focus: "Consortium MoU",
      championName: "Prof. Rajshekhar Bhat",
      championEmail: "chairperson.ir@iitdh.ac.in",
      championDesignation: "Faculty Champion",
      isActive: true,
      mous: [
        {
          title: "Consortium MoU - TU9 German Universities of Technology",
          signedDate: new Date("2019-03-20T00:00:00.000Z"),
          expiryDate: new Date("2022-07-01T00:00:00.000Z"),
          status: "EXPIRED" as const,
          scope: "Consortium MoU, Academic & Research Cooperation",
          isPublic: true,
        },
      ],
    },
    {
      name: "Indo French Network ENSI Poitiers-IITs",
      country: "France",
      countryCode: "fr",
      type: "CONSORTIUM" as const,
      focus: "Consortium MoU",
      championName: "Office of International Relations",
      championEmail: "office.iro@iitdh.ac.in",
      championDesignation: "IRO Office",
      isActive: true,
      mous: [
        {
          title: "Consortium MoU - Indo French Network ENSI Poitiers-IITs",
          signedDate: new Date("2022-03-08T00:00:00.000Z"),
          expiryDate: new Date("2027-03-08T00:00:00.000Z"),
          status: "ACTIVE" as const,
          scope: "Consortium MoU, Student & Faculty Mobility",
          isPublic: true,
        },
      ],
    },
  ];

  let partnersCreated = 0;
  for (const partnerData of initialPartners) {
    const { mous, ...partnerFields } = partnerData;
    const existing = await prisma.partner.findFirst({
      where: { name: partnerFields.name },
    });

    if (!existing) {
      await prisma.partner.create({
        data: {
          ...partnerFields,
          mous: {
            create: mous,
          },
        },
      });
      partnersCreated += 1;
    }
  }

  console.log(
    `[SEED] ✓ Partners & MoUs (${partnersCreated} created, ${initialPartners.length - partnersCreated} left untouched)`,
  );

  // ── Initial Contacts ───────────────────────────────────────────────────────
  const initialContacts = [
    {
      type: "CHAIRPERSON" as const,
      name: "Prof. Rajshekhar Bhat",
      title: "Chairperson, International Relations",
      email: "chairperson.ir@iitdh.ac.in",
      phone: "+91 836 2212 839",
      address: "IIT Dharwad, Permanent Campus, Chikkamalligawad, Dharwad, Karnataka 580007",
      isActive: true,
    },
    {
      type: "IRO_OFFICE" as const,
      name: "International Relations Office",
      title: "IRO General Inquiries & Operations",
      email: "office.iro@iitdh.ac.in",
      phone: "+91 9444536574",
      address: "IIT Dharwad, Permanent Campus, Chikkamalligawad, Dharwad, Karnataka 580007",
      isActive: true,
    },
  ];

  let contactsCreated = 0;
  for (const contact of initialContacts) {
    const existing = await prisma.contact.findFirst({
      where: { email: contact.email },
    });
    if (!existing) {
      await prisma.contact.create({ data: contact });
      contactsCreated += 1;
    }
  }

  console.log(
    `[SEED] ✓ Contacts (${contactsCreated} created, ${initialContacts.length - contactsCreated} left untouched)`,
  );

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
