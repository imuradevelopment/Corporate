(function() {
  'use strict';

  function initAOS() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.dataset.aos;
          const delay = element.dataset.aosDelay || 0;
          
          setTimeout(() => {
            element.classList.add('aos-animate');
            element.style.opacity = '1';
            
            if (animation === 'fade-up') {
              element.style.transform = 'translateY(0)';
            } else if (animation === 'fade-down') {
              element.style.transform = 'translateY(0)';
            } else if (animation === 'fade-left') {
              element.style.transform = 'translateX(0)';
            } else if (animation === 'fade-right') {
              element.style.transform = 'translateX(0)';
            } else if (animation === 'zoom-in') {
              element.style.transform = 'scale(1)';
            } else if (animation === 'zoom-out') {
              element.style.transform = 'scale(1)';
            }
          }, parseInt(delay));
          
          observer.unobserve(element);
        }
      });
    }, observerOptions);
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  function initCountAnimation() {
    const countElements = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.dataset.count);
          const duration = parseInt(element.dataset.duration) || 2000;
          const start = 0;
          const increment = target / (duration / 16);
          let current = start;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
          }, 16);
          
          observer.unobserve(element);
        }
      });
    }, observerOptions);
    
    countElements.forEach(element => {
      observer.observe(element);
    });
  }

  function initTypewriter() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
      const text = element.dataset.typewriter;
      const speed = parseInt(element.dataset.typeSpeed) || 50;
      let index = 0;
      
      element.textContent = '';
      element.style.borderRight = '2px solid var(--color-primary)';
      element.style.animation = 'blink 1s infinite';
      
      function type() {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        } else {
          element.style.borderRight = 'none';
          element.style.animation = 'none';
        }
      }
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            type();
            observer.unobserve(element);
          }
        });
      });
      
      observer.observe(element);
    });
  }

  function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const direction = element.dataset.reveal || 'bottom';
          
          element.style.animation = `reveal-${direction} 0.6s ease forwards`;
          observer.unobserve(element);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(element => {
      element.style.opacity = '0';
      observer.observe(element);
    });
  }

  function initStaggerAnimation() {
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    
    staggerContainers.forEach(container => {
      const children = container.children;
      const delay = parseInt(container.dataset.staggerDelay) || 100;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            Array.from(children).forEach((child, index) => {
              setTimeout(() => {
                child.style.animation = 'u-fade-in 0.5s ease forwards';
                child.style.transform = 'translateY(0)';
                child.style.opacity = '1';
              }, index * delay);
            });
            observer.unobserve(container);
          }
        });
      });
      
      Array.from(children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
      });
      
      observer.observe(container);
    });
  }

  function initMorphingText() {
    const morphElements = document.querySelectorAll('[data-morph]');
    
    morphElements.forEach(element => {
      const words = element.dataset.morph.split(',');
      let currentIndex = 0;
      
      element.textContent = words[0];
      
      setInterval(() => {
        element.style.animation = 'morph-out 0.3s ease';
        
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % words.length;
          element.textContent = words[currentIndex];
          element.style.animation = 'morph-in 0.3s ease';
        }, 300);
      }, 3000);
    });
  }

  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      @keyframes reveal-bottom {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes reveal-top {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes reveal-left {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes reveal-right {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes morph-out {
        from {
          opacity: 1;
          transform: scale(1);
        }
        to {
          opacity: 0;
          transform: scale(0.8);
        }
      }
      
      @keyframes morph-in {
        from {
          opacity: 0;
          transform: scale(1.2);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function initFloatingElements() {
    const floatingElements = document.querySelectorAll('[data-float]');
    
    floatingElements.forEach(element => {
      const intensity = parseFloat(element.dataset.float) || 10;
      let mouseX = 0;
      let mouseY = 0;
      let currentX = 0;
      let currentY = 0;
      
      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * intensity;
        mouseY = (e.clientY / window.innerHeight - 0.5) * intensity;
      });
      
      function animate() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
        requestAnimationFrame(animate);
      }
      
      animate();
    });
  }

  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: var(--gradient-primary);
      z-index: 10000;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    function updateProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
  }

  function init() {
    addAnimationStyles();
    initAOS();
    initCountAnimation();
    initTypewriter();
    initRevealOnScroll();
    initStaggerAnimation();
    initMorphingText();
    initFloatingElements();
    initScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();