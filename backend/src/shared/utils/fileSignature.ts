import fs from "node:fs/promises";

// Content verification for uploads.
//
// multer's `fileFilter` checks `file.mimetype`, which is the Content-Type the
// client wrote into its own multipart part. That is a claim, not an observation:
// `curl -F "file=@payload.exe;type=image/png"` satisfies every filter in this
// codebase and lands on disk as <uuid>.png, because the stored extension is
// derived from the same claim (see mimeExtension.ts). One attacker-controlled
// string was serving as both the check and the filename.
//
// Script execution was already closed off — SVG is refused outright, /uploads is
// served with nosniff and a sandbox CSP, private documents go out as
// attachments. What remained was the ability to park arbitrary bytes behind a
// trusted institute URL, and to stage a file through the public application
// forms that an IRO reviewer later downloads to their own machine under a name
// that lies about what it is.
//
// So the bytes get checked against the claim. Every format this API accepts
// begins with a fixed signature, and a file whose opening bytes do not match the
// type it declared is not that type.

interface Pattern {
  /** Byte offset the pattern starts at. */
  offset: number;
  /** Bytes expected at that offset. */
  bytes: readonly number[];
}

/**
 * Accepted MIME type -> the signatures that satisfy it.
 *
 * A type is satisfied when ANY of its signatures matches, and a signature
 * matches only when EVERY one of its patterns does. WEBP needs two, because it
 * is a RIFF container: "RIFF", then "WEBP" four bytes later.
 */
const SIGNATURES: Readonly<Record<string, readonly (readonly Pattern[])[]>> = {
  // "%PDF"
  "application/pdf": [[{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }]],

  // SOI marker, shared by JFIF and EXIF JPEGs
  "image/jpeg": [[{ offset: 0, bytes: [0xff, 0xd8, 0xff] }]],

  "image/png": [
    [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  ],

  // "GIF87a" and "GIF89a"
  "image/gif": [
    [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }],
    [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }],
  ],

  // "RIFF" .... "WEBP"
  "image/webp": [
    [
      { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
      { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
    ],
  ],
};

/** The longest prefix any signature above needs to see. */
const HEADER_BYTES = 12;

/**
 * Whether this module can check the given type at all.
 *
 * Callers fail closed on `false`: a `fileFilter` widened without a signature
 * being added here means "I cannot verify this", and the only safe reading of
 * that is to refuse the file.
 */
export function hasKnownSignature(mimetype: string): boolean {
  return normalise(mimetype) in SIGNATURES;
}

const normalise = (mimetype: string): string => mimetype.trim().toLowerCase();

function matches(header: Buffer, signature: readonly Pattern[]): boolean {
  return signature.every(({ offset, bytes }) =>
    // Past the end of what was read, `header[i]` is undefined and fails the
    // comparison — which is the right answer for a file too short to hold the
    // signature it claims.
    bytes.every((byte, index) => header[offset + index] === byte),
  );
}

/**
 * True only when the file on disk actually is what `declaredMime` says it is.
 * A file shorter than its own signature, or of a type this module does not
 * know, returns false.
 */
export async function fileMatchesDeclaredType(
  absolutePath: string,
  declaredMime: string,
): Promise<boolean> {
  const candidates = SIGNATURES[normalise(declaredMime)];
  if (!candidates) return false;

  const handle = await fs.open(absolutePath, "r");

  try {
    const header = Buffer.alloc(HEADER_BYTES);
    const { bytesRead } = await handle.read(header, 0, HEADER_BYTES, 0);

    // Compare only the bytes actually read. A short read leaves zeroes in the
    // tail of the buffer, and comparing those would let a truncated file
    // satisfy a pattern that happened to expect a zero byte.
    return candidates.some((signature) =>
      matches(header.subarray(0, bytesRead), signature),
    );
  } finally {
    await handle.close();
  }
}
