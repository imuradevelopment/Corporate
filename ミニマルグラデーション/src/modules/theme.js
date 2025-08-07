// Theme Module

export function initTheme() {
    const theme = {
        current: 'light',
        toggle: document.getElementById('themeToggle'),
        root: document.documentElement,
        key: 'ai-devs-theme'
    };
    
    // Get saved theme or system preference
    function getInitialTheme() {
        // Check localStorage
        const saved = localStorage.getItem(theme.key);
        if (saved) return saved;
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }
    
    // Apply theme
    function applyTheme(themeName) {
        theme.current = themeName;
        theme.root.setAttribute('data-theme', themeName);
        localStorage.setItem(theme.key, themeName);
        
        // Update toggle icon
        if (theme.toggle) {
            theme.toggle.querySelector('.theme-icon').textContent = themeName === 'dark' ? '☀' : '◐';
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: themeName } }));
    }
    
    // Toggle theme
    function toggleTheme() {
        const newTheme = theme.current === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }
    
    // Watch system preference changes
    function watchSystemPreference() {
        if (!window.matchMedia) return;
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only apply if no saved preference
            if (!localStorage.getItem(theme.key)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Initialize
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);
    watchSystemPreference();
    
    // Event listeners
    theme.toggle?.addEventListener('click', toggleTheme);
    
    // Keyboard shortcut (Alt + T)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    });
    
    // Public API
    return {
        toggle: toggleTheme,
        apply: applyTheme,
        current: () => theme.current
    };
}