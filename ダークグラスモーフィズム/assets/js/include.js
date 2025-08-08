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
      // file:// などでの fetch 失敗時フォールバック
      if (location.protocol === 'file:') {
        const templates = {
          header: `<!-- fallback header -->\n<nav class="navbar" id="navbar">\n  <div class="container nav-container">\n    <a href="index.html" class="nav-brand">AI-Dev's</a>\n    <ul class="nav-menu">\n      <li><a href="index.html" class="nav-link">ホーム</a></li>\n      <li><a href="about.html" class="nav-link">会社概要</a></li>\n      <li><a href="services.html" class="nav-link">サービス</a></li>\n      <li><a href="portfolio.html" class="nav-link">実績</a></li>\n      <li><a href="contact.html" class="nav-link">お問い合わせ</a></li>\n    </ul>\n    <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="メニューを開く">\n      <i class="fas fa-bars"></i>\n    </button>\n  </div>\n</nav>\n<div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>\n<div class="mobile-menu" id="mobile-menu">\n  <div class="mobile-menu-header">\n    <a href="index.html" class="nav-brand">AI-Dev's</a>\n    <button class="mobile-menu-close" id="mobile-menu-close" aria-label="メニューを閉じる">\n      <i class="fas fa-times"></i>\n    </button>\n  </div>\n  <nav class="mobile-menu-nav">\n    <a href="index.html" class="nav-link">ホーム</a>\n    <a href="about.html" class="nav-link">会社概要</a>\n    <a href="services.html" class="nav-link">サービス</a>\n    <a href="portfolio.html" class="nav-link">実績</a>\n    <a href="contact.html" class="nav-link">お問い合わせ</a>\n  </nav>\n</div>`,
          footer: `<!-- fallback footer -->\n<footer class="footer">\n  <div class="container">\n    <div class="footer-grid">\n      <div>\n        <h3 class="nav-brand footer-brand">AI-Dev's</h3>\n        <p style="color: var(--text-muted); line-height: 1.6;">\n          AI技術で未来を創造する<br>\n          革新的なソリューションプロバイダー\n        </p>\n      </div>\n      <div>\n        <h4 class="footer-heading">サービス</h4>\n        <ul class="footer-links">\n          <li><a href="services.html#ai-development">AI開発</a></li>\n          <li><a href="services.html#data-analytics">データ分析</a></li>\n          <li><a href="services.html#system-development">システム開発</a></li>\n        </ul>\n      </div>\n      <div>\n        <h4 class="footer-heading">企業情報</h4>\n        <ul class="footer-links">\n          <li><a href="about.html">会社概要</a></li>\n          <li><a href="portfolio.html">導入実績</a></li>\n          <li><a href="contact.html">お問い合わせ</a></li>\n        </ul>\n      </div>\n      <div>\n        <h4 class="footer-heading">フォローする</h4>\n        <div class="social-links">\n          <a href="#" class="social-link" aria-label="Twitter"><i class="fab fa-twitter"></i></a>\n          <a href="#" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>\n          <a href="#" class="social-link" aria-label="GitHub"><i class="fab fa-github"></i></a>\n        </div>\n      </div>\n    </div>\n    <div class="footer-bottom">\n      <p>&copy; <span id="y"></span> AI-Dev's. All rights reserved.</p>\n    </div>\n  </div>\n</footer>`
        };
        const key = selector.includes('header') ? 'header' : 'footer';
        host.innerHTML = templates[key];
        adjustLinks(host);
        initHeaderInteractions();
      } else {
        console.error('include failed:', url, e);
      }
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


