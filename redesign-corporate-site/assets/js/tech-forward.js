// Tech Forward Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Get elements
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    // Navigation Scroll Effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        } else if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down - hide navbar only if mobile menu is not open
            if (!mobileMenu || !mobileMenu.classList.contains('active')) {
                navbar.style.transform = 'translateY(-100%)';
            }
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            navbar.classList.add('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth Scroll for Navigation Links
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
    
    // Mobile Menu Toggle with smooth animation
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    if (mobileMenuBtn && mobileMenu) {
        // Set current page active state
        const currentPath = window.location.pathname;
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
        
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                // Close menu
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            } else {
                // Open menu
                mobileMenuBtn.classList.add('active');
                mobileMenu.classList.add('active');
                overlay.classList.add('active');
                body.style.overflow = 'hidden';
            }
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
        
        // Close menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        // Close menu on window resize if open
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
    
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // GSAP Animations
    
    // Hero Section Animation
    gsap.timeline()
        .from('.float-animation h1 span:first-child', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.float-animation h1 span:last-child', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.float-animation p', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
    
    // Service Cards Parallax
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Portfolio Cards 3D Effect
    document.querySelectorAll('.card-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
    
    // Parallax Background Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.grid-background');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Form Handling
    const contactForm = document.querySelector('form');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add pulse effect to button
        const button = e.target.querySelector('.glow-button');
        button.classList.add('pulse');
        
        // Simulate form submission
        setTimeout(() => {
            button.classList.remove('pulse');
            button.textContent = '送信完了!';
            button.style.background = 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))';
            
            // Reset form
            setTimeout(() => {
                e.target.reset();
                button.textContent = '送信する';
                button.style.background = '';
            }, 3000);
        }, 1500);
    });
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.glass-card, h2, p');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
                
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => fadeObserver.observe(el));
});

