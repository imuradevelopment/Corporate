/**
 * AI-Dev Corporate Site - Main Application
 * モジュラーアーキテクチャによるクリーンなコード
 */

// アプリケーションのメインクラス
class AIDevApp {
  constructor() {
    this.modules = new Map();
    this.state = {
      currentPage: this.getCurrentPage(),
      isMobileMenuOpen: false,
      scrollY: 0,
      isScrolling: false
    };
    
    this.init();
  }

  // アプリケーション初期化
  init() {
    this.loadModules();
    this.setupEventListeners();
    this.initModules();
  }

  // モジュールの登録
  registerModule(name, module) {
    this.modules.set(name, module);
  }

  // モジュールの取得
  getModule(name) {
    return this.modules.get(name);
  }

  // モジュールの読み込み
  loadModules() {
    // 各モジュールを登録
    this.registerModule('navigation', new NavigationModule(this));
    this.registerModule('animations', new AnimationModule(this));
    this.registerModule('forms', new FormModule(this));
    this.registerModule('components', new ComponentModule(this));
    this.registerModule('interactions', new InteractionModule(this));
  }

  // モジュールの初期化
  initModules() {
    this.modules.forEach(module => {
      if (typeof module.init === 'function') {
        module.init();
      }
    });
  }

  // イベントリスナーの設定
  setupEventListeners() {
    // スクロールイベント
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      this.state.scrollY = window.scrollY;
      this.state.isScrolling = true;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.state.isScrolling = false;
      }, 150);
    });

    // リサイズイベント
    window.addEventListener('resize', this.debounce(() => {
      this.modules.forEach(module => {
        if (typeof module.onResize === 'function') {
          module.onResize();
        }
      });
    }, 250));
  }

  // 現在のページを取得
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page;
  }

  // ユーティリティ関数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 状態の更新
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyModules('stateChanged', this.state);
  }

  // モジュールへの通知
  notifyModules(event, data) {
    this.modules.forEach(module => {
      if (typeof module.onEvent === 'function') {
        module.onEvent(event, data);
      }
    });
  }
}

// ナビゲーションモジュール
class NavigationModule {
  constructor(app) {
    this.app = app;
    this.header = null;
    this.mobileMenuBtn = null;
    this.navMenu = null;
  }

  init() {
    this.createHeader();
    this.setupMobileMenu();
    this.setupActiveState();
    this.setupScrollBehavior();
  }

