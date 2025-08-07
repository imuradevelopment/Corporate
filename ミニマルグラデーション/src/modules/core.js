// Core Module - Application Entry Point

import { initNavigation } from './navigation.js';
import { initTheme } from './theme.js';
import { initAnimations } from './animations.js';

// Application State
const app = {
    initialized: false,
    modules: new Map(),
    config: {
        debug: false,
        animationsEnabled: true,
        smoothScroll: true
    }
};

// Initialize Application
function init() {
    if (app.initialized) return;
    
    // Register modules
    app.modules.set('navigation', initNavigation());
    app.modules.set('theme', initTheme());
    app.modules.set('animations', initAnimations());
    
    // Set initialized flag
    app.initialized = true;
    
    // Log initialization
    if (app.config.debug) {
        console.log('Application initialized', app);
    }
}

// DOM Ready Handler
function domReady(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// Export public API
export { app, domReady };

// Auto-initialize on DOM ready
domReady(init);