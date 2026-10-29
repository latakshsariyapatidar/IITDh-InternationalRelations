import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SectionHeader from "../components/ui/SectionHeader";
import CTAButton from "../components/ui/CTAButton";
import DetailRows from "../components/ui/DetailRows";
import FAQAccordion from "../components/FAQAccordion";
import { fetchAllPages } from "../api/fetchAllPages";
import { RiArrowRightUpLine, RiMailLine, RiPhoneLine } from "@remixicon/react";

// In-page contents, in reading order.
const SECTIONS = [
  { id: "study-in-india", label: "Study in India" },
  { id: "self-financed", label: "Self-financed" },
  { id: "embassy", label: "Embassy" },
  { id: "fees", label: "Fee structure" },
  { id: "admission-contacts", label: "Contacts" },
];

const FEE_SUMMARY = (
  <>
    Institute fees as per the <a href="#fees">fee structure</a>.
  </>
);

const ENGLISH =
  "The medium of instruction across all courses is English. Applicants should have a functional knowledge of English: the ability to read, write, understand and speak the language.";

// Fees Structure (2026-2027): PhD and M.Tech (Research), international students.
// Columns: First semester, Spring semester, Autumn semester; each GEN / PwD. Amounts in ₹.
const FEE_GROUPS = [
  {
    code: "A",
    title: "One-time fee",
    rows: [
      ["A1", "Admission", ["300", "300", "", "", "", ""]],
      ["A2", "Academic service charges", ["1,200", "1,200", "", "", "", ""]],
      ["A3", "Convocation fee", ["3,000", "3,000", "", "", "", ""]],
      ["A4", "Alumni lifetime membership", ["2,000", "2,000", "", "", "", ""]],
    ],
    total: ["Total (A1 to A4)", ["6,500", "6,500", "", "", "", ""]],
  },
  {
    code: "B",
    title: "Refundable deposit",
    rows: [
      ["B1", "Library deposit", ["1,000", "1,000", "", "", "", ""]],
      ["B2", "Institute deposit", ["5,000", "5,000", "", "", "", ""]],
    ],
    total: ["Total (B1 to B2)", ["6,000", "6,000", "", "", "", ""]],
  },
  {
    code: "C",
    title: "Per-semester fee",
    rows: [
      [
        "C1",
        "Registration fee",
        ["1,500", "1,500", "1,500", "1,500", "1,500", "1,500"],
      ],
      [
        "C2*",
        "Tuition fee for international students",
        ["35,000", "", "35,000", "", "35,000", ""],
      ],
      [
        "C3",
        "Examination fee",
        ["2,000", "2,000", "2,000", "2,000", "2,000", "2,000"],
      ],
      ["C4", "Library fee", ["500", "500", "500", "500", "500", "500"]],
    ],
    total: [
      "Total (C1 to C4)",
      ["39,000", "4,000", "39,000", "4,000", "39,000", "4,000"],
    ],
  },
];
const FEE_ACADEMIC_TOTAL = [
  "Total academic components",
  ["51,500", "16,500", "39,000", "4,000", "39,000", "4,000"],
];
const FEE_NON_ACADEMIC = [
  {
    code: "D",
    title: "Per-semester fee",
    rows: [
      [
        "D1",
        "Gymkhana fee",
        ["3,000", "3,000", "3,000", "3,000", "3,000", "3,000"],
      ],
      [
        "D2",
        "Medical and wellness fee",
        ["2,500", "2,500", "2,500", "2,500", "2,500", "2,500"],
      ],
      [
        "D3",
        "Student benevolent fund",
        ["1,000", "1,000", "1,000", "1,000", "1,000", "1,000"],
      ],
      [
        "D4",
        "Hostel establishment and service charges",
        ["2,500", "2,500", "2,500", "2,500", "2,500", "2,500"],
      ],
      [
        "D5",
        "Mess establishment and service charges",
        ["1,500", "1,500", "1,500", "1,500", "1,500", "1,500"],
      ],
      [
        "D6",
        "Students' activity establishment charges",
        ["2,000", "2,000", "2,000", "2,000", "2,000", "2,000"],
      ],
      [
        "D7",
        "Hostel room rent for international students",
        ["20,000", "20,000", "20,000", "20,000", "20,000", "20,000"],
      ],
      [
        "D8",
        "Electricity and water charges*",
        ["2,500", "2,500", "2,500", "2,500", "2,500", "2,500"],
      ],
      [
        "D9",
        "Mess advance*",
        ["24,500", "24,500", "24,500", "24,500", "24,500", "24,500"],
      ],
    ],
    total: [
      "Total (D1 to D9)",
      ["59,500", "59,500", "59,500", "59,500", "59,500", "59,500"],
    ],
  },
  {
    code: "E",
    title: "Medical insurance premium (annually)",
    rows: [
      [
        "E",
        "Medical insurance premium",
        ["1,500", "1,500", "", "", "1,500", "1,500"],
      ],
    ],
  },
  {
    code: "F",
    title: "Refundable deposit",
    rows: [["F1", "Hostel deposit", ["5,000", "5,000", "", "", "", ""]]],
  },
];
const FEE_NON_ACADEMIC_TOTAL = [
  "Total non-academic components (D+E+F)",
  ["66,000", "66,000", "59,500", "59,500", "61,000", "61,000"],
];
const FEE_GRAND_TOTAL = [
  "Total",
  ["1,17,500", "82,500", "98,500", "63,500", "1,00,000", "65,000"],
];

