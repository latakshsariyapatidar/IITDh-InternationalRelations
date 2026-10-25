/**
 * An optional plain-text field for a create or update request body.
 *
 * These backend fields are `z.string().optional()`: they accept "" but reject
 * null, so sending null for an empty box made the whole save fail. An emptied
 * box is therefore sent as "" on an edit (which clears the saved value) and
 * left out on a create (undefined is dropped from the JSON body).
 */
export const optionalText = (value, isEdit) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (trimmed) return trimmed;
  return isEdit ? '' : undefined;
};
