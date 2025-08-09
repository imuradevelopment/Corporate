(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initAOS() {
    if (!window.AOS) return;
    // 低刺激環境ではAOSを無効化
    if (prefersReducedMotion && prefersReducedMotion()) {
      try { window.AOS.init({ disable: true }); } catch {}
      return;
    }
    window.AOS.init({ duration: 1000, once: true, offset: 100, easing: 'ease-out-cubic' });
  }

  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    var durationMs = 1000; // 総所要時間の目安
    counters.forEach(function (counter) {
      var targetRaw = counter.getAttribute('data-target');
      var targetVal = Number(targetRaw);
      if (!Number.isFinite(targetVal)) return; // 不正値は無視

      var startVal = Number(counter.innerText.replace(/[^\d.-]/g, ''));
      if (!Number.isFinite(startVal)) startVal = 0;

      var startTime = 0;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min(1, (ts - startTime) / durationMs);
        var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        var current = Math.round(startVal + (targetVal - startVal) * eased);
        counter.innerText = String(current);
        if (progress < 1) requestAnimationFrame(step);
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            requestAnimationFrame(step);
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(counter);
    });
  }

  function initParticles(options) {
    var opts = options || {};
    var canvasId = opts.canvasId || 'particle-canvas';
    var color = opts.color || 'rgba(6, 182, 212, 0.4)';
    var connectLines = !!opts.connectLines;
    var count = typeof opts.count === 'number' ? opts.count : 30;

    var canvas = document.getElementById(canvasId);
    if (!canvas || prefersReducedMotion()) return;
    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var particles = [];
    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width) this.x = 0; else if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0; else if (this.y < 0) this.y = canvas.height;
    };
    Particle.prototype.draw = function () {
      ctx.fillStyle = color.replace(/\d?\.\d+\)/, this.opacity + ')') || color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    };

    for (var i = 0; i < count; i++) particles.push(new Particle());

    var running = true;
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) { p.update(); p.draw(); });
      if (connectLines) {
        for (var i = 0; i < particles.length; i++) {
          for (var j = i + 1; j < particles.length; j++) {
            var a = particles[i], b = particles[j];
            var dx = a.x - b.x, dy = a.y - b.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              ctx.strokeStyle = color.replace(/\d?\.\d+\)/, (0.1 * (1 - dist / 150)) + ')');
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // タブ非表示時は描画を停止（省電力）
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });
  }

  function initServiceTabs() {
    var tabs = document.querySelectorAll('.service-tab');
    var details = document.querySelectorAll('.service-detail');
    if (!tabs.length || !details.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var service = tab.getAttribute('data-service');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        details.forEach(function (d) { d.classList.remove('active'); });
        var active = document.getElementById(service);
        if (active) active.classList.add('active');
      });
    });
  }

  function initPortfolioFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var items = document.querySelectorAll('.portfolio-item');
    if (!filterBtns.length || !items.length) return;
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        items.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            setTimeout(function () { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(function () { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  function initContactFormValidation() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      var message = document.getElementById('message').value;
      if (!name || !email || !message) {
        alert('必須項目を入力してください。');
        return;
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('有効なメールアドレスを入力してください。');
        return;
      }
      alert('お問い合わせを受け付けました。担当者より3営業日以内にご連絡いたします。');
      form.reset();
    });
  }

  window.Common = {
    initAOS: initAOS,
    initCounters: initCounters,
    initParticles: initParticles,
    initServiceTabs: initServiceTabs,
    initPortfolioFilter: initPortfolioFilter,
    initContactFormValidation: initContactFormValidation,
  };
})();


