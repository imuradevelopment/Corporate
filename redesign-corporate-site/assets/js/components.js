// Tech Forward Component Loader
class ComponentLoader {
    constructor() {
        this.components = {
            header: `<!-- Tech Forward Header -->
<nav id="navbar" class="fixed top-0 w-full transition-all duration-300" style="z-index: 1001;">
    <div class="glass-card rounded-none border-x-0 border-t-0">
        <div class="container flex justify-between items-center">
            <div class="logo">
                <h1 class="text-2xl font-bold gradient-text">AI-Dev</h1>
            </div>
            <ul class="hidden md:flex space-x-8">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="services.html" class="nav-link">Services</a></li>
                <li><a href="portfolio.html" class="nav-link">Portfolio</a></li>
                <li><a href="contact.html" class="nav-link">Contact</a></li>
            </ul>
            <button class="glow-button hidden md:block">
                Get Started
            </button>
            <button id="mobile-menu-btn" class="mobile-menu-btn md:hidden">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>
    </div>
    <!-- Mobile Menu -->
    <div id="mobile-menu" class="mobile-menu">
        <ul class="mobile-nav-list">
            <li><a href="index.html" class="mobile-nav-link">
                <i class="fas fa-home mr-3"></i>
                <span>Home</span>
            </a></li>
            <li><a href="about.html" class="mobile-nav-link">
                <i class="fas fa-info-circle mr-3"></i>
                <span>About</span>
            </a></li>
            <li><a href="services.html" class="mobile-nav-link">
                <i class="fas fa-cogs mr-3"></i>
                <span>Services</span>
            </a></li>
            <li><a href="portfolio.html" class="mobile-nav-link">
                <i class="fas fa-briefcase mr-3"></i>
                <span>Portfolio</span>
            </a></li>
            <li><a href="contact.html" class="mobile-nav-link">
                <i class="fas fa-envelope mr-3"></i>
                <span>Contact</span>
            </a></li>
        </ul>
        <button class="glow-button w-full mt-6">
            Get Started
        </button>
    </div>
</nav>`,
            footer: `<!-- Tech Forward Footer -->
<footer class="py-8 border-t border-gray-800">
    <div class="container text-center">
        <p class="text-gray-500">&copy; 2024 AI-Dev. All rights reserved.</p>
    </div>
</footer>`
        };
    }

    loadComponent(name, selector) {
        const elements = document.querySelectorAll(selector);
        if (this.components[name]) {
            elements.forEach(element => {
                element.innerHTML = this.components[name];
            });
        }
    }

    loadHeader() {
        // すべてのページで同じヘッダーを使用（ファイルリンク）
        this.loadComponent('header', '[data-component="header"]');
        
        // アクティブなナビゲーションを設定
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-link');
            const currentFile = window.location.href.split('/').pop() || 'index.html';
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentFile) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }

    loadFooter() {
        this.loadComponent('footer', '[data-component="footer"]');
    }

    loadAll() {
        this.loadHeader();
        this.loadFooter();
    }
}

// コンポーネントローダーを初期化
window.componentLoader = new ComponentLoader();

// ページ読み込み時にコンポーネントをロード
document.addEventListener('DOMContentLoaded', function() {
    window.componentLoader.loadAll();
});