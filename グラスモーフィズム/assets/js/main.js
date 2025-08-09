document.addEventListener('DOMContentLoaded', () => {
  // Current year only (header interactions are handled in include.js)
  const yearEl = document.getElementById('js-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});


