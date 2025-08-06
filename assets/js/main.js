// メインJavaScript - AI-Dev's Corporate Site

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // AOSアニメーションの初期化
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // モバイルメニューの処理
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // カウンターアニメーション
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const animate = () => {
                const value = +counter.getAttribute('data-target');
                const data = +counter.innerText;
                const time = value / speed;

                if (data < value) {
                    counter.innerText = Math.ceil(data + time);
                    setTimeout(animate, 1);
                } else {
                    counter.innerText = value;
                }
            };
            animate();
        });
    };

    // Intersection Observer for counters
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter.parentElement);
    });

    // ヘッダーのスクロール効果（修正版）
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // ヘッダーの背景とシャドウ効果
                if (scrollTop > 100) {
                    header.classList.add('shadow-2xl');
                } else {
                    header.classList.remove('shadow-2xl');
                }

                // スクロール方向の検出（より滑らかに）
                if (scrollTop > lastScrollTop && scrollTop > 300) {
                    // 下スクロール - ヘッダーを隠す
                    header.style.transform = 'translateY(-100%)';
                    header.style.transition = 'transform 0.3s ease-in-out';
                } else {
                    // 上スクロール - ヘッダーを表示
                    header.style.transform = 'translateY(0)';
                    header.style.transition = 'transform 0.3s ease-in-out';
                }

                lastScrollTop = scrollTop;
                isScrolling = false;
            });
        }
    });

    // フォームバリデーション（コンタクトページ用）
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // 簡単なバリデーション
            if (!data.name || !data.email || !data.message) {
                showNotification('すべての必須項目を入力してください', 'error');
                return;
            }

            // メールフォーマットのチェック
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('正しいメールアドレスを入力してください', 'error');
                return;
            }

            // 送信処理（実際にはサーバーへの送信処理を実装）
            showNotification('お問い合わせありがとうございます。返信をお待ちください。', 'success');
            contactForm.reset();
        });
    }

    // 通知表示関数
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // アニメーション
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // パーティクル効果（ヒーローセクション用）
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.position = 'relative';
            heroSection.appendChild(particlesContainer);
            
            // パーティクルの生成
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 3 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                particlesContainer.appendChild(particle);
            }
        }
    }

    // タイプライター効果
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // ページ固有の初期化
    const currentPath = window.location.pathname;
    
    // ホームページの初期化
    if (currentPath === '/' || currentPath.endsWith('index.html')) {
        // ヒーローセクションのパーティクル効果
        createParticles();
        
        // タイプライター効果
        const typewriterElement = document.querySelector('.typewriter');
        if (typewriterElement) {
            const text = typewriterElement.getAttribute('data-text') || 'AI駆動開発で未来を創造する';
            typeWriter(typewriterElement, text, 100);
        }
    }
    
    // サービスページの初期化
    if (currentPath.includes('services.html')) {
        initServiceTabs();
    }
    
    // ポートフォリオページの初期化
    if (currentPath.includes('portfolio.html')) {
        initPortfolioFilter();
    }
    
    // コンタクトページの初期化
    if (currentPath.includes('contact.html')) {
        initContactMap();
    }

    // ページ遷移アニメーション
    document.addEventListener('DOMContentLoaded', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // カスタムカーソル
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // リサイズイベントの最適化
    const debouncedResize = debounce(() => {
        // リサイズ時の処理
        if (window.innerWidth > 768) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }, 250);

    window.addEventListener('resize', debouncedResize);
});

// サービスタブの初期化
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.service-tab');
    const tabContents = document.querySelectorAll('.service-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            
            // アクティブクラスの切り替え
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // コンテンツの表示切り替え
            tabContents.forEach(content => {
                if (content.id === target) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });
}

// ポートフォリオフィルターの初期化
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // ボタンのアクティブ状態を切り替え
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-green-500', 'text-white');
                btn.classList.add('bg-gray-700', 'text-gray-300');
            });
            button.classList.add('active', 'bg-green-500', 'text-white');
            button.classList.remove('bg-gray-700', 'text-gray-300');
            
            // アイテムのフィルタリング
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// コンタクトマップの初期化
function initContactMap() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // 実際のマップAPIをここに実装
        // 現在はプレースホルダー
        mapContainer.innerHTML = `
            <div class="w-full h-full flex items-center justify-center">
                <div class="text-center">
                    <i class="fas fa-map text-4xl text-gray-600 mb-2"></i>
                    <p class="text-gray-600">地図を表示</p>
                </div>
            </div>
        `;
    }
}

// ユーティリティ関数
function debounce(func, wait) {
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