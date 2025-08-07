// Three.js Particle System

let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initParticles() {
    const container = document.getElementById('particles-canvas');
    if (!container) return;
    
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e27, 0.001);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Particles
    const particleCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    const colors = [
        new THREE.Color(0x00d4ff), // Cyan
        new THREE.Color(0xff0080), // Pink
        new THREE.Color(0x00ff88), // Green
        new THREE.Color(0x7b61ff)  // Purple
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        particlePositions[i3] = (Math.random() - 0.5) * 1000;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 1000;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 1000;
        
        // Color
        const color = colors[Math.floor(Math.random() * colors.length)];
        particleColors[i3] = color.r;
        particleColors[i3 + 1] = color.g;
        particleColors[i3 + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // Create particle system
    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Lines connecting particles
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(500 * 6);
    const lineColors = new Float32Array(500 * 6);
    
    for (let i = 0; i < 500; i++) {
        const i6 = i * 6;
        
        // Random line positions
        for (let j = 0; j < 6; j += 3) {
            linePositions[i6 + j] = (Math.random() - 0.5) * 800;
            linePositions[i6 + j + 1] = (Math.random() - 0.5) * 800;
            linePositions[i6 + j + 2] = (Math.random() - 0.5) * 800;
            
            // Line color (cyan with varying opacity)
            lineColors[i6 + j] = 0;
            lineColors[i6 + j + 1] = 0.831;
            lineColors[i6 + j + 2] = 1;
        }
    }
    
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    
    const linesMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.2,
        transparent: true
    });
    
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);
    
    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    animate();
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particle system
    particleSystem.rotation.x += 0.0005;
    particleSystem.rotation.y += 0.001;
    
    // Mouse interaction
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Animate individual particles
    const positions = particleSystem.geometry.attributes.position.array;
    const time = Date.now() * 0.00005;
    
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin((i + time) * 0.3) * 50;
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

// Initialize particles when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}

// Particle click effect
document.addEventListener('click', (e) => {
    const burst = document.createElement('div');
    burst.className = 'particle-burst';
    burst.style.left = e.clientX + 'px';
    burst.style.top = e.clientY + 'px';
    document.body.appendChild(burst);
    
    // Create particle elements
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';
        particle.style.setProperty('--angle', i * 30 + 'deg');
        particle.style.setProperty('--distance', Math.random() * 100 + 50 + 'px');
        burst.appendChild(particle);
    }
    
    setTimeout(() => burst.remove(), 1000);
});

// Add particle burst styles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    .particle-burst {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
    }
    
    .burst-particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--accent-cyan);
        border-radius: 50%;
        box-shadow: 0 0 6px var(--accent-cyan);
        animation: burst 1s ease-out forwards;
    }
    
    .burst-particle:nth-child(even) {
        background: var(--accent-pink);
        box-shadow: 0 0 6px var(--accent-pink);
    }
    
    @keyframes burst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance))
            ) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);