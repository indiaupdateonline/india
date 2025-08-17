// ui.js - User interface and DOM manipulation

/**
 * UI Manager Class
 */
class UI {
  constructor() {
    this.elements = {
      mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
      mobileMenu: document.querySelector('.mobile-navigation'),
      searchForm: document.querySelector('.search-form'),
      searchToggle: document.querySelector('.search-toggle'),
      searchContainer: document.querySelector('.search-form-container'),
      languageGrid: document.querySelector('.languages-grid'),
      featuredTextsGrid: document.querySelector('.featured-texts-grid'),
      mainContent: document.getElementById('main-content'),
      backToTopBtn: document.querySelector('.back-to-top')
    };
  }

  init() {
    // Initialize UI components
    this.setupBackToTop();
    this.setupSearchToggle();
    this.setupDropdowns();
    this.setupMobileMenu();
  }

  setupBackToTop() {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        this.elements.backToTopBtn.classList.add('show');
      } else {
        this.elements.backToTopBtn.classList.remove('show');
      }
    });

    this.elements.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  setupSearchToggle() {
    if (this.elements.searchToggle) {
      this.elements.searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.elements.searchContainer.classList.toggle('active');
      });

      // Close search when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.elements.searchForm.contains(e.target) && 
            !this.elements.searchToggle.contains(e.target)) {
          this.elements.searchContainer.classList.remove('active');
        }
      });
    }
  }

  setupDropdowns() {
    document.querySelectorAll('.has-dropdown').forEach(dropdown => {
      dropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 992) {
          dropdown.classList.add('active');
          dropdown.querySelector('a').setAttribute('aria-expanded', 'true');
        }
      });

      dropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 992) {
          dropdown.classList.remove('active');
          dropdown.querySelector('a').setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  setupMobileMenu() {
    this.elements.mobileMenuToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking on a link
    this.elements.mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }

  toggleMobileMenu() {
    this.elements.mobileMenuToggle.classList.toggle('active');
    this.elements.mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    const isExpanded = this.elements.mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    this.elements.mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
  }

  closeMobileMenu() {
    this.elements.mobileMenuToggle.classList.remove('active');
    this.elements.mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
    this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }

  toggleDropdown(dropdown) {
    dropdown.classList.toggle('active');
    const isExpanded = dropdown.querySelector('a').getAttribute('aria-expanded') === 'true';
    dropdown.querySelector('a').setAttribute('aria-expanded', !isExpanded);
  }

  renderLanguages(languages) {
    if (!this.elements.languageGrid) return;

    this.elements.languageGrid.innerHTML = languages
      .map(lang => this.createLanguageCard(lang))
      .join('');
  }

  createLanguageCard(language) {
    return `
      <a href="/${language.slug}" class="language-card ${language.slug}">
        <div class="language-card-content">
          <h3 class="language-name">${language.name}</h3>
          <p class="language-period">${language.period}</p>
          <p class="language-stats">${language.textCount}+ texts</p>
        </div>
        <div class="language-script">${language.script}</div>
      </a>
    `;
  }

  renderFeaturedTexts(texts) {
    if (!this.elements.featuredTextsGrid) return;

    this.elements.featuredTextsGrid.innerHTML = texts
      .map(text => this.createTextCard(text))
      .join('');
  }

  createTextCard(text) {
    return `
      <article class="text-card">
        <div class="text-card-header">
          <span class="text-language ${text.language}">${text.languageScript}</span>
          <h3 class="text-title">${text.title}</h3>
          <p class="text-author">by ${text.author}</p>
        </div>
        <div class="text-card-body">
          <p class="text-excerpt">${text.excerpt}</p>
        </div>
        <div class="text-card-footer">
          <a href="/text/${text.id}" class="text-link">Read Translation <i class="fas fa-arrow-right"></i></a>
        </div>
      </article>
    `;
  }

  displaySearchResults(results) {
    const html = `
      <section class="section search-results-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Search Results</h2>
            <p class="section-description">Found ${results.length} matching texts</p>
          </div>
          ${results.length ? `
            <div class="search-results-grid">
              ${results.map(result => this.createSearchResultCard(result)).join('')}
            </div>
          ` : `
            <div class="no-results">
              <p>No results found. Try a different search term.</p>
            </div>
          `}
        </div>
      </section>
    `;

    this.elements.mainContent.insertAdjacentHTML('beforeend', html);
  }

  createSearchResultCard(result) {
    return `
      <div class="search-result-card">
        <h3 class="result-title"><a href="/text/${result.id}">${result.title}</a></h3>
        <p class="result-meta">${result.author} | ${result.language} | ${result.period}</p>
        <p class="result-excerpt">${result.excerpt}</p>
        <div class="result-highlights">
          ${result.highlights.map(highlight => `
            <p class="highlight">...${highlight}...</p>
          `).join('')}
        </div>
      </div>
    `;
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  }

  showLoading() {
    // Implement loading indicator
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <p>Loading...</p>
    `;
    document.body.appendChild(loader);
  }

  hideLoading() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(loader);
      }, 300);
    }
  }
}

// Export for modular use (if using ES modules)
// export { UI };