/**
 * クリーンモダンデザイン - JavaScript
 * 保守性を重視した最小限の実装
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===================================
    // モバイルメニューの制御
    // ===================================
    const menuToggle = document.querySelector('.header__menu-toggle');
    const menu = document.querySelector('.header__menu');
    const menuLinks = document.querySelectorAll('.header__menu-link');
    
    if (menuToggle && menu) {
        // メニュートグルボタンのクリックイベント
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('header__menu--active');
            const isActive = menu.classList.contains('header__menu--active');
            menuToggle.setAttribute('aria-label', isActive ? 'メニューを閉じる' : 'メニューを開く');
        });
        
        // メニューリンクをクリックしたらメニューを閉じる
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('header__menu--active');
                menuToggle.setAttribute('aria-label', 'メニューを開く');
            });
        });
        
        // メニュー外をクリックしたら閉じる
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                menu.classList.remove('header__menu--active');
                menuToggle.setAttribute('aria-label', 'メニューを開く');
            }
        });
    }
    
    // ===================================
    // スムーススクロール
    // ===================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // フォームバリデーション
    // ===================================
    const contactForm = document.querySelector('.contact__form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // 簡易バリデーション
            if (!data.name || !data.email || !data.message) {
                alert('すべての項目を入力してください。');
                return;
            }
            
            // メールアドレスの形式チェック
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('有効なメールアドレスを入力してください。');
                return;
            }
            
            // 成功メッセージ（実際の送信処理は実装していません）
            alert('お問い合わせありがとうございます。\n内容を確認の上、ご連絡させていただきます。');
            contactForm.reset();
        });
    }
    
    // ===================================
    // ヘッダーのスクロール時の挙動
    // ===================================
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // スクロール方向の判定
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // 下スクロール時
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上スクロール時
            header.style.transform = 'translateY(0)';
        }
        
        // 背景の変更
        if (currentScrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--color-background)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // ===================================
    // アクセシビリティ向上のためのフォーカス管理
    // ===================================
    const focusableElements = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    
    // Tabキーでのフォーカス移動時のスタイル
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
});