// Height of the sticky/fixed header(s) covering the top of the viewport, so a
// scroll target can land just below them rather than underneath.
export const headerOffset = () => {
  let offset = 0;
  document.querySelectorAll('header').forEach((el) => {
    const { position } = window.getComputedStyle(el);
    if (position === 'sticky' || position === 'fixed') {
      offset = Math.max(offset, el.getBoundingClientRect().bottom);
    }
  });
  return offset;
};
