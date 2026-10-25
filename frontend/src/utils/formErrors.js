export function extractValidationErrors(err) {
  const errorList = err?.response?.data?.errors;
  const fieldErrors = {};
  if (Array.isArray(errorList)) {
    errorList.forEach(({ field, message }) => {
      if (field) {
        fieldErrors[field] = message;
      }
    });
  }
  const generalMessage =
    err?.response?.data?.message ||
    err?.message ||
    'An unexpected error occurred. Please try again.';

  return { fieldErrors, errorList: Array.isArray(errorList) ? errorList : [], generalMessage };
}

// "championName" -> "Champion name"; a nested path keeps only its last part.
const humanizeField = (field) => {
  const parts = String(field).split('.').filter((part) => !/^\d+$/.test(part));
  const name = parts[parts.length - 1] || String(field);
  const words = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/**
 * A message for an alert after a failed save. A rejected body comes back as
 * { message: "Validation failed", errors: [{ field, message }] }, and the
 * summary alone doesn't say which box to fix, so each invalid field gets a line.
 */
export function formatApiError(err, fallback = 'Something went wrong. Please try again.') {
  const { errorList } = extractValidationErrors(err);
  if (errorList.length > 0) {
    return errorList
      .map(({ field, message }) => (field ? `${humanizeField(field)}: ${message}` : message))
      .join('\n');
  }
  const message = err?.response?.data?.message;
  if (typeof message === 'string' && message) return message;
  if (err?.request && !err?.response) {
    return 'Could not reach the server. Check your connection and try again.';
  }
  return fallback;
}
