(function() {
  'use strict';

  function initContactForm() {
    const form = document.querySelector('[data-js="contact-form"]');
    if (!form) return;
    
    const inputs = form.querySelectorAll('.c-form__input, .c-form__textarea, .c-form__select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('c-form__input--error')) {
          validateField(this);
        }
      });
    });
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        submitForm(form);
      }
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    field.classList.remove('c-form__input--error', 'c-form__input--success');
    
    const existingError = field.parentElement.querySelector('.c-form__error');
    if (existingError) {
      existingError.remove();
    }
    
    if (isRequired && !value) {
      errorMessage = 'この項目は必須です';
      isValid = false;
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = '有効なメールアドレスを入力してください';
        isValid = false;
      }
    } else if (field.type === 'tel' && value) {
      const telRegex = /^[0-9-+()]+$/;
      if (!telRegex.test(value)) {
        errorMessage = '有効な電話番号を入力してください';
        isValid = false;
      }
    }
    
    if (!isValid) {
      field.classList.add('c-form__input--error');
      const error = document.createElement('span');
      error.className = 'c-form__error';
      error.textContent = errorMessage;
      field.parentElement.appendChild(error);
    } else if (value) {
      field.classList.add('c-form__input--success');
    }
    
    return isValid;
  }

  function submitForm(form) {
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton.textContent;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    submitButton.classList.add('c-button--loading');
    submitButton.disabled = true;
    
    console.log('Form data:', data);
    
    setTimeout(() => {
      submitButton.classList.remove('c-button--loading');
      submitButton.textContent = '送信完了！';
      submitButton.style.background = 'var(--gradient-secondary)';
      
      showSuccessModal();
      
      setTimeout(() => {
        form.reset();
        submitButton.textContent = originalText;
        submitButton.style.background = '';
        submitButton.disabled = false;
        
        const successFields = form.querySelectorAll('.c-form__input--success');
        successFields.forEach(field => {
          field.classList.remove('c-form__input--success');
        });
      }, 3000);
    }, 2000);
  }

  function showSuccessModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: var(--glass-background);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: var(--spacing-8);
      text-align: center;
      z-index: 10000;
      transition: transform 0.3s var(--ease-bounce);
      max-width: 400px;
      box-shadow: var(--shadow-glass-lg);
    `;
    
    modal.innerHTML = `
      <div style="font-size: 48px; margin-bottom: var(--spacing-4);">✅</div>
      <h3 style="color: var(--color-text-primary); margin-bottom: var(--spacing-4);">送信完了</h3>
      <p style="color: var(--color-text-secondary);">
        お問い合わせありがとうございます。<br>
        1営業日以内にご返信させていただきます。
      </p>
    `;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.8);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    setTimeout(() => {
      overlay.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    setTimeout(() => {
      overlay.style.opacity = '0';
      modal.style.transform = 'translate(-50%, -50%) scale(0)';
      
      setTimeout(() => {
        overlay.remove();
        modal.remove();
      }, 300);
    }, 3000);
  }

  function initFloatingLabels() {
    const inputs = document.querySelectorAll('.c-form__input, .c-form__textarea');
    
    inputs.forEach(input => {
      const label = input.parentElement.querySelector('.c-form__label');
      if (!label) return;
      
      input.addEventListener('focus', function() {
        label.style.color = 'var(--color-primary)';
      });
      
      input.addEventListener('blur', function() {
        label.style.color = '';
      });
    });
  }

  function initMapInteraction() {
    const mapContainer = document.querySelector('[style*="Google Maps"]');
    if (!mapContainer) return;
    
    mapContainer.parentElement.style.cursor = 'grab';
    
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    mapContainer.parentElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      mapContainer.parentElement.style.cursor = 'grabbing';
      startX = e.pageX - mapContainer.parentElement.offsetLeft;
      startY = e.pageY - mapContainer.parentElement.offsetTop;
      scrollLeft = mapContainer.parentElement.scrollLeft;
      scrollTop = mapContainer.parentElement.scrollTop;
    });
    
    mapContainer.parentElement.addEventListener('mouseleave', () => {
      isDragging = false;
      mapContainer.parentElement.style.cursor = 'grab';
    });
    
    mapContainer.parentElement.addEventListener('mouseup', () => {
      isDragging = false;
      mapContainer.parentElement.style.cursor = 'grab';
    });
    
    mapContainer.parentElement.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - mapContainer.parentElement.offsetLeft;
      const y = e.pageY - mapContainer.parentElement.offsetTop;
      const walkX = (x - startX) * 3;
      const walkY = (y - startY) * 3;
      mapContainer.parentElement.scrollLeft = scrollLeft - walkX;
      mapContainer.parentElement.scrollTop = scrollTop - walkY;
    });
  }

  function initFAQAnimation() {
    const details = document.querySelectorAll('details');
    
    details.forEach(detail => {
      const summary = detail.querySelector('summary');
      const content = detail.querySelector('p');
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (detail.hasAttribute('open')) {
          content.style.animation = 'slideUp 0.3s ease';
          setTimeout(() => {
            detail.removeAttribute('open');
          }, 250);
        } else {
          detail.setAttribute('open', '');
          content.style.animation = 'slideDown 0.3s ease';
        }
        
        details.forEach(otherDetail => {
          if (otherDetail !== detail && otherDetail.hasAttribute('open')) {
            const otherContent = otherDetail.querySelector('p');
            otherContent.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
              otherDetail.removeAttribute('open');
            }, 250);
          }
        });
      });
    });
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideUp {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function initContactInfo() {
    const contactItems = document.querySelectorAll('.c-glass-card__content > div');
    
    contactItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 100);
    });
  }

  function init() {
    initContactForm();
    initFloatingLabels();
    initMapInteraction();
    initFAQAnimation();
    initContactInfo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();