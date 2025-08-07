// Tech Forward Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        } else if (currentScroll > lastScroll) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
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
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu glass-card';
    
    // Get the current page to determine navigation
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || currentPath.endsWith('index.html');
    
    if (isHomePage) {
        mobileMenu.innerHTML = `
            <ul class="py-4">
                <li><a href="#home" class="block px-6 py-3 hover:bg-white/10">Home</a></li>
                <li><a href="#about" class="block px-6 py-3 hover:bg-white/10">About</a></li>
                <li><a href="#services" class="block px-6 py-3 hover:bg-white/10">Services</a></li>
                <li><a href="#portfolio" class="block px-6 py-3 hover:bg-white/10">Portfolio</a></li>
                <li><a href="#contact" class="block px-6 py-3 hover:bg-white/10">Contact</a></li>
            </ul>
        `;
    } else {
        mobileMenu.innerHTML = `
            <ul class="py-4">
                <li><a href="index.html" class="block px-6 py-3 hover:bg-white/10">Home</a></li>
                <li><a href="about.html" class="block px-6 py-3 hover:bg-white/10">About</a></li>
                <li><a href="services.html" class="block px-6 py-3 hover:bg-white/10">Services</a></li>
                <li><a href="portfolio.html" class="block px-6 py-3 hover:bg-white/10">Portfolio</a></li>
                <li><a href="contact.html" class="block px-6 py-3 hover:bg-white/10">Contact</a></li>
            </ul>
        `;
    }
    
    mobileMenu.style.display = 'none';
    navbar.appendChild(mobileMenu);
    
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
    });
    
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
        .from('.glow-button, .glass-card.hover\\:bg-white\\/10', {
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        }, '-=0.3');
    
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

// Add navbar scroll class styles
const style = document.createElement('style');
style.textContent = `
    #navbar.scrolled {
        background: rgba(10, 14, 39, 0.95) !important;
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    
    .mobile-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 1px;
    }
    
    @media (min-width: 768px) {
        .mobile-menu {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);