/**
 * A programme sheet: the "Category | Content" tables of the office's
 * documents, set as a definition list.
 *
 *   About the programme   Lorem ipsum dolor sit amet…
 *   ─────────────────────────────────────────────────
 *   Eligibility           Lorem ipsum…
 *
 * rows: [{ label, content }] — content may be any node. Rows with no content
 * are skipped, so a sheet never shows an empty heading.
 */
export default function DetailRows({ rows = [], className = '' }) {
  return (
    <dl className={`divide-y divide-mist border-y border-mist ${className}`}>
      {rows
        .filter((row) => row && row.content)
        .map((row) => (
          <div key={row.label} className="grid gap-2 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
            <dt className="text-sm font-semibold text-plum-deep">{row.label}</dt>
            <dd className="text-[0.95rem] leading-relaxed text-body [&_a]:font-medium [&_a]:text-plum [&_a]:underline [&_a]:decoration-saffron/60 [&_a]:underline-offset-4 [&_a:hover]:decoration-plum [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:marker:text-saffron-deep">
              {row.content}
            </dd>
          </div>
        ))}
    </dl>
  )
}