  createHeader() {
    const headerTemplate = `
      <header class="header" id="header">
        <div class="container">
          <nav class="nav">
            <a href="index.html" class="logo">
              <span class="logo__text">AI-Dev</span>
              <span class="logo__subtitle">Leading AI Innovation</span>
            </a>
            <div class="nav__menu" id="navMenu">
              <a href="index.html" class="nav__link" data-page="index">Home</a>
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

    const headerContainer = document.querySelector('[data-component="header"]');
    if (headerContainer) {
      headerContainer.innerHTML = headerTemplate;
      this.header = document.getElementById('header');
      this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
      this.navMenu = document.getElementById('navMenu');
    }
  }

  setupMobileMenu() {
    if (!this.mobileMenuBtn || !this.navMenu) return;

    this.mobileMenuBtn.addEventListener('click', () => {
      const isOpen = this.app.state.isMobileMenuOpen;
      this.app.setState({ isMobileMenuOpen: !isOpen });
      
      this.mobileMenuBtn.classList.toggle('mobile-menu-btn--active');
      this.navMenu.classList.toggle('nav__menu--active');
    });

    // メニューリンクのクリックでモバイルメニューを閉じる
    this.navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav__link')) {
        this.app.setState({ isMobileMenuOpen: false });
        this.mobileMenuBtn.classList.remove('mobile-menu-btn--active');
        this.navMenu.classList.remove('nav__menu--active');
      }
    });
  }

  setupActiveState() {
    const currentPage = this.app.state.currentPage;
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add('active');
      }
    });
  }

  setupScrollBehavior() {
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        this.header?.classList.add('header--hidden');
      } else {
        this.header?.classList.remove('header--hidden');
      }
      
      lastScrollY = currentScrollY;
    });
  }

  onResize() {
    // リサイズ時にモバイルメニューをリセット
    if (window.innerWidth > 768) {
      this.app.setState({ isMobileMenuOpen: false });
      this.mobileMenuBtn?.classList.remove('mobile-menu-btn--active');
      this.navMenu?.classList.remove('nav__menu--active');
    }
  }
}

// アニメーションモジュール
class AnimationModule {
  constructor(app) {
    this.app = app;
    this.observers = new Map();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
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

    this.observers.set('scroll', observer);
  }

  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  onEvent(event, data) {
    if (event === 'stateChanged' && data.isScrolling !== undefined) {
      // スクロール状態に応じたアニメーション制御
    }
  }
}

// フォームモジュール
class FormModule {
  constructor(app) {
    this.app = app;
  }

  init() {
    this.setupFormValidation();
    this.setupFormSubmission();
  }

  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    if (required && !value) {
      this.showFieldError(field, 'この項目は必須です');
      return false;
    }
    
    if (type === 'email' && value && !this.isValidEmail(value)) {
      this.showFieldError(field, '有効なメールアドレスを入力してください');
      return false;
    }
    
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    field.classList.add('form-input--error');
    
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
  }

  clearFieldError(field) {
    field.classList.remove('form-input--error');
    const errorEl = field.parentNode.querySelector('.form-error');
    if (errorEl) {
      errorEl.remove();
    }
  }

  setupFormSubmission() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission(form);
      });
    });
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // 全フィールドのバリデーション
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showMessage('入力内容を確認してください', 'error');
      return;
    }
    
    // 送信処理（実際のAPI呼び出しなど）
    try {
      this.showMessage('送信中...', 'info');
      // ここで実際のAPI呼び出しを行う
      await this.simulateApiCall(data);
      this.showMessage('送信が完了しました', 'success');
      form.reset();
    } catch (error) {
      this.showMessage('送信に失敗しました', 'error');
    }
  }

  async simulateApiCall(data) {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    
    const form = document.querySelector('form');
    if (form) {
      form.insertBefore(messageEl, form.firstChild);
      
      setTimeout(() => {
        messageEl.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
          messageEl.remove();
        }, 300);
      }, 5000);
    }
  }
}

// コンポーネントモジュール
class ComponentModule {
  constructor(app) {
    this.app = app;
  }

  init() {
    this.createFooter();
    this.setupCounters();
    this.setupLazyLoading();
  }

  createFooter() {
    const footerTemplate = `
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

    const footerContainer = document.querySelector('[data-component="footer"]');
    if (footerContainer) {
      footerContainer.innerHTML = footerTemplate;
    }
  }

  setupCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.counter);
          this.animateCounter(counter, target);
          observer.unobserve(counter);
        }
      });
    });

    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    updateCounter();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// インタラクションモジュール（タブとフィルター機能）
class InteractionModule {
  constructor(app) {
    this.app = app;
  }

  init() {
    this.setupServiceTabs();
    this.setupPortfolioFilter();
  }

  setupServiceTabs() {
    const tabs = document.querySelectorAll('.service-tab');
    const contents = document.querySelectorAll('.service-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        
        // タブのアクティブ状態を更新
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // コンテンツの表示を更新
        contents.forEach(content => {
          content.classList.remove('active');
          if (content.id === targetId) {
            content.classList.add('active');
          }
        });
      });
    });
  }

  setupPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // フィルターボタンのアクティブ状態を更新
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // ポートフォリオアイテムの表示を更新
        portfolioItems.forEach(item => {
          const category = item.dataset.category;
          
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.classList.add('animate-in');
          } else {
            item.style.display = 'none';
            item.classList.remove('animate-in');
          }
        });
      });
    });
  }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AIDevApp();
});
