(function () {
  'use strict';

  // Mobile nav toggle with event delegation
  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-js="nav-toggle"]');
    if (toggle) {
      var nav = document.querySelector('[data-js="nav"]');
      if (!nav) return;
      var next = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(next));
      nav.classList.toggle('is-open', next);
    }
  }, false);

  // Set current year in footer
  var yearEl = document.getElementById('js-year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  // Smooth scroll for same-page anchors (respect reduced motion)
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id && id.length > 1) {
        var el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
})();


