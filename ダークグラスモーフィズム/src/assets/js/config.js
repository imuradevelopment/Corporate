// Site-level configuration for production deployment
// Fill these values after deciding the public URL. JS will use them where applicable.
// Note: For SEO (canonical/og:url), static HTML values are preferred, but this
// runtime fallback helps keep links consistent during preview/staging.

(function () {
  'use strict';

  var origin = '';
  try { origin = (location && location.origin) ? location.origin : ''; } catch {}

  window.SiteConfig = window.SiteConfig || {
    // 本番URL。未設定時は location.origin を既定値に使用
    baseUrl: origin,

    // ソーシャルカード。未設定時は既定の OGP 画像を絶対URL化
    ogImageAbsoluteUrl: origin ? origin + '/assets/img/ogp.png' : ''
  };
})();


