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
