(function() {
  'use strict';

  function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const portfolioItems = document.querySelectorAll('[data-category]');
    const portfolioGrid = document.querySelector('[data-js="portfolio-grid"]');
    
    if (!filterButtons.length || !portfolioItems.length) return;
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        filterButtons.forEach(btn => {
          btn.classList.remove('c-button--glass-primary');
          btn.classList.add('c-button--glass');
        });
        
        this.classList.remove('c-button--glass');
        this.classList.add('c-button--glass-primary');
        
        portfolioGrid.style.opacity = '0.5';
        portfolioGrid.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          portfolioItems.forEach(item => {
            const category = item.dataset.category;
            
            if (filter === 'all' || category === filter) {
              item.style.display = 'block';
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, 50);
            } else {
              item.style.opacity = '0';
              item.style.transform = 'scale(0.9)';
              setTimeout(() => {
                item.style.display = 'none';
              }, 300);
            }
          });
          
          portfolioGrid.style.opacity = '1';
          portfolioGrid.style.transform = 'scale(1)';
        }, 300);
      });
    });
    
    const allButton = document.querySelector('[data-filter="all"]');
    if (allButton) {
      allButton.classList.remove('c-button--glass');
      allButton.classList.add('c-button--glass-primary');
    }
  }

  function initPortfolioHover() {
    const portfolioCards = document.querySelectorAll('.c-card--clickable');
    
    portfolioCards.forEach(card => {
      const overlay = document.createElement('div');
      overlay.className = 'portfolio-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.9) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        border-radius: var(--radius-xl);
        display: flex;
        align-items: flex-end;
        padding: var(--spacing-6);
      `;
      
      const viewButton = document.createElement('button');
      viewButton.className = 'c-button c-button--glass c-button--sm';
      viewButton.textContent = '詳細を見る';
      viewButton.style.cssText = `
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        pointer-events: auto;
      `;
      
      overlay.appendChild(viewButton);
      card.style.position = 'relative';
      card.appendChild(overlay);
      
      card.addEventListener('mouseenter', function() {
        overlay.style.opacity = '1';
        viewButton.style.opacity = '1';
        viewButton.style.transform = 'translateY(0)';
      });
      
      card.addEventListener('mouseleave', function() {
        overlay.style.opacity = '0';
        viewButton.style.opacity = '0';
        viewButton.style.transform = 'translateY(20px)';
      });
      
      viewButton.addEventListener('click', function(e) {
        e.stopPropagation();
        showPortfolioModal(card);
      });
    });
  }

  function showPortfolioModal(card) {
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'c-glass-card';
    modalContent.style.cssText = `
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    `;
    
    const title = card.querySelector('.c-card__title').textContent;
    const content = card.querySelector('.c-card__content').innerHTML;
    const meta = card.querySelector('.c-card__meta').innerHTML;
    const img = card.querySelector('img');
    
    modalContent.innerHTML = `
      <button class="modal-close" style="
        position: absolute;
        top: var(--spacing-4);
        right: var(--spacing-4);
        width: 40px;
        height: 40px;
        background: var(--glass-background);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-full);
        color: var(--color-text-primary);
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 1;
      ">×</button>
      
      ${img ? `<img src="${img.src}" alt="${img.alt}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-xl) var(--radius-xl) 0 0; margin: -24px -24px 24px -24px;">` : ''}
      
      <div class="c-glass-card__header">
        <h2 class="c-glass-card__title">${title}</h2>
        <div style="margin-top: var(--spacing-2);">${meta}</div>
      </div>
      
      <div class="c-glass-card__content">
        ${content}
        
        <h3 style="margin-top: var(--spacing-6); margin-bottom: var(--spacing-4);">プロジェクト詳細</h3>
        <dl>
          <dt style="font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-2);">使用技術</dt>
          <dd style="margin-bottom: var(--spacing-4);">React, Node.js, MongoDB, AWS, Docker</dd>
          
          <dt style="font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-2);">成果</dt>
          <dd style="margin-bottom: var(--spacing-4);">業務効率80%改善、コスト50%削減、ユーザー満足度95%</dd>
          
          <dt style="font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-2);">チーム規模</dt>
          <dd>エンジニア5名、デザイナー2名、PM1名</dd>
        </dl>
      </div>
      
      <div class="c-glass-card__footer">
        <button class="c-button c-button--primary c-button--block">このようなプロジェクトを相談する</button>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      modal.style.opacity = '1';
      modalContent.style.transform = 'scale(1)';
    }, 10);
    
    const closeModal = () => {
      modal.style.opacity = '0';
      modalContent.style.transform = 'scale(0.9)';
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  function initPortfolioLazyLoad() {
    const images = document.querySelectorAll('.c-card__image');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  function initPortfolioSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'プロジェクトを検索...';
    searchInput.className = 'c-form__input';
    searchInput.style.cssText = `
      max-width: 400px;
      margin: 0 auto var(--spacing-8);
      display: block;
    `;
    
    const portfolioSection = document.querySelector('#portfolio .o-container');
    if (portfolioSection) {
      const filterContainer = portfolioSection.querySelector('.o-flex');
      if (filterContainer) {
        filterContainer.parentNode.insertBefore(searchInput, filterContainer.nextSibling);
      }
    }
    
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const portfolioItems = document.querySelectorAll('[data-category]');
      
      portfolioItems.forEach(item => {
        const title = item.querySelector('.c-card__title').textContent.toLowerCase();
        const content = item.querySelector('.c-card__content').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  }

  function init() {
    initPortfolioFilter();
    initPortfolioHover();
    initPortfolioLazyLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();