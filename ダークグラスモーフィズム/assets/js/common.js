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
      // 安全にアルファ値を置換（rgba想定）。不一致時はそのまま使用
      var rgbaMatch = color.match(/^rgba\((\s*\d+\s*),(\s*\d+\s*),(\s*\d+\s*),(\s*\d*\.?\d+\s*)\)$/);
      ctx.fillStyle = rgbaMatch
        ? 'rgba(' + rgbaMatch[1].trim() + ',' + rgbaMatch[2].trim() + ',' + rgbaMatch[3].trim() + ',' + this.opacity + ')'
        : color;
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
              var alpha = 0.1 * (1 - dist / 150);
              var rgbaMatch2 = color.match(/^rgba\((\s*\d+\s*),(\s*\d+\s*),(\s*\d+\s*),(\s*\d*\.?\d+\s*)\)$/);
              ctx.strokeStyle = rgbaMatch2
                ? 'rgba(' + rgbaMatch2[1].trim() + ',' + rgbaMatch2[2].trim() + ',' + rgbaMatch2[3].trim() + ',' + alpha + ')'
                : color;
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

  function initCardTilt(options) {
    var opts = options || {};
    var selector = opts.selector || '.c-card';
    var maxRotate = typeof opts.maxRotate === 'number' ? opts.maxRotate : 8; // degrees
    var scale = typeof opts.scale === 'number' ? opts.scale : 1.02;
    var reduce = isReducedMotionPreferred && isReducedMotionPreferred();
    if (reduce) return; // respect reduced motion

    var cards = document.querySelectorAll(selector);
    cards.forEach(function (card) {
      card.classList.add('has-tilt');
      var rect;
      function enter() {
        rect = card.getBoundingClientRect();
        card.style.transition = 'transform 150ms ease, box-shadow 150ms ease';
      }
      function leave() {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
      function move(e) {
        if (!rect) rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        var rx = Math.max(-1, Math.min(1, dy)) * maxRotate; // invert Y for natural tilt
        var ry = Math.max(-1, Math.min(1, -dx)) * maxRotate;
        card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(' + scale + ')';
        card.style.boxShadow = '0 30px 40px -10px rgba(0,0,0,0.5), 0 20px 25px -15px rgba(0,0,0,0.3)';
      }
      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
    });
  }

  function initHeroParallax() {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    var reduce = isReducedMotionPreferred && isReducedMotionPreferred();
    if (reduce) return;
    var container = canvas.parentElement;
    var strength = 12; // px max translate
    function onMove(e) {
      var w = window.innerWidth;
      var h = window.innerHeight;
      var x = (e.clientX / w - 0.5) * 2; // -1..1
      var y = (e.clientY / h - 0.5) * 2;
      container.style.transform = 'translate3d(' + (-x * strength) + 'px,' + (-y * strength) + 'px,0)';
    }
    function onLeave() {
      container.style.transform = '';
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
  }

  function initAOSOptimize() {
    try {
      if (!window.AOS) return;
      if (isReducedMotionPreferred && isReducedMotionPreferred()) return;

      var elements = document.querySelectorAll('[data-aos]');
      var AREA_THRESHOLD = 70000; // px^2
      elements.forEach(function (el) {
        if (!el.getAttribute('data-aos-duration')) {
          var r = el.getBoundingClientRect();
          var area = Math.max(1, r.width * r.height);
          var dur = area > AREA_THRESHOLD ? 500 : 900; // 大きい要素は短め、小さい要素は長め
          el.setAttribute('data-aos-duration', String(dur));
        }
      });

      // Stagger children inside grids
      var grids = document.querySelectorAll('.o-grid');
      grids.forEach(function (grid) {
        var delay = 0;
        var step = 100;
        grid.querySelectorAll('[data-aos]').forEach(function (child) {
          if (!child.getAttribute('data-aos-delay')) {
            child.setAttribute('data-aos-delay', String(delay));
            delay += step;
          }
        });
      });

      // Recalculate AOS positions with new attributes
      if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        window.AOS.refreshHard();
      } else if (window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
      }
    } catch {}
  }

  function initContactFormValidation() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    // stepper
    var groups = form.querySelectorAll('.c-form__group');
    var dots = document.querySelectorAll('.c-stepper__dot');
    var current = 0;
    function setStep(idx) {
      groups.forEach(function (g, i) { g.classList.toggle('is-active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i <= idx); });
      current = idx;
    }
    function next() { if (current < groups.length - 1) setStep(current + 1); }
    function prev() { if (current > 0) setStep(current - 1); }

    var next1 = document.getElementById('next-1');
    var next2 = document.getElementById('next-2');
    var prev2 = document.getElementById('prev-2');
    var prev3 = document.getElementById('prev-3');
    next1 && next1.addEventListener('click', function () {
      var nameEl = document.getElementById('name');
      var emailEl = document.getElementById('email');
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var ok = true;
      // name
      if (!nameEl.value.trim()) {
        ok = false; showFieldError(nameEl, 'err-name', 'お名前を入力してください');
      } else { clearFieldError(nameEl, 'err-name'); }
      // email
      if (!emailEl.value.trim() || !emailRegex.test(emailEl.value.trim())) {
        ok = false; showFieldError(emailEl, 'err-email', '有効なメールアドレスを入力してください');
      } else { clearFieldError(emailEl, 'err-email'); }
      if (ok) next();
    });
    next2 && next2.addEventListener('click', function () { next(); });
    prev2 && prev2.addEventListener('click', function () { prev(); });
    prev3 && prev3.addEventListener('click', function () { prev(); });

    function showFieldError(input, errId, msg) {
      input.classList.add('c-input--error');
      var e = document.getElementById(errId);
      if (e) e.textContent = msg;
    }
    function clearFieldError(input, errId) {
      input.classList.remove('c-input--error');
      var e = document.getElementById(errId);
      if (e) e.textContent = '';
    }

    // realtime validation
    ['input', 'blur', 'change'].forEach(function (ev) {
      form.addEventListener(ev, function (e) {
        var t = e.target;
        if (!(t instanceof HTMLElement)) return;
        if (t.id === 'name') {
          if (!t.value.trim()) showFieldError(t, 'err-name', 'お名前を入力してください'); else clearFieldError(t, 'err-name');
        } else if (t.id === 'email') {
          var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.value.trim());
          if (!ok) showFieldError(t, 'err-email', '有効なメールアドレスを入力してください'); else clearFieldError(t, 'err-email');
        } else if (t.id === 'message') {
          if (!t.value.trim()) showFieldError(t, 'err-message', 'お問い合わせ内容を入力してください'); else clearFieldError(t, 'err-message');
        }
      }, true);
    });
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
      var service = (document.getElementById('service') || {}).value || '';
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
      // 軽い送信UIフィードバック（低刺激環境を尊重）
      try {
        var reduce = isReducedMotionPreferred && isReducedMotionPreferred();
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.7';
          if (!reduce) submitBtn.style.transform = 'scale(0.98)';
          setTimeout(function () {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.transform = '';
          }, 800);
        }
      } catch {}
      form.reset();
      setStep(0);
    });
  }

  window.Common = {
    initAOS: initAOS,
    initCounters: initCounters,
    initParticles: initParticles,
    initServiceTabs: initServiceTabs,
    initPortfolioFilter: initPortfolioFilter,
    initContactFormValidation: initContactFormValidation,
    initCardTilt: initCardTilt,
    initHeroParallax: initHeroParallax,
    initAOSOptimize: initAOSOptimize,
  };
})();


