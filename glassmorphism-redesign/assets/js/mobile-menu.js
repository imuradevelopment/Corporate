// Mobile Menu Implementation
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-menu-nav .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Add mobile menu HTML to all pages
function addMobileMenuHTML() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const mobileMenuHTML = `
        <!-- Mobile Menu -->
        <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
        <div class="mobile-menu" id="mobile-menu">
            <div class="mobile-menu-header">
                <a href="index.html" class="nav-brand">AI-Dev's</a>
                <button class="mobile-menu-close" id="mobile-menu-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="mobile-menu-nav">
                <a href="index.html" class="nav-link">ホーム</a>
                <a href="about.html" class="nav-link">会社概要</a>
                <a href="services.html" class="nav-link">サービス</a>
                <a href="portfolio.html" class="nav-link">実績</a>
                <a href="contact.html" class="nav-link">お問い合わせ</a>
            </nav>
        </div>
    `;
    
    // Insert mobile menu after navbar
    navbar.insertAdjacentHTML('afterend', mobileMenuHTML);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    addMobileMenuHTML();
    initMobileMenu();
});