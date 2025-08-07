// Navigation Module

export function initNavigation() {
    const nav = {
        elements: {
            toggle: document.getElementById('navToggle'),
            menu: document.getElementById('navMenu'),
            links: document.querySelectorAll('.nav-link'),
            navbar: document.querySelector('.nav-primary')
        },
        state: {
            isOpen: false,
            isScrolled: false,
            lastScrollY: 0
        }
    };
    
    // Mobile Menu Toggle
    function toggleMenu() {
        nav.state.isOpen = !nav.state.isOpen;
        nav.elements.menu.classList.toggle('active', nav.state.isOpen);
        nav.elements.toggle.classList.toggle('active', nav.state.isOpen);
        
        // Animate toggle lines
        const lines = nav.elements.toggle.querySelectorAll('.toggle-line');
        if (nav.state.isOpen) {
            lines[0].style.transform = 'rotate(45deg) translateY(6px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translateY(-6px)';
        } else {
            lines[0].style.transform = '';
            lines[1].style.opacity = '';
            lines[2].style.transform = '';
        }
    }
    
    // Active Link Management
    function setActiveLink() {
        const currentPath = window.location.pathname;
        nav.elements.links.forEach(link => {
            const linkPath = link.getAttribute('href');
            link.classList.toggle('active', currentPath.endsWith(linkPath));
        });
    }
    
    // Scroll Behavior
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Add scrolled class
        if (scrollY > 50) {
            if (!nav.state.isScrolled) {
                nav.state.isScrolled = true;
                nav.elements.navbar.classList.add('scrolled');
            }
        } else {
            if (nav.state.isScrolled) {
                nav.state.isScrolled = false;
                nav.elements.navbar.classList.remove('scrolled');
            }
        }
        
        // Hide/show on scroll
        if (scrollY > nav.state.lastScrollY && scrollY > 100) {
            nav.elements.navbar.style.transform = 'translateY(-100%)';
        } else {
            nav.elements.navbar.style.transform = 'translateY(0)';
        }
        
        nav.state.lastScrollY = scrollY;
    }
    
    // Smooth Scroll for Anchor Links
    function smoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = nav.elements.navbar.offsetHeight;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav.state.isOpen) {
                    toggleMenu();
                }
            }
        }
    }
    
    // Event Listeners
    function attachEvents() {
        // Mobile menu toggle
        nav.elements.toggle?.addEventListener('click', toggleMenu);
        
        // Smooth scroll for links
        nav.elements.links.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.state.isOpen && 
                !nav.elements.menu.contains(e.target) && 
                !nav.elements.toggle.contains(e.target)) {
                toggleMenu();
            }
        });
        
        // Scroll events
        let scrollTimer;
        window.addEventListener('scroll', () => {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(handleScroll, 10);
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.state.isOpen) {
                toggleMenu();
            }
        });
    }
    
    // Initialize
    setActiveLink();
    attachEvents();
    handleScroll();
    
    // Public API
    return {
        toggleMenu,
        setActiveLink,
        elements: nav.elements,
        state: nav.state
    };
}