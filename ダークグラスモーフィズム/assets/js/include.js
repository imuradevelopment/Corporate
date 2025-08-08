// Lightweight include + link adjustment + header behaviors (no visual change)
(function () {
  'use strict';

  function resolveHref(raw, isInSubdir) {
    const prefix = isInSubdir ? '' : '';
    // '@/path' or './path' → relative from site root (branch root)
    return raw.replace(/^@\//, '').replace(/^\.\//, '');
  }

  function adjustLinks(root) {
    const isInSubdir = true; // files live at branch root; keep simple
    root.querySelectorAll('a[data-href]').forEach((a) => {
      const t = a.getAttribute('data-href');
      if (!t) return;
      a.setAttribute('href', resolveHref(t, isInSubdir));
    });
    const y = root.querySelector('#y');
    if (y) y.textContent = new Date().getFullYear();
  }

  async function include(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
      const res = await fetch(url);
      const html = await res.text();
      host.innerHTML = html;
      adjustLinks(host);
      initHeaderInteractions();
    } catch (e) {
      console.error('include failed:', url, e);
    }
  }

  function initHeaderInteractions() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const navbar = document.getElementById('navbar');

    if (!mobileMenu || !mobileMenuBtn) return;

    function openMobileMenu() {
      mobileMenu.classList.add('active');
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileMenuClose?.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay?.addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.mobile-menu-nav .nav-link').forEach((l) => {
      l.addEventListener('click', closeMobileMenu);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
      if (!navbar) return;
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    include('[data-include="header"]', 'components/header.html');
    include('[data-include="footer"]', 'components/footer.html');
  });
})();


