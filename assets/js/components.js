// コンポーネント読み込み機能（サーバー不要版）
class ComponentLoader {
    constructor() {
        this.components = {
            header: `<!-- ヘッダー / ナビゲーション -->
<header class="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg z-50">
    <nav class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <a href="index.html" class="flex items-center">
                    <!-- SVGロゴ -->
                    <svg class="w-10 h-10 mr-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="brainGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#00ccff;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <!-- 脳のシルエット -->
                        <path d="M50 10 C30 10 15 25 15 45 C15 65 30 80 50 80 C70 80 85 65 85 45 C85 25 70 10 50 10 Z" fill="url(#brainGradient3)" />
                        <!-- ニューラルネットワークのドット -->
                        <circle cx="30" cy="30" r="3" fill="white" opacity="0.8"/>
                        <circle cx="50" cy="25" r="3" fill="white" opacity="0.8"/>
                        <circle cx="70" cy="30" r="3" fill="white" opacity="0.8"/>
                        <circle cx="35" cy="50" r="3" fill="white" opacity="0.8"/>
                        <circle cx="50" cy="45" r="3" fill="white" opacity="0.8"/>
                        <circle cx="65" cy="50" r="3" fill="white" opacity="0.8"/>
                        <circle cx="40" cy="65" r="3" fill="white" opacity="0.8"/>
                        <circle cx="60" cy="65" r="3" fill="white" opacity="0.8"/>
                        <!-- 接続線 -->
                        <line x1="30" y1="30" x2="50" y2="25" stroke="white" stroke-width="1" opacity="0.5"/>
                        <line x1="50" y1="25" x2="70" y2="30" stroke="white" stroke-width="1" opacity="0.5"/>
                        <line x1="35" y1="50" x2="50" y2="45" stroke="white" stroke-width="1" opacity="0.5"/>
                        <line x1="50" y1="45" x2="65" y2="50" stroke="white" stroke-width="1" opacity="0.5"/>
                        <line x1="50" y1="45" x2="40" y2="65" stroke="white" stroke-width="1" opacity="0.5"/>
                        <line x1="50" y1="45" x2="60" y2="65" stroke="white" stroke-width="1" opacity="0.5"/>
                    </svg>
                    <span class="text-2xl font-bold text-green-400 cyber-text">AI-Dev's</span>
                </a>
            </div>
            
            <!-- デスクトップメニュー -->
            <div class="hidden md:flex items-center space-x-8">
                <a href="index.html" class="nav-link text-gray-300 hover:text-green-400 transition">ホーム</a>
                <a href="services.html" class="nav-link text-gray-300 hover:text-green-400 transition">サービス</a>
                <a href="about.html" class="nav-link text-gray-300 hover:text-green-400 transition">会社概要</a>
                <a href="portfolio.html" class="nav-link text-gray-300 hover:text-green-400 transition">実績</a>
                <a href="contact.html" class="nav-link bg-green-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-green-400 transition">お問い合わせ</a>
            </div>
            
            <!-- モバイルメニューボタン -->
            <button id="mobile-menu-btn" class="md:hidden">
                <i class="fas fa-bars text-2xl text-gray-300"></i>
            </button>
        </div>
        
        <!-- モバイルメニュー -->
        <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4">
            <a href="index.html" class="block py-2 text-gray-300 hover:text-green-400 transition">ホーム</a>
            <a href="services.html" class="block py-2 text-gray-300 hover:text-green-400 transition">サービス</a>
            <a href="about.html" class="block py-2 text-gray-300 hover:text-green-400 transition">会社概要</a>
            <a href="portfolio.html" class="block py-2 text-gray-300 hover:text-green-400 transition">実績</a>
            <a href="contact.html" class="block mt-4 bg-green-500 text-gray-900 text-center px-6 py-2 rounded-lg hover:bg-green-400 transition">お問い合わせ</a>
        </div>
    </nav>
</header>`,
            footer: `<!-- フッター -->
<footer class="bg-gray-900 py-12">
    <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <div class="flex items-center mb-4">
                    <svg class="w-8 h-8 mr-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="brainGradientFooter3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#00ccff;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path d="M50 10 C30 10 15 25 15 45 C15 65 30 80 50 80 C70 80 85 65 85 45 C85 25 70 10 50 10 Z" fill="url(#brainGradientFooter3)" />
                    </svg>
                    <span class="text-xl font-bold text-green-400">AI-Dev's</span>
                </div>
                <p class="text-gray-400">
                    AI駆動開発で未来を創造する次世代の開発パートナー
                </p>
            </div>
            
            <div>
                <h3 class="text-lg font-bold mb-4 text-white">サービス</h3>
                <ul class="space-y-2 text-gray-400">
                    <li><a href="services.html" class="hover:text-green-400 transition">AI開発</a></li>
                    <li><a href="services.html" class="hover:text-green-400 transition">データ分析</a></li>
                    <li><a href="services.html" class="hover:text-green-400 transition">システム開発</a></li>
                </ul>
            </div>
            
            <div>
                <h3 class="text-lg font-bold mb-4 text-white">会社情報</h3>
                <ul class="space-y-2 text-gray-400">
                    <li><a href="about.html" class="hover:text-green-400 transition">会社概要</a></li>
                    <li><a href="portfolio.html" class="hover:text-green-400 transition">実績</a></li>
                    <li><a href="contact.html" class="hover:text-green-400 transition">お問い合わせ</a></li>
                </ul>
            </div>
            
            <div>
                <h3 class="text-lg font-bold mb-4 text-white">連絡先</h3>
                <ul class="space-y-2 text-gray-400">
                    <li><i class="fas fa-envelope mr-2"></i>info@ai-devs.com</li>
                    <li><i class="fas fa-phone mr-2"></i>03-1234-5678</li>
                    <li><i class="fas fa-map-marker-alt mr-2"></i>東京都渋谷区</li>
                </ul>
            </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI-Dev's. All rights reserved.</p>
        </div>
    </div>
</footer>`
        };
    }

    // コンポーネントを読み込む
    loadComponent(name, selector) {
        const elements = document.querySelectorAll(selector);
        if (this.components[name]) {
            elements.forEach(element => {
                element.innerHTML = this.components[name];
            });
            console.log(`Component ${name} loaded successfully`);
        } else {
            console.error(`Component ${name} not found`);
        }
    }

    // ヘッダーを読み込む
    loadHeader() {
        this.loadComponent('header', '[data-component="header"]');
    }

    // フッターを読み込む
    loadFooter() {
        this.loadComponent('footer', '[data-component="footer"]');
    }

    // すべてのコンポーネントを読み込む
    loadAll() {
        this.loadHeader();
        this.loadFooter();
    }
}

// グローバルインスタンスを作成
window.componentLoader = new ComponentLoader();

// DOMContentLoaded時にコンポーネントを読み込む
document.addEventListener('DOMContentLoaded', function() {
    if (window.componentLoader) {
        window.componentLoader.loadAll();
    }
});