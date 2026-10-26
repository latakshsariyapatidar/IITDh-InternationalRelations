// Nepal and Bhutan nationals give a citizenship number instead of passport
// details. Same test as isNepalOrBhutanNational in the backend's
// inbound-shared/nationality.ts.
export const isNepalOrBhutanNational = (nationality) =>
  /^(nepal|nepali|nepalese|bhutan|bhutanese)$/i.test(nationality.trim());
