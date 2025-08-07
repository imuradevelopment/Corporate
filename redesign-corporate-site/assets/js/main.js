// AI-Dev Corporate Site - Clean & Modern JavaScript

class AIDevApp {
  constructor() {
    this.state = {
      isMobileMenuOpen: false,
      currentPage: this.getCurrentPage()
    };
    
    this.init();
  }

  init() {
    this.loadComponents();
    this.initNavigation();
    this.initAnimations();
    this.initPageSpecific();
  }

  // ===== COMPONENT SYSTEM =====
  loadComponents() {
    const components = {
      header: this.createHeader(),
      footer: this.createFooter()
    };

    document.querySelectorAll('[data-component]').forEach(el => {
      const componentName = el.dataset.component;
      if (components[componentName]) {
        el.innerHTML = components[componentName];
      }
    });
  }

  createHeader() {
    return `
      <header class="header">
        <div class="container">
          <nav class="nav">
            <a href="index.html" class="logo">
              <span class="logo__text">AI-Dev</span>
              <span class="logo__subtitle">Leading AI Innovation</span>
            </a>
            <div class="nav__menu" id="navMenu">
              <a href="index.html" class="nav__link" data-page="home">Home</a>
              <a href="about.html" class="nav__link" data-page="about">About</a>
              <a href="services.html" class="nav__link" data-page="services">Services</a>
              <a href="portfolio.html" class="nav__link" data-page="portfolio">Portfolio</a>
              <a href="contact.html" class="nav__link" data-page="contact">Contact</a>
            </div>
            <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>
    `;
  }

  createFooter() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer__content">
            <div class="footer__section">
              <h3>AI-Dev</h3>
              <p>Pioneering AI Solutions for Tomorrow's Challenges</p>
              <div class="social-links">
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
              </div>
            </div>
            <div class="footer__section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="services.html">Our Services</a></li>
                <li><a href="portfolio.html">Portfolio</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div class="footer__section">
              <h4>Services</h4>
              <ul>
                <li><a href="services.html#ai-solutions">AI Solutions</a></li>
                <li><a href="services.html#ml-models">Machine Learning</a></li>
                <li><a href="services.html#data-analytics">Data Analytics</a></li>
                <li><a href="services.html#automation">Automation</a></li>
              </ul>
            </div>
            <div class="footer__section">
              <h4>Contact Info</h4>
              <ul>
                <li><i class="fas fa-map-marker-alt"></i> Tokyo, Japan</li>
                <li><i class="fas fa-phone"></i> +81 3-1234-5678</li>
                <li><i class="fas fa-envelope"></i> info@ai-dev.tech</li>
              </ul>
            </div>
          </div>
          <div class="footer__bottom">
            <p>&copy; 2024 AI-Dev. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }

  // ===== NAVIGATION =====
  initNavigation() {
    this.setupMobileMenu();
    this.setupActiveState();
    this.setupScrollBehavior();
  }

  setupMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuBtn || !navMenu) return;

    const toggleMenu = () => {
      this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
      menuBtn.classList.toggle('mobile-menu-btn--active');
      navMenu.classList.toggle('nav__menu--active');
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
        this.state.isMobileMenuOpen = false;
        menuBtn.classList.remove('mobile-menu-btn--active');
        navMenu.classList.remove('nav__menu--active');
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        this.state.isMobileMenuOpen = false;
        menuBtn.classList.remove('mobile-menu-btn--active');
        navMenu.classList.remove('nav__menu--active');
      });
    });
  }

  setupActiveState() {
    document.querySelectorAll('.nav__link').forEach(link => {
      if (link.dataset.page === this.state.currentPage) {
        link.classList.add('nav__link--active');
      }
    });
  }

  setupScrollBehavior() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    const updateHeader = () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      
      lastScroll = currentScroll;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('about')) return 'about';
    if (path.includes('services')) return 'services';
    if (path.includes('portfolio')) return 'portfolio';
    if (path.includes('contact')) return 'contact';
    return 'home';
  }

  // ===== ANIMATIONS =====
  initAnimations() {
    this.setupScrollAnimations();
    this.setupCounters();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  setupCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          this.animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  // ===== PAGE SPECIFIC =====
  initPageSpecific() {
    const pageHandlers = {
      services: () => this.initServicesPage(),
      portfolio: () => this.initPortfolioPage(),
      contact: () => this.initContactPage()
    };

    const handler = pageHandlers[this.state.currentPage];
    if (handler) handler();
    
    // Initialize FAQ functionality for all pages
    this.initFAQ();
  }

  initFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  initServicesPage() {
    const tabs = document.querySelectorAll('.service-tab');
    const contents = document.querySelectorAll('.service-content');
    
    if (!tabs.length || !contents.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const targetContent = document.getElementById(target);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  }

  initPortfolioPage() {
    const filters = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    
    if (!filters.length || !items.length) return;

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        const category = filter.dataset.filter;
        
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        items.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            setTimeout(() => item.classList.add('show'), 10);
          } else {
            item.classList.remove('show');
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });
  }

  initContactPage() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      if (!this.validateForm(data)) return;
      
      this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
      form.reset();
    });
  }

  validateForm(data) {
    if (!data.name || !data.email || !data.message) {
      this.showMessage('Please fill in all required fields', 'error');
      return false;
    }
    
    if (!this.validateEmail(data.email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return false;
    }
    
    return true;
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    
    const form = document.getElementById('contactForm');
    if (form) {
      form.parentNode.insertBefore(messageEl, form.nextSibling);
      setTimeout(() => messageEl.remove(), 5000);
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AIDevApp());
} else {
  new AIDevApp();
}
