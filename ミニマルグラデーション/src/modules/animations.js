// Animations Module

export function initAnimations() {
    const animations = {
        observers: new Map(),
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    // Intersection Observer for scroll animations
    function createObserver(options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observerOptions = { ...defaultOptions, ...options };
        
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Unobserve after animation
                    if (entry.target.dataset.animateOnce !== 'false') {
                        animations.observers.get('default')?.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);
    }
    
    // Initialize scroll animations
    function initScrollAnimations() {
        if (animations.prefersReducedMotion) return;
        
        // Create default observer
        const observer = createObserver();
        animations.observers.set('default', observer);
        
        // Observe elements
        const animatedElements = document.querySelectorAll([
            '.observe-fade',
            '.observe-slide-up',
            '.observe-scale',
            '.features-grid > *',
            '.process-step',
            '.hero-content > *'
        ].join(', '));
        
        animatedElements.forEach(el => observer.observe(el));
    }
    
    // Parallax effect for hero background
    function initParallax() {
        if (animations.prefersReducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('.gradient-orb');
        if (!parallaxElements.length) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.scrollY;
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Animate on page load
    function initLoadAnimations() {
        if (animations.prefersReducedMotion) return;
        
        // Add stagger animation to hero content
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Mouse move gradient effect
    function initMouseEffect() {
        if (animations.prefersReducedMotion) return;
        
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        });
        
        function animate() {
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            
            const gradientOrbs = hero.querySelectorAll('.gradient-orb');
            gradientOrbs.forEach((orb, index) => {
                const speed = 20 + (index * 10);
                orb.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // Number counter animation
    function animateNumbers() {
        const numbers = document.querySelectorAll('[data-count]');
        
        numbers.forEach(num => {
            const target = parseInt(num.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                num.textContent = Math.floor(current);
            }, 16);
        });
    }
    
    // Initialize all animations
    function init() {
        initScrollAnimations();
        initParallax();
        initLoadAnimations();
        initMouseEffect();
        
        // Watch for preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            animations.prefersReducedMotion = e.matches;
            if (e.matches) {
                // Disable animations
                animations.observers.forEach(observer => observer.disconnect());
            } else {
                // Re-enable animations
                initScrollAnimations();
                initParallax();
            }
        });
    }
    
    // Auto-initialize
    init();
    
    // Public API
    return {
        observers: animations.observers,
        animateNumbers,
        createObserver
    };
}