/**
 * Nepal and Bhutan nationals enter India on their citizenship ID rather than a
 * passport, so both inbound forms take a citizenship number from them instead
 * of passport details. Nationality is typed freely, so the country and demonym
 * spellings both count. The frontend applies the same test
 * (frontend/src/utils/nationality.js).
 */
export const isNepalOrBhutanNational = (nationality: string): boolean =>
  /^(nepal|nepali|nepalese|bhutan|bhutanese)$/i.test(nationality.trim());