function FeeCells({ values, strong = false }) {
  return values.map((v, i) => (
    <td
      key={i}
      className={`px-3 py-2.5 text-right nums-tabular whitespace-nowrap ${i % 2 === 0 ? "border-l border-mist" : ""} ${strong ? "font-semibold text-plum-deep" : "text-body"}`}
    >
      {v || (
        <span className="text-quiet/50" aria-label="not applicable">
          –
        </span>
      )}
    </td>
  ));
}

function FeeGroup({ group }) {
  return (
    <>
      <tr className="bg-porcelain">
        <th
          colSpan={8}
          scope="rowgroup"
          className="px-3 py-2 text-left text-xs font-semibold text-quiet"
        >
          {group.code}. {group.title}
        </th>
      </tr>
      {group.rows.map(([code, label, values]) => (
        <tr key={code} className="border-t border-mist">
          <td className="px-3 py-2.5 text-quiet nums-tabular">{code}</td>
          <th
            scope="row"
            className="px-3 py-2.5 text-left font-normal text-body"
          >
            {label}
          </th>
          <FeeCells values={values} />
        </tr>
      ))}
      {group.total && (
        <tr className="border-t border-mist">
          <td />
          <th
            scope="row"
            className="px-3 py-2.5 text-left font-semibold text-plum-deep"
          >
            {group.total[0]}
          </th>
          <FeeCells values={group.total[1]} strong />
        </tr>
      )}
    </>
  );
}

