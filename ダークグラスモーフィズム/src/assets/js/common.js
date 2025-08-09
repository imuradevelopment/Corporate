(function () {
  'use strict';

  function isReducedMotionPreferred() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initAOS() {
    if (!window.AOS) return;
    // 低刺激環境ではAOSを無効化
    if (isReducedMotionPreferred && isReducedMotionPreferred()) {
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
    if (!canvas || isReducedMotionPreferred()) return;
    var ctx = canvas.getContext('2d');

    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var viewWidth = 0;
    var viewHeight = 0;
    function resize() {
      var displayWidth = window.innerWidth;
      var displayHeight = window.innerHeight;
      viewWidth = displayWidth;
      viewHeight = displayHeight;
      canvas.style.width = displayWidth + 'px';
      canvas.style.height = displayHeight + 'px';
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var particles = [];
    function Particle() {
      this.x = Math.random() * viewWidth;
      this.y = Math.random() * viewHeight;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > viewWidth) this.x = 0; else if (this.x < 0) this.x = viewWidth;
      if (this.y > viewHeight) this.y = 0; else if (this.y < 0) this.y = viewHeight;
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
      ctx.clearRect(0, 0, viewWidth, viewHeight);
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
    var tabs = document.querySelectorAll('.c-service__tab');
    var details = document.querySelectorAll('.c-service__detail');
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
    var filterBtns = document.querySelectorAll('.c-filter__button');
    var items = document.querySelectorAll('.c-portfolio__item');
    if (!filterBtns.length || !items.length) return;
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
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
      var error = document.getElementById('form-error');
      if (!error) {
        error = document.createElement('div');
        error.id = 'form-error';
        error.setAttribute('role', 'alert');
        error.setAttribute('aria-live', 'polite');
        error.style.minHeight = '1.25rem';
        error.style.marginBottom = '0.5rem';
        error.style.color = 'var(--accent-pink)';
        form.insertBefore(error, form.firstChild);
      }

      function setError(msg, focusId) {
        error.textContent = msg;
        if (focusId) {
          var el = document.getElementById(focusId);
          if (el) el.focus();
        }
      }

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        setError('必須項目を入力してください。', !name ? 'name' : !email ? 'email' : 'message');
        return;
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('有効なメールアドレスを入力してください。', 'email');
        return;
      }

      // Success
      error.style.color = 'var(--accent-cyan)';
      error.textContent = 'お問い合わせを受け付けました。担当者より3営業日以内にご連絡いたします。';
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


