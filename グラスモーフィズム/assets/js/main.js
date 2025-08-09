document.addEventListener('DOMContentLoaded', () => {
  // Current year
  const yearEl = document.getElementById('js-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('.header');
  let lastScroll = 0;
  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    if (header) {
      if (currentScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }
    lastScroll = currentScroll;
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Parallax effect for background
  const updateParallax = () => {
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', scrollY);
  };
  window.addEventListener('scroll', updateParallax, { passive: true });

  // Interactive mouse follow for hover zones
  const hoverZones = document.querySelectorAll('.hover-zone');
  hoverZones.forEach(zone => {
    zone.addEventListener('mousemove', e => {
      const rect = zone.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      zone.style.setProperty('--mouse-x', `${x}%`);
      zone.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // Intersection Observer for reveal animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // For stats counters
        if (entry.target.classList.contains('stat-number')) {
          animateCounter(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe elements
  document.querySelectorAll('.reveal-text, .glass-card, .stat-number').forEach(el => {
    observer.observe(el);
  });

  // Animate number counters
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    
    if (!element.classList.contains('counted')) {
      element.classList.add('counted');
      updateCounter();
    }
  }

  // Add floating particles
  function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'glass-particles';
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
  }

  // Add floating orbs
  function createFloatingOrbs() {
    for (let i = 1; i <= 3; i++) {
      const orb = document.createElement('div');
      orb.className = 'floating-orb';
      document.body.appendChild(orb);
    }
  }

  // Glass card tilt effect on hover
  const glassCards = document.querySelectorAll('.glass-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Smooth fade-in for images
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.onload = () => {
          img.style.opacity = '1';
        };
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));

  // Performance optimized scroll handler
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', () => {
    requestTick();
    ticking = false;
  }, { passive: true });

  // Initialize effects
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    createParticles();
    createFloatingOrbs();
    initAdvancedEffects();
    initGlassMorphism();
  }

  // Add feature icon animation delays
  document.querySelectorAll('.feature__icon').forEach((icon, i) => {
    icon.style.setProperty('--i', i);
  });

  // Keyboard navigation enhancements
  document.addEventListener('keydown', e => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
      const mobileMenu = document.querySelector('.nav__links[data-open="true"]');
      const toggle = document.querySelector('.nav__toggle[aria-expanded="true"]');
      if (mobileMenu && toggle) {
        mobileMenu.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Lazy load styles for non-critical animations
  const loadAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
      .visible { opacity: 1; transform: translateY(0); }
      .glass-card:not(.visible) { opacity: 0; transform: translateY(20px); }
      .glass-card { transition: opacity 0.6s ease, transform 0.6s ease; }
    `;
    document.head.appendChild(style);
  };
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnimations);
  } else {
    setTimeout(loadAnimations, 1);
  }

  // Advanced glassmorphism effects
  function initAdvancedEffects() {
    // Dynamic aurora background
    const aurora = document.createElement('div');
    aurora.className = 'aurora';
    document.body.appendChild(aurora);

    // Morphing gradient background
    const morphBg = document.createElement('div');
    morphBg.className = 'morph-bg';
    document.body.appendChild(morphBg);

    // Interactive glass refraction
    document.querySelectorAll('.glass-ultra').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--refract-x', `${x}%`);
        el.style.setProperty('--refract-y', `${y}%`);
      });
    });

    // Chromatic text effect on scroll
    const chromaticTexts = document.querySelectorAll('.chromatic-text');
    const observerChromatic = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    });
    chromaticTexts.forEach(el => observerChromatic.observe(el));

    // Glass reflection on hover
    document.querySelectorAll('.glass-reflection').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.setProperty('--shine-duration', '0.6s');
      });
    });

    // Liquid glass morph
    const liquidElements = document.querySelectorAll('.liquid-glass');
    liquidElements.forEach(el => {
      let morphTimeout;
      el.addEventListener('mouseenter', () => {
        clearTimeout(morphTimeout);
        el.style.animationPlayState = 'running';
      });
      el.addEventListener('mouseleave', () => {
        morphTimeout = setTimeout(() => {
          el.style.animationPlayState = 'paused';
        }, 1000);
      });
    });

    // Depth layers parallax
    const depthContainers = document.querySelectorAll('.depth-layers');
    depthContainers.forEach(container => {
      container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 10;
        const y = (e.clientY - rect.top - rect.height / 2) / 10;
        
        container.querySelectorAll('.depth-layer').forEach((layer, i) => {
          const depth = (i + 1) * 2;
          layer.style.transform = `translateZ(${-i * 20}px) translateX(${x * depth}px) translateY(${y * depth}px)`;
        });
      });

      container.addEventListener('mouseleave', () => {
        container.querySelectorAll('.depth-layer').forEach((layer, i) => {
          layer.style.transform = `translateZ(${-i * 20}px)`;
        });
      });
    });

    // Prism text split animation
    document.querySelectorAll('.prism-text').forEach(text => {
      const letters = text.textContent.split('');
      text.innerHTML = letters.map(letter => 
        `<span class="prism-letter">${letter}</span>`
      ).join('');
      
      text.querySelectorAll('.prism-letter').forEach((letter, i) => {
        letter.style.animationDelay = `${i * 0.05}s`;
      });
    });

    // Glass tabs functionality
    const tabContainers = document.querySelectorAll('.glass-tabs');
    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.glass-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Tab content switching
          const target = tab.getAttribute('data-tab');
          if (target) {
            const contents = document.querySelectorAll(`[data-tab-content]`);
            contents.forEach(content => {
              content.style.display = content.getAttribute('data-tab-content') === target ? 'block' : 'none';
            });
          }
        });
      });
    });

    // Glass progress animation
    const progressBars = document.querySelectorAll('.glass-progress-bar');
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          const progress = entry.target.getAttribute('data-progress') || '100';
          entry.target.style.width = '0%';
          setTimeout(() => {
            entry.target.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
            entry.target.style.width = `${progress}%`;
          }, 100);
          entry.target.classList.add('animated');
        }
      });
    });
    progressBars.forEach(bar => progressObserver.observe(bar));

    // Tooltip system
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      const tooltipText = el.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'glass-tooltip';
      tooltip.textContent = tooltipText;
      el.style.position = 'relative';
      el.appendChild(tooltip);
    });

    // Shimmer effect trigger
    const shimmerElements = document.querySelectorAll('.glass-shimmer');
    const shimmerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty('--shimmer-play', 'running');
        }
      });
    });
    shimmerElements.forEach(el => shimmerObserver.observe(el));

    // Iridescent color cycling
    let hueRotation = 0;
    setInterval(() => {
      hueRotation = (hueRotation + 1) % 360;
      document.documentElement.style.setProperty('--hue-rotation', `${hueRotation}deg`);
    }, 50);

    // Crystal border hover
    document.querySelectorAll('.crystal-border').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.clipPath = `polygon(
          0 8%, 8% 0, 92% 0, 100% 8%,
          100% 92%, 92% 100%, 8% 100%, 0 92%
        )`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.clipPath = `polygon(
          0 10%, 10% 0, 90% 0, 100% 10%,
          100% 90%, 90% 100%, 10% 100%, 0 90%
        )`;
      });
    });

    // Blur zone activation
    const blurZones = document.querySelectorAll('.blur-zone');
    blurZones.forEach(zone => {
      zone.addEventListener('mouseenter', function() {
        this.classList.add('active');
      });
      zone.addEventListener('mouseleave', function() {
        this.classList.remove('active');
      });
    });

    // Advanced particle system
    function createAdvancedParticles() {
      const canvas = document.createElement('canvas');
      canvas.className = 'particle-canvas';
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const particleCount = 50;

      class Particle {
        constructor() {
          this.reset();
        }

        reset() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 3 + 1;
          this.speedX = (Math.random() - 0.5) * 0.5;
          this.speedY = (Math.random() - 0.5) * 0.5;
          this.opacity = Math.random() * 0.5 + 0.3;
          this.hue = Math.random() * 60 + 180;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

          this.opacity += (Math.random() - 0.5) * 0.01;
          this.opacity = Math.max(0.1, Math.min(1, this.opacity));
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
          ctx.fill();

          // Glow effect
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
          );
          gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.opacity * 0.3})`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        requestAnimationFrame(animate);
      }

      animate();

      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }

    if (window.innerWidth > 768) {
      createAdvancedParticles();
    }
  }

  // Glassmorphism interactions
  function initGlassMorphism() {
    // Dynamic glass distortion on scroll
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      document.querySelectorAll('.glass-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top > -rect.height && rect.top < window.innerHeight) {
          const distortion = Math.min(scrollVelocity * 0.02, 1);
          card.style.transform = `perspective(1000px) rotateX(${distortion}deg)`;
          setTimeout(() => {
            card.style.transform = '';
          }, 300);
        }
      });
    }, { passive: true });

    // Glass ripple effect on click
    document.addEventListener('click', e => {
      if (e.target.closest('.glass-card, .glass-ultra')) {
        const card = e.target.closest('.glass-card, .glass-ultra');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.className = 'glass-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        card.appendChild(ripple);

        setTimeout(() => ripple.remove(), 1000);
      }
    });

    // Add CSS for glass ripple
    const style = document.createElement('style');
    style.textContent = `
      .glass-ripple {
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, hsl(var(--color-accent) / .4), transparent);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleExpand 1s ease-out;
        pointer-events: none;
      }
      @keyframes rippleExpand {
        to {
          transform: translate(-50%, -50%) scale(20);
          opacity: 0;
        }
      }
      .particle-canvas {
        opacity: 0.6;
        mix-blend-mode: screen;
      }
    `;
    document.head.appendChild(style);

    // Magnetic cursor effect for glass elements
    const magneticElements = document.querySelectorAll('.btn, .glass-tab');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });

    // Glass morph on intersection
    const morphObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('glass-morph-active');
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.glass-mesh, .glass-ultra').forEach(el => {
      morphObserver.observe(el);
    });

    // Interactive glass grid
    const glassGrid = document.querySelector('.glass-grid');
    if (glassGrid) {
      glassGrid.addEventListener('mousemove', e => {
        const rect = glassGrid.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 50;
        const y = ((e.clientY - rect.top) / rect.height) * 50;
        glassGrid.style.backgroundPosition = `${x}px ${y}px`;
      });
    }

    // Neon pulse on focus
    document.querySelectorAll('input, textarea, button').forEach(el => {
      el.addEventListener('focus', () => {
        el.classList.add('neon-focus');
      });
      el.addEventListener('blur', () => {
        el.classList.remove('neon-focus');
      });
    });

    // Holographic shimmer on hover
    document.querySelectorAll('.holographic').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.animationDuration = '2s';
      });
      el.addEventListener('mouseleave', () => {
        el.style.animationDuration = '5s';
      });
    });

    // Glass notification system
    window.showGlassNotification = function(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `glass-notification glass-notification--${type}`;
      notification.innerHTML = `
        <div class="glass-notification__content">
          <span>${message}</span>
          <button class="glass-notification__close">×</button>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => notification.classList.add('show'), 10);

      const closeBtn = notification.querySelector('.glass-notification__close');
      closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      });

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    };

    // Add notification styles
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
      .glass-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: hsl(0 0% 5% / .9);
        backdrop-filter: blur(var(--glass-blur-max));
        border: 1px solid hsl(var(--glass-border));
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,.5);
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        z-index: 1000;
      }
      .glass-notification.show {
        transform: translateX(0);
      }
      .glass-notification__content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .glass-notification__close {
        background: none;
        border: none;
        color: hsl(var(--color-text));
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }
      .glass-notification__close:hover {
        background: hsl(var(--glass-bg));
      }
      .glass-notification--success {
        border-color: hsl(var(--color-success) / .5);
        box-shadow: 0 10px 40px hsl(var(--color-success) / .2);
      }
      .glass-notification--error {
        border-color: hsl(var(--color-danger) / .5);
        box-shadow: 0 10px 40px hsl(var(--color-danger) / .2);
      }
      .glass-notification--warning {
        border-color: hsl(var(--color-warning) / .5);
        box-shadow: 0 10px 40px hsl(var(--color-warning) / .2);
      }
      .neon-focus {
        outline: none !important;
        box-shadow: 0 0 0 3px hsl(var(--color-accent) / .3),
                    0 0 20px hsl(var(--color-accent) / .2) !important;
      }
      .glass-morph-active {
        animation: morphPulse 2s ease-in-out;
      }
      @keyframes morphPulse {
        0%, 100% { filter: blur(0); }
        50% { filter: blur(1px); }
      }
    `;
    document.head.appendChild(notificationStyle);
  }
});


