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
