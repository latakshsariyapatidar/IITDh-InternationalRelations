# IRO frontend review — 17 November 2026

Implemented against the supplied WhatsApp excerpts/screenshots, the six-page frontend checklist, the director's approved scanned PDF, and the faculty funding DOCX (including its embedded India–Japan poster). Only frontend files were changed. No database records, backend code, uploaded MoUs, or external messages were changed.

## Checklist cross-check

| Item | Status | Result |
| --- | --- | --- |
| S1 | Done | Director's approved annexure transcribed word for word, retaining capitalization. Old CMS text cannot override it. |
| S2 | Done | Entire duplicate homepage Opportunities block removed. |
| S3 | Done | Header institute logo links to `https://www.iitdh.ac.in/`; the IRO wordmark retains the home link. |
| S4 | Done | Footer Quicklinks hidden behind `SHOW_QUICK_LINKS = false`; links and rendering code retained. |
| S5 | Verified | Footer Contact Us navigates to `/contact` at phone, tablet, and desktop sizes. |
| S6 | Done | Shared permanent-campus address with pincode `580 011` used in footer, Contact, and both application-form sidebars. No old pincode remains in frontend source. |
| S7 | Done | Both Study in India registration links use the portal root and open in a new tab. |
| S8 | Done | Exact requested fellowship qualification, followed by the existing inbound email. |
| S9 / K2 | Done | Removed unsupported Government schemes, University partnerships, and Internal support lists. Faculty content follows GIAN, VAJRA, SPARC, FICORE, and the IJCSP poster in the DOCX. The poster's September 3, 2026 deadline is explicitly closed; the unsupported annual-call claim was removed. |
| S10 | Pending source file | ENSI MoU not supplied. No document or placeholder link added. |
| S11 | Done | New Brunswick scope is “Exchange programs, Research Collaboration,” including scope search. |
| S12a | Done | Agder faculty champion is Prof. Sagnik Sen, with his supplied IRO email. |
| S12b | Pending signed file | Existing Agder MoU preserved. No unsigned replacement uploaded. |
| S13 | Done | Active student cards ordered Student Head, Inbound Head, Outbound Head, Management Head. Inbound title standardized. Editor-supplied non-wrapping descriptions now wrap on mobile. |
| S14 | Done | Five committee members and three administrative staff added after the Chairperson's message, with the supplied titles and linked email addresses. |
| K1 | Done against supplied list | Contact shows the IRO chairperson, three administrative staff, and two mobility inboxes. Committee members belong on About. Obsolete chairperson and incorrect email mappings removed. Unverified office hours, building details, and phone numbers omitted. |
| K3 | Preserved | No existing MoU files, validity data, or document access behavior changed. |

The ambiguous “put my name for now” message was not applied to the ENSI champion. The separate earlier Contact list mentioned in the checklist was not attached; Contact uses the explicit names and inboxes supplied in this request.

## Frontend content ownership

`src/data/iroContent.js` holds the approved directory, address, director's message, student presentation order, and partner corrections. The public Contact directory and director's message deliberately use this frontend copy so stale API values cannot restore the reported mistakes. These values require frontend edits until a separate CMS update is authorized. Other dynamic content continues to use the existing APIs.

## Validation

- Production build passed. Vite reports its existing large-bundle warning.
- Browser checks passed for eight affected routes at 360, 768, and 1440 pixels: 24 route/viewport combinations, with no page-level horizontal overflow or uncaught JavaScript errors.
- Checked directory emails, old-content suppression, student ordering, fellowship text, external link targets, all three faculty tabs, partner scope/champion corrections, and footer navigation. Mocked API responses intentionally included the obsolete director, team ordering, and partner champion; no backend mutations were made.
- Visually inspected desktop/mobile captures of the director message, About directory and team, Contact, partner listing, and faculty funding.
- Fixed an additional mobile admissions overflow: the fee table now scrolls inside its own container.
- Changed-file lint passes except for unchanged baseline findings in Admission (six unused declarations) and Partners (one existing effect warning reported as an error). Repository-wide lint has unrelated pre-existing failures.
- `git diff --check` passed. Not deployed.
