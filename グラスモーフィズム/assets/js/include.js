// include header/footer with file:// fallback and path adjustments for Glassmorphism theme
(function () {
  'use strict';

  function resolveAtPrefix(raw) {
    return raw.replace(/^@\//, '').replace(/^\.\//, '');
  }

  function adjustLinks(root) {
    // resolve data-href to href
    root.querySelectorAll('a[data-href]').forEach((a) => {
      const t = a.getAttribute('data-href');
      if (!t) return;
      a.setAttribute('href', resolveAtPrefix(t));
    });

    // aria-current based on filename
    const current = (location.pathname.split('/').pop() || 'index.html').split('#')[0];
    root.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const target = href.split('?')[0].split('#')[0].replace('./', '');
      if (target === current) a.setAttribute('aria-current', 'page');
    });
  }

  function adjustAssetPathsForDirectoryDepth(scope) {
    const isInPages = /\/pages\//.test(location.pathname);
    if (!isInPages) return;
    const root = scope || document;
    // link[href]
    root.querySelectorAll('link[href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (!href || href.startsWith('../')) return;
      if (/^(?:\.\/)?assets\//.test(href)) el.setAttribute('href', '../' + href.replace(/^\.\//, ''));
      if (/^(?:\.\/)?components\//.test(href)) el.setAttribute('href', '../' + href.replace(/^\.\//, ''));
    });
    // script[src]
    root.querySelectorAll('script[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (!src || src.startsWith('../')) return;
      if (/^(?:\.\/)?assets\//.test(src)) el.setAttribute('src', '../' + src.replace(/^\.\//, ''));
      if (/^(?:\.\/)?components\//.test(src)) el.setAttribute('src', '../' + src.replace(/^\.\//, ''));
    });
    // img[src]
    root.querySelectorAll('img[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (!src || src.startsWith('../')) return;
      if (/^(?:\.\/)?assets\//.test(src)) el.setAttribute('src', '../' + src.replace(/^\.\//, ''));
    });
    // meta og/twitter image
    root.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((el) => {
      const content = el.getAttribute('content');
      if (!content || content.startsWith('../')) return;
      if (/^(?:\.\/)?assets\//.test(content)) el.setAttribute('content', '../' + content.replace(/^\.\//, ''));
    });
  }

  function adjustPathsForDirectoryDepth() {
    const isInPages = /\/pages\//.test(location.pathname);
    // Adjust simple page links between root and pages/
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || /^(https?:)?\/\//.test(href) || href.startsWith('#')) return;
      const [hrefPath, hrefHash] = href.split('#');
      const hashSuffix = hrefHash ? '#' + hrefHash : '';
      const pageNames = ['about.html', 'services.html', 'portfolio.html', 'contact.html'];
      if (!isInPages && pageNames.includes(hrefPath) && !hrefPath.startsWith('pages/')) {
        a.setAttribute('href', 'pages/' + hrefPath + hashSuffix);
        return;
      }
      if (isInPages && hrefPath.startsWith('pages/')) {
        a.setAttribute('href', hrefPath.replace(/^pages\//, '') + hashSuffix);
        return;
      }
      if (isInPages && (hrefPath === 'index.html' || hrefPath === './index.html')) {
        a.setAttribute('href', '../index.html' + hashSuffix);
      }
    });
  }

  function initGlassHeaderInteractions(context) {
    const toggleButton = (context || document).querySelector('[data-js="nav-toggle"]');
    const linksPanel = (context || document).querySelector('[data-js="nav-links"]');
    if (!toggleButton || !linksPanel) return;
    const setOpen = (open) => {
      linksPanel.setAttribute('data-open', String(open));
      toggleButton.setAttribute('aria-expanded', String(open));
    };
    toggleButton.addEventListener('click', () => {
      const isOpen = linksPanel.getAttribute('data-open') === 'true';
      setOpen(!isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!linksPanel.contains(e.target) && !toggleButton.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    const mq = window.matchMedia('(min-width: 769px)');
    const handleResize = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener?.('change', handleResize);
    window.addEventListener('resize', handleResize, { passive: true });

    // Visual header state on scroll
    const headerEl = document.querySelector('.header');
    window.addEventListener('scroll', () => {
      if (headerEl) headerEl.classList.toggle('header--scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  function applySeoMetaFallbacks() {
    try {
      const originBase = (location && location.origin) ? location.origin : '';
      const base = originBase;
      // canonical
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical && (!canonical.getAttribute('href') || canonical.getAttribute('href') === '')) {
        const abs = base ? base + location.pathname : location.href.split(/[?#]/)[0];
        canonical.setAttribute('href', abs);
      }
      // og:url
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl && (!ogUrl.getAttribute('content') || ogUrl.getAttribute('content') === '')) {
        const abs = base ? base + location.pathname : location.href.split(/[?#]/)[0];
        ogUrl.setAttribute('content', abs);
      }
      // og:image / twitter:image → 絶対URL化
      const ensureAbs = (val) => {
        if (!val) return '';
        if (/^https?:\/\//i.test(val)) return val;
        try { return new URL(val, location.href).toString(); } catch { return val; }
      };
      const ogImage = document.querySelector('meta[property="og:image"]');
      const twImage = document.querySelector('meta[name="twitter:image"]');
      if (ogImage) ogImage.setAttribute('content', ensureAbs(ogImage.getAttribute('content')));
      if (twImage) twImage.setAttribute('content', ensureAbs(twImage.getAttribute('content')));
    } catch {}
  }

  async function include(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;
    const isInPages = /\/pages\//.test(location.pathname);
    const prefix = isInPages ? '../' : '';
    try {
      const res = await fetch(prefix + url);
      const html = await res.text();
      host.innerHTML = html;
      // 1) data-href → href を先に解決
      adjustLinks(host);
      // 2) 次にアセット/リンクのディレクトリ深度補正
      adjustAssetPathsForDirectoryDepth(host);
      adjustPathsForDirectoryDepth();
      initGlassHeaderInteractions(host);
    } catch (e) {
      if (location.protocol === 'file:') {
        // Minimal fallback using Glass header/footer markup
        const templates = {
          header: `
<header class="header" role="banner">
  <div class="container nav">
    <a class="cluster nav__brand" href="index.html" aria-label="ホーム">
      <img class="nav__logo" src="assets/img/logo.svg" alt="Company" width="32" height="32" />
      <span class="nav__title">Company</span>
    </a>
    <nav aria-label="メイン" class="nav__nav">
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" data-js="nav-toggle" aria-label="メニュー">☰</button>
      <div id="nav-links" class="nav__links" data-js="nav-links" data-open="false">
        <a class="nav__link" href="index.html">ホーム</a>
        <a class="nav__link" href="pages/about.html">私たちについて</a>
        <a class="nav__link" href="pages/services.html">サービス</a>
        <a class="nav__link" href="pages/portfolio.html">事例</a>
        <a class="nav__link" href="pages/contact.html">お問い合わせ</a>
      </div>
    </nav>
  </div>
</header>`,
          footer: `
<footer class="footer" role="contentinfo">
  <div class="container footer__wrap">
    <div>
      <a class="cluster nav__brand" href="index.html" aria-label="ホーム">
        <img class="nav__logo" src="assets/img/logo.svg" alt="Company" width="32" height="32" />
        <strong>Company</strong>
      </a>
    </div>
    <p class="footer__meta">© <span id="js-year"></span> Company Inc. All rights reserved.</p>
  </div>
</footer>`
        };
        const key = selector.includes('header') ? 'header' : 'footer';
        host.innerHTML = templates[key];
        // 1) data-href → href を先に解決
        adjustLinks(host);
        // 2) 次にアセット/リンクのディレクトリ深度補正
        adjustAssetPathsForDirectoryDepth(host);
        adjustPathsForDirectoryDepth();
        initGlassHeaderInteractions(host);
        const y = host.querySelector('#js-year');
        if (y) y.textContent = String(new Date().getFullYear());
      } else {
        console.error('include failed:', url, e);
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    adjustAssetPathsForDirectoryDepth(document);
    adjustPathsForDirectoryDepth();
    applySeoMetaFallbacks();
    include('[data-include="header"]', 'components/header.html');
    include('[data-include="footer"]', 'components/footer.html');
  });
})();