function TotalRow({ row, emphasis = false }) {
  return (
    <tr
      className={
        emphasis ? "bg-plum text-white" : "border-y border-plum/20 bg-plum-tint"
      }
    >
      <td />
      <th
        scope="row"
        className={`px-3 py-3 text-left font-semibold ${emphasis ? "text-white" : "text-plum-deep"}`}
      >
        {row[0]}
      </th>
      {row[1].map((v, i) => (
        <td
          key={i}
          className={`px-3 py-3 text-right font-semibold nums-tabular whitespace-nowrap ${i % 2 === 0 ? `border-l ${emphasis ? "border-white/15" : "border-plum/10"}` : ""} ${emphasis ? "text-white" : "text-plum-deep"}`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

/** One admission route: its name and essentials on the left, the full sheet on the right. */
function RouteSheet({ id, title, summary, facts, action, rows }) {
  return (
    <section
      id={id}
      className="scroll-mt-16 py-16 md:py-20 border-t border-mist first:border-t-0"
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--site-header-h,140px)+5rem)]">
            <h2
              className={`text-3xl md:text-[2.25rem] leading-[1.1] font-medium tracking-[-0.01em] text-plum-deep`}
            >
              {title}
            </h2>
            <p className="mt-3 text-quiet leading-relaxed">{summary}</p>
            {facts && (
              <dl className="mt-6 space-y-3 text-sm">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-quiet">{k}</dt>
                    <dd className="font-semibold text-plum-deep">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {action && <div className="mt-7">{action}</div>}
          </div>
        </div>
        <div className="lg:col-span-8">
          <DetailRows rows={rows} />
        </div>
      </div>
    </section>
  );
}

export default function Admission() {
  const [faqs, setFaqs] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFaqs(
          await fetchAllPages("/faqs", "faqs", {
            pageSize: 100,
            params: { isActive: true },
          }),
        );
      } catch (err) {
        console.error("Failed to load admission faqs", err);
      }
    };
    const fetchPrograms = async () => {
      try {
        setPrograms(
          await fetchAllPages("/programs", "programs", {
            pageSize: 100,
            params: { isActive: true },
          }),
        );
      } catch (err) {
        console.error("Failed to load programs", err);
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchData();
    fetchPrograms();
  }, []);

  const programsByLevel = {
    UNDERGRADUATE: programs.filter((p) => p.level === "UNDERGRADUATE"),
    POSTGRADUATE: programs.filter((p) => p.level === "POSTGRADUATE"),
    PHD: programs.filter((p) => p.level === "PHD"),
  };

  const programColumns = [
    {
      key: "UNDERGRADUATE",
      title: "Undergraduate",
      empty: "No undergraduate programs listed.",
      accent: "bg-saffron",
    },
    {
      key: "POSTGRADUATE",
      title: "Postgraduate",
      empty: "No postgraduate programs listed.",
      accent: "bg-plum",
    },
    {
      key: "PHD",
      title: "Doctoral (Ph.D.)",
      empty: "No doctoral programs listed.",
      accent: "bg-plum-deep",
    },
  ];

  return (
    <div>
      <HeroSection
        title="International Admissions"
        subtitle="Your pathway to world-class degree education at IIT Dharwad"
        backgroundImage="/institute/Institute2.jpg"
      />

      {/* In-page contents: stays under the header while reading */}
      <nav
        aria-label="On this page"
        className="sticky top-[var(--site-header-h,140px)] z-30 border-b border-mist bg-porcelain/95 backdrop-blur"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="scrollbar-hide -mx-4 flex gap-1 overflow-x-auto px-4 py-2.5 sm:mx-0 sm:px-0">
            {SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className="block rounded-full px-3.5 py-1.5 text-sm font-medium text-body hover:bg-white hover:text-plum-deep hover:ring-1 hover:ring-mist"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RouteSheet
          id="study-in-india"
          title="Study in India applications"
          summary="Apply via the Study in India portal, the Government of India's single window for international students."
          facts={[
            ["Programmes", "Masters and PhD"],
            ["Apply through", "studyinindia.gov.in"],
          ]}
          action={
            <CTAButton
              label="Register on Study in India"
              href="https://www.studyinindia.gov.in/admission/Registrations"
            />
          }
          rows={[
            {
              label: "About the programme",
              content: (
                <>
                  <p>
                    Study in India (SII) is the flagship international education
                    initiative of the Ministry of Education (MoE), Government of
                    India, launched on 18 April 2018 to position India as a
                    preferred global destination for higher education.
                  </p>
                  <p>
                    India is home to one of the world's largest higher education
                    systems, with more than 1,200 universities and over 45,000
                    colleges. The programme encourages international students to
                    study at premier Indian institutions, including the IITs,
                    NITs and Central Universities, and is open to students from
                    across the globe, with strong participation from South Asia
                    (SAARC), Africa, Southeast Asia, Central Asia, and the
                    Middle East.
                  </p>
                  <p>
                    The Study in India portal is a single window where
                    international students can:
                  </p>
                  <ul>
                    <li>
                      Explore academic programmes offered by participating
                      institutions
                    </li>
                    <li>Submit online applications for admission</li>
                    <li>Receive admission offers</li>
                    <li>
                      Apply for a student visa through the integrated system
                    </li>
                    <li>
                      Complete required immigration and FRRO-related formalities
                    </li>
                  </ul>
                  <p>
                    Website:{" "}
                    <a
                      href="https://www.studyinindia.gov.in/home"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      studyinindia.gov.in
                    </a>
                  </p>
                </>
              ),
            },
            {
              label: "Eligibility",
              content: (
                <>
                  <p>
                    The eligibility criteria and qualifications are as per IIT
                    Dharwad rules and regulations.
                  </p>
                  <p>{ENGLISH}</p>
                </>
              ),
            },
            {
              label: "Application procedure",
              content: (
                <p>
                  Apply through the{" "}
                  <a
                    href="https://www.studyinindia.gov.in/admission/Registrations"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Study in India portal
                  </a>
                  .
                </p>
              ),
            },
            {
              label: "Funding details",
              content: (
                <p>
                  The selected applicant pays fees as per the IIT Dharwad fee
                  structure.
                </p>
              ),
            },
            {
              label: "Application deadline",
              content: (
                <p>
                  Please visit the{" "}
                  <a
                    href="https://www.studyinindia.gov.in/home"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SII website
                  </a>
                  .
                </p>
              ),
            },
            {
              label: "FAQs",
              content: (
                <p>
                  <a
                    href="https://www.studyinindia.gov.in/faqs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Study in India FAQs
                  </a>
                </p>
              ),
            },
            { label: "Fee structure", content: <p>{FEE_SUMMARY}</p> },
          ]}
        />

        <RouteSheet
          id="self-financed"
          title="Self-financed applications"
          summary="Apply directly through the International Relations Office for a full-time Masters by coursework, or a PhD."
          facts={[
            ["Programmes", "M.Tech, M.Sc and PhD"],
            ["Masters applications", "1 February to 30 April"],
          ]}
          action={
            <CTAButton
              label="Submit Online Application"
              to="/international-admissions/apply"
            />
          }
          rows={[
            {
              label: "About the programme",
              content: (
                <p>
                  International students who want to pursue a full-time Masters
                  can go through IIT Dharwad's{" "}
                  <a
                    href="https://www.iitdh.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    departments and programmes
                  </a>{" "}
                  and apply through the International Relations Office.
                </p>
              ),
            },
            {
              label: "Eligibility",
              content: (
                <>
                  <ul>
                    <li>
                      Masters by Technology (M.Tech): Bachelor's degree in a
                      relevant area
                    </li>
                    <li>
                      Masters by Science (M.Sc): Bachelor's degree in a relevant
                      area
                    </li>
                  </ul>
                  <p>{ENGLISH}</p>
                </>
              ),
            },
            {
              label: "Application procedure",
              content: (
                <>
                  <ol>
                    <li>
                      Fill in the application form and submit it to the
                      International Relations Office with the required
                      documents.
                    </li>
                    <li>
                      Shortlisted candidates are called for an interview by the
                      respective department, coordinated by the International
                      Relations Office.
                    </li>
                    <li>
                      Admission is subject to the recommendations of the
                      selection committee's own selection process.
                    </li>
                  </ol>
                  <div className="mt-5 rounded-xl bg-porcelain p-5 ring-1 ring-inset ring-mist">
                    <p className="font-semibold text-plum-deep">
                      Documents to submit, scanned into a single PDF
                    </p>
                    <ul>
                      <li>Grade cards (10th, 12th and UG)</li>
                      <li>Statement of Purpose (SOP)</li>
                      <li>Recommendation by two members</li>
                      <li>Work experience (if any)</li>
                      <li>Publications (if any)</li>
                      <li>
                        Passport copy, or ID card for citizens of Nepal and
                        Bhutan
                      </li>
                      <li>Passport photo</li>
                    </ul>
                  </div>
                </>
              ),
            },
            {
              label: "Funding details",
              content: (
                <p>
                  Meritorious students can apply for financial assistance or a
                  fee waiver, specifying a valid reason. The institute will
                  decide the level of scholarship that can be given to the
                  student.
                </p>
              ),
            },
            {
              label: "Application deadline",
              content: (
                <>
                  <p>
                    <strong className="font-semibold text-plum-deep">
                      Masters:
                    </strong>{" "}
                    applications open 1 February to 30 April every year. The
                    programme begins in the last week of July.
                  </p>
                  <p>
                    <strong className="font-semibold text-plum-deep">
                      PhD:
                    </strong>{" "}
                    1 February to 30 April for the July intake; 1 July to 30
                    September for the January intake.
                  </p>
                  <p className="text-sm text-quiet">
                    Dates are subject to change.
                  </p>
                </>
              ),
            },
            { label: "Fee structure", content: <p>{FEE_SUMMARY}</p> },
          ]}
        />

        <RouteSheet
          id="embassy"
          title="Embassy applications"
          summary="Apply for a full-time Masters or PhD through your country's Embassy."
          facts={[
            ["Programmes", "Masters and PhD"],
            ["Deadlines and funding", "As per your Embassy"],
          ]}
          rows={[
            {
              label: "About the programme",
              content: (
                <p>
                  International students who want to pursue a full-time Masters
                  or PhD programme can apply through their respective Embassies
                  to the International Relations Office at IIT Dharwad.
                </p>
              ),
            },
            {
              label: "Eligibility",
              content: (
                <>
                  <p>As per IIT Dharwad rules and regulations.</p>
                  <p>{ENGLISH}</p>
                </>
              ),
            },
            {
              label: "Application procedure",
              content: (
                <p>
                  As per your Embassy guidelines. The IIT Dharwad application
                  form is also available through the{" "}
                  <Link to="/international-admissions/apply">
                    online application
                  </Link>
                  .
                </p>
              ),
            },
            {
              label: "Funding details",
              content: <p>As per your Embassy guidelines.</p>,
            },
            {
              label: "Application deadline",
              content: <p>As per your Embassy guidelines.</p>,
            },
            {
              label: "FAQs",
              content: (
                <>
                  <p className="font-semibold text-plum-deep">
                    Will I get an additional scholarship from IIT Dharwad apart
                    from what I receive from my Embassy?
                  </p>
                  <p>
                    No. Additional scholarships are not given to
                    Embassy-sponsored students.
                  </p>
                  <p className="font-semibold text-plum-deep">
                    What if a programme is not sponsored by the Embassy?
                  </p>
                  <p>
                    Deserving students who are not sponsored by their Embassy
                    can apply directly to IIT Dharwad under the{" "}
                    <a href="#self-financed">self-financed</a> category.
                  </p>
                </>
              ),
            },
            { label: "Fee structure", content: <p>{FEE_SUMMARY}</p> },
          ]}
        />
      </div>

      {/* Fee structure */}
      <section
        id="fees"
        className="scroll-mt-16 bg-white border-y border-mist py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Fee structure, 2026–27"
            subtitle="What international students pay."
          />

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h3 className="text-xl font-medium text-plum-deep">
                PhD and M.Tech (Research)
              </h3>
              <p className="mt-1 text-sm text-quiet">
                Amounts in Indian rupees (₹). GEN: general category; PwD:
                persons with disabilities.
              </p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-mist">
                <table className="w-full min-w-[46rem] text-sm">
                  <caption className="sr-only">
                    Fee structure 2026–27 for international PhD and M.Tech
                    (Research) students, in rupees
                  </caption>
                  <thead>
                    <tr className="bg-plum-deep text-white">
                      <th
                        rowSpan={2}
                        scope="col"
                        className="px-3 py-3 text-left font-semibold w-12"
                      >
                        No.
                      </th>
                      <th
                        rowSpan={2}
                        scope="col"
                        className="px-3 py-3 text-left font-semibold"
                      >
                        Particulars
                      </th>
                      <th
                        colSpan={2}
                        scope="colgroup"
                        className="border-l border-white/15 px-3 pt-3 pb-1 text-right font-semibold"
                      >
                        First semester
                      </th>
                      <th
                        colSpan={2}
                        scope="colgroup"
                        className="border-l border-white/15 px-3 pt-3 pb-1 text-right font-semibold"
                      >
                        Spring semester
                      </th>
                      <th
                        colSpan={2}
                        scope="colgroup"
                        className="border-l border-white/15 px-3 pt-3 pb-1 text-right font-semibold"
                      >
                        Autumn semester
                      </th>
                    </tr>
                    <tr className="bg-plum-deep text-white/70 text-xs">
                      {["GEN", "PwD", "GEN", "PwD", "GEN", "PwD"].map(
                        (h, i) => (
                          <th
                            key={i}
                            scope="col"
                            className={`px-3 pb-2.5 text-right font-medium ${i % 2 === 0 ? "border-l border-white/15" : ""}`}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_GROUPS.map((g) => (
                      <FeeGroup key={g.code} group={g} />
                    ))}
                    <TotalRow row={FEE_ACADEMIC_TOTAL} />
                    {FEE_NON_ACADEMIC.map((g) => (
                      <FeeGroup key={g.code} group={g} />
                    ))}
                    <TotalRow row={FEE_NON_ACADEMIC_TOTAL} />
                    <TotalRow row={FEE_GRAND_TOTAL} emphasis />
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl bg-saffron-tint p-6">
                <h3 className="text-xl font-medium text-plum-deep">
                  Financial assistance
                </h3>
                <p className="mt-2 text-body">
                  Meritorious self-financed students can apply for financial
                  assistance or a fee waiver, specifying a valid reason. The
                  institute decides the level of scholarship.
                </p>
              </div>
              <p className="text-sm text-quiet">
                Fees are paid directly to the Institute's bank account.
                Embassy-sponsored students receive no additional scholarship
                from IIT Dharwad.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Programs Catalogue (3.10) */}
      {/* <section id="programs" className="scroll-mt-16 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Academic programmes catalogue"
            subtitle="Explore academic degree offerings open to international candidates"
          />
          {loadingPrograms ? (
            <p className="py-8 text-quiet">Loading programs catalogue...</p>
          ) : programs.length === 0 ? (
            <p className="py-8 text-quiet">No programs listed currently.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {programColumns.map((col) => (
                <div key={col.key} className="rounded-2xl border border-mist bg-white p-6">
                  <div className="mb-4 flex items-center gap-2.5 border-b border-mist pb-4">
                    <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${col.accent}`} />
                    <h3 className="text-xl font-medium text-plum-deep">{col.title}</h3>
                    <span className="ml-auto text-sm text-quiet nums-tabular">{programsByLevel[col.key].length}</span>
                  </div>
                  {programsByLevel[col.key].length === 0 ? (
                    <p className="text-sm text-quiet">{col.empty}</p>
                  ) : (
                    <ul className="-mx-2">
                      {programsByLevel[col.key].map((p) => (
                        <li key={p.id}>
                          <a
                            href={p.redirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-[0.95rem] text-body hover:bg-porcelain hover:text-plum-deep"
                          >
                            <span>{p.name}</span>
                            <RiArrowRightUpLine size={16} aria-hidden="true" className="shrink-0 text-quiet group-hover:text-plum" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section> */}

      {/* Contacts */}
      <section
        id="admission-contacts"
        className="scroll-mt-16 bg-white border-y border-mist py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Applications and general queries"
            subtitle="Write to us about eligibility, documents or the status of your application."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-mist p-6">
              <h3 className="text-xl font-medium text-plum-deep">
                Inbound Coordinator
              </h3>
              <p className="text-sm text-quiet">
                International admissions and inbound programmes
              </p>
              <ul className="mt-5 space-y-2 text-[0.95rem]">
                <li className="flex items-center gap-2.5">
                  <RiMailLine
                    size={17}
                    aria-hidden="true"
                    className="text-saffron-deep"
                  />
                  <a
                    href="mailto:inbound.iro@iitdh.ac.in"
                    className="text-plum hover:underline underline-offset-4"
                  >
                    inbound.iro@iitdh.ac.in
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <RiPhoneLine
                    size={17}
                    aria-hidden="true"
                    className="text-saffron-deep"
                  />
                  <a
                    href="tel:+919444536574"
                    className="text-body hover:text-plum nums-tabular"
                  >
                    +91 94445 36574
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* <section id="faqs" className="py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <SectionHeader
              title="Frequently asked questions"
              subtitle="Find answers to common questions"
            />
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section> */}
    </div>
  );
}
