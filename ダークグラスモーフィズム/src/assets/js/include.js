// Lightweight include + link adjustment + header behaviors (no visual change)
(function () {
  'use strict';

  function getBasePath() {
    // GitHub Pages 配下やサブディレクトリでも動作するベースパス計算
    // 例: https://username.github.io/Corporate/branch/...
    const path = location.pathname;
    // 先頭のスラッシュを除去し、先頭ディレクトリを基準にする
    // 本プロジェクトはブランチルート直下にHTMLがある前提のため、空を返す
    return '';
  }

  function resolveHref(raw) {
    const cleaned = raw.replace(/^@\//, '').replace(/^\.\//, '');
    const base = getBasePath();
    return base ? base + cleaned : cleaned;
  }

  function adjustLinks(root) {
    root.querySelectorAll('a[data-href]').forEach((a) => {
      const t = a.getAttribute('data-href');
      if (!t) return;
      a.setAttribute('href', resolveHref(t));
    });
    const y = root.querySelector('#y');
    if (y) y.textContent = new Date().getFullYear();

    // 現在ページのaria-current設定
    const current = location.pathname.split('/').pop() || 'index.html';
    root.querySelectorAll('a[href]').forEach((a) => {
      try {
        const href = a.getAttribute('href');
        if (!href) return;
        const target = href.split('?')[0].split('#')[0].replace('./', '');
        if (target === current) a.setAttribute('aria-current', 'page');
      } catch {}
    });
  }

  function adjustPathsForDirectoryDepth() {
    // pages/ 配下かどうかで相対パスを補正（HTML自体は変更しない）
    const isInPages = /\/pages\//.test(location.pathname);

    // 1) アセット参照の補正（assets/, components/ がルート直下想定のため）
    //    link[href], script[src], img[src], meta og/twitter 画像
    if (isInPages) {
      document.querySelectorAll('link[href]').forEach((el) => {
        const href = el.getAttribute('href');
        if (!href) return;
        if (/^(?:\.\/)?assets\//.test(href)) el.setAttribute('href', '../' + href.replace(/^\.\//, ''));
        if (/^(?:\.\/)?components\//.test(href)) el.setAttribute('href', '../' + href.replace(/^\.\//, ''));
      });
      document.querySelectorAll('script[src]').forEach((el) => {
        const src = el.getAttribute('src');
        if (!src) return;
        if (/^(?:\.\/)?assets\//.test(src)) el.setAttribute('src', '../' + src.replace(/^\.\//, ''));
        if (/^(?:\.\/)?components\//.test(src)) el.setAttribute('src', '../' + src.replace(/^\.\//, ''));
      });
      document.querySelectorAll('img[src]').forEach((el) => {
        const src = el.getAttribute('src');
        if (!src) return;
        if (/^(?:\.\/)?assets\//.test(src)) el.setAttribute('src', '../' + src.replace(/^\.\//, ''));
      });
      // OGP/Twitter画像
      document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((el) => {
        const content = el.getAttribute('content');
        if (!content) return;
        if (/^(?:\.\/)?assets\//.test(content)) el.setAttribute('content', '../' + content.replace(/^\.\//, ''));
      });
    }

    // 2) ページ内リンク補正
    //    - ルート: about/services/portfolio/contact は pages/ 配下にある
    //    - pages/ 配下: index.html は 1 つ上にある
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || /^(https?:)?\/\//.test(href) || href.startsWith('#')) return;

      const pageNames = ['about.html', 'services.html', 'portfolio.html', 'contact.html'];
      if (!isInPages && pageNames.includes(href) && !href.startsWith('pages/')) {
        a.setAttribute('href', 'pages/' + href);
        return;
      }
      if (isInPages && href === 'index.html') {
        a.setAttribute('href', '../index.html');
      }
    });
  }

  async function include(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
      // pages/ 配下では 1 つ上の components/ を参照
      const isInPages = /\/pages\//.test(location.pathname);
      const prefix = isInPages ? '../' : '';
      const res = await fetch(prefix + url);
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

    function trapFocus(container) {
      const focusable = container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return () => {};
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      function handler(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      container.addEventListener('keydown', handler);
      return () => container.removeEventListener('keydown', handler);
    }

    let releaseFocus = () => {};

    function openMobileMenu() {
      mobileMenu.classList.add('active');
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      releaseFocus = trapFocus(mobileMenu);
      setTimeout(() => {
        const first = mobileMenu.querySelector('a, button');
        first && first.focus();
      }, 0);
    }
    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      releaseFocus();
      mobileMenuBtn.focus();
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

    // ESC でクローズ
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    adjustPathsForDirectoryDepth();
    include('[data-include="header"]', 'components/header.html');
    include('[data-include="footer"]', 'components/footer.html');
  });
})();


