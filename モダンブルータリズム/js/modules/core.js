/**
 * Core JavaScript module
 * Modern Brutalism - AI-DEV'S
 * 
 * 最小限の機能で最大の効果を目指す
 */

(function() {
    'use strict';

    // ========================================================================
    // ナビゲーション機能
    // ========================================================================
    
    const initNavigation = () => {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const nav = document.getElementById('mainNav');
        
        if (!navToggle || !navMenu) return;
        
        // モバイルメニュートグル
        navToggle.addEventListener('click', () => {
            const isActive = navToggle.classList.contains('nav__toggle--active');
            
            navToggle.classList.toggle('nav__toggle--active');
            navMenu.classList.toggle('nav__menu--active');
            navToggle.setAttribute('aria-expanded', !isActive);
            navToggle.setAttribute('aria-label', isActive ? 'メニューを開く' : 'メニューを閉じる');
        });
        
        // メニューリンクのクリックでメニューを閉じる
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('nav__toggle--active');
                navMenu.classList.remove('nav__menu--active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'メニューを開く');
            });
        });
        
        // スクロール時のナビゲーション変更
        let lastScroll = 0;
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
            
            lastScroll = currentScroll;
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    };
    
    // ========================================================================
    // スムーススクロール
    // ========================================================================
    
    const initSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const navHeight = document.getElementById('mainNav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    };
    
    // ========================================================================
    // アニメーション監視
    // ========================================================================
    
    const initAnimations = () => {
        // Intersection Observerを使用した要素の表示アニメーション
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // 一度表示したら監視を解除
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // アニメーション対象要素を監視
        const animatedElements = document.querySelectorAll('.card, .o-section__header, .hero__content');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    };
    
    // ========================================================================
    // フォームのバリデーション（将来の実装用）
    // ========================================================================
    
    const initForms = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                // 基本的なバリデーション
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
        });
    };
    
    // ========================================================================
    // 初期化
    // ========================================================================
    
    const init = () => {
        // DOMContentLoadedを待つ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initNavigation();
                initSmoothScroll();
                initAnimations();
                initForms();
            });
        } else {
            // すでに読み込まれている場合
            initNavigation();
            initSmoothScroll();
            initAnimations();
            initForms();
        }
    };
    
    init();
    
})();