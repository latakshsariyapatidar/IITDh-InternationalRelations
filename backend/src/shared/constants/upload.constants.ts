import path from "node:path";
import fs from "node:fs";

export const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export const IMAGE_FOLDERS = [
  "partners",
  "faculty",
  "team",
  "testimonials",
  "gallery",
  "events",
  "site-content",
] as const;

// "mous" is deliberately absent: MOU documents are signed agreements and now
// live in private-uploads/mous/, reachable only through the authenticated
// download route — anything listed here is served publicly from /uploads.
export const DOCUMENT_FOLDERS = ["downloads", "opportunities"] as const;

export type ImageFolder = (typeof IMAGE_FOLDERS)[number];
export type DocumentFolder = (typeof DOCUMENT_FOLDERS)[number];

for (const folder of [...IMAGE_FOLDERS, ...DOCUMENT_FOLDERS]) {
  fs.mkdirSync(path.join(UPLOAD_ROOT, folder), { recursive: true });
}
