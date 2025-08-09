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
});


