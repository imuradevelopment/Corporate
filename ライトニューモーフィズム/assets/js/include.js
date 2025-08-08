function adjustLinksAndMeta(root) {
  const isInPages = window.location.pathname.includes('/pages/');
  const prefix = isInPages ? '../' : '';
  root.querySelectorAll('a[data-href]').forEach(a => {
    const t = a.getAttribute('data-href');
    if (!t) return;
    const href = prefix + t.replace(/^@\//, '').replace(/^\.\//, '');
    a.setAttribute('href', href);
  });
  const y = root.querySelector('#y');
  if (y) y.textContent = new Date().getFullYear();
}

async function includeAll() {
  const targets = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(targets).map(async (el) => {
    const url = el.getAttribute('data-include');
    if (!url) return;
    try {
      const res = await fetch(url);
      const html = await res.text();
      el.innerHTML = html;
      adjustLinksAndMeta(el);
    } catch (e) {
      console.error('Include failed:', url, e);
    }
  }));
}

function initNavInteractions() {
  const menu = document.getElementById('site-menu');
  const toggle = document.getElementById('menu-toggle');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  }
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('#site-menu a[href]').forEach(a => {
    try {
      const href = new URL(a.href).pathname;
      if (href === path) a.classList.add('active');
    } catch (_) {}
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  await includeAll();
  initNavInteractions();
});
