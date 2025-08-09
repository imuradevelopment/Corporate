(function() {
  'use strict';

  const header = document.querySelector('[data-js="header"]');
  const menuToggle = document.querySelector('[data-js="menu-toggle"]');
  const nav = document.querySelector('[data-js="nav"]');
  let lastScrollTop = 0;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      header.classList.add('c-header--scrolled');
    } else {
      header.classList.remove('c-header--scrolled');
    }
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  function handleMenuToggle() {
    const isOpen = nav.classList.contains('c-header__nav--open');
    if (isOpen) {
      nav.classList.remove('c-header__nav--open');
      menuToggle.classList.remove('c-header__menu-toggle--active');
      document.body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      nav.classList.add('c-header__nav--open');
      menuToggle.classList.add('c-header__menu-toggle--active');
      document.body.style.overflow = 'hidden';
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.c-header__nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('c-header__nav-link--active');
      const href = link.getAttribute('href').split('/').pop();
      
      if (href === currentPage) {
        link.classList.add('c-header__nav-link--active');
      }
    });
  }

  function handleGlassEffect() {
    const glassElements = document.querySelectorAll('.c-glass, .c-glass-card, .c-card');
    
    glassElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  function createGlassParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'glass-particles';
    particlesContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    `;
    
    document.body.appendChild(particlesContainer);
    
    function createParticle() {
      const particle = document.createElement('div');
      const size = Math.random() * 100 + 50;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      const x = Math.random() * window.innerWidth;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(147, 197, 253, 0.1), transparent);
        border-radius: 50%;
        left: ${x}px;
        top: -${size}px;
        animation: float-particle ${duration}s ${delay}s infinite linear;
      `;
      
      particlesContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, (duration + delay) * 1000);
    }
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-particle {
        to {
          transform: translateY(calc(100vh + 100px));
        }
      }
    `;
    document.head.appendChild(style);
    
    setInterval(createParticle, 2000);
  }

  function handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  function handleFormSubmit() {
    // 問い合わせフォームは専用スクリプトで処理するため除外
    const forms = Array.from(document.querySelectorAll('form')).filter(f => !f.matches('[data-js="contact-form"]'));
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.classList.add('c-button--loading');
        submitButton.disabled = true;
        
        setTimeout(() => {
          submitButton.classList.remove('c-button--loading');
          submitButton.textContent = '送信完了！';
          submitButton.classList.add('c-button--success');
          
          setTimeout(() => {
            form.reset();
            submitButton.textContent = originalText;
            submitButton.classList.remove('c-button--success');
            submitButton.disabled = false;
          }, 2000);
        }, 1500);
      });
    });
  }

  function handleParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }
    
    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  function handleMouseGlow() {
    const glowElements = document.querySelectorAll('.c-button--primary, .c-button--secondary, .c-card__icon');
    
    glowElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        element.style.setProperty('--glow-x', `${x}%`);
        element.style.setProperty('--glow-y', `${y}%`);
      });
    });
  }

  function initializeInteractiveElements() {
    const interactiveCards = document.querySelectorAll('.c-card--clickable');
    
    interactiveCards.forEach(card => {
      card.addEventListener('click', function() {
        this.style.animation = 'u-pulse 0.3s ease';
        setTimeout(() => {
          this.style.animation = '';
        }, 300);
      });
    });
  }

  function addLoadingAnimation() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (!img.complete) {
        img.style.opacity = '0';
        img.addEventListener('load', function() {
          this.style.transition = 'opacity 0.3s ease';
          this.style.opacity = '1';
        });
      }
    });
  }

  function init() {
    if (header) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
    
    if (menuToggle && nav) {
      if (!nav.id) nav.id = 'site-nav';
      menuToggle.setAttribute('aria-controls', nav.id);
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'メニューを開閉');
      menuToggle.addEventListener('click', handleMenuToggle);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('c-header__nav--open')) {
          nav.classList.remove('c-header__nav--open');
          menuToggle.classList.remove('c-header__menu-toggle--active');
          document.body.style.overflow = '';
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
    
    setActiveNavLink();
    handleGlassEffect();
    // 低負荷設定やトップページ以外ではパーティクルを生成しない
    const isTopPage = location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname === '';
    if (!reduceMotion && isTopPage) {
      createGlassParticles();
    }
    handleSmoothScroll();
    handleFormSubmit();
    handleParallax();
    handleMouseGlow();
    initializeInteractiveElements();
    addLoadingAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();