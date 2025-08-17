// app.js - Main application logic and data handling

/**
 * Main Application Class
 */
class IndianLiteratureArchive {
  constructor() {
    this.ui = new UI();
    this.data = new DataManager();
    this.router = new Router();
    this.init();
  }

  init() {
    // Initialize modules
    this.ui.init();
    this.data.init();
    this.router.init();

    // Load initial data
    this.loadInitialData();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  loadInitialData() {
    // Load languages data
    this.data.fetchLanguages()
      .then(languages => {
        this.ui.renderLanguages(languages);
        return this.data.fetchFeaturedTexts();
      })
      .then(featuredTexts => {
        this.ui.renderFeaturedTexts(featuredTexts);
      })
      .catch(error => {
        console.error('Error loading initial data:', error);
        this.ui.showError('Failed to load data. Please try again later.');
      });
  }

  setupEventListeners() {
    // Search functionality
    document.querySelector('.search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const query = e.target.querySelector('input').value.trim();
      if (query) {
        this.handleSearch(query);
      }
    });

    // Newsletter subscription
    document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input').value.trim();
      if (email) {
        this.handleNewsletterSubscription(email);
      }
    });

    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
      this.ui.toggleMobileMenu();
    });

    // Dropdown menus
    document.querySelectorAll('.has-dropdown > a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth < 992) {
          e.preventDefault();
          this.ui.toggleDropdown(e.currentTarget.parentElement);
        }
      });
    });
  }

  handleSearch(query) {
    this.router.navigateTo(`/search?q=${encodeURIComponent(query)}`);
    this.data.searchTexts(query)
      .then(results => {
        this.ui.displaySearchResults(results);
      })
      .catch(error => {
        console.error('Search error:', error);
        this.ui.showError('Search failed. Please try again.');
      });
  }

  handleNewsletterSubscription(email) {
    this.data.subscribeToNewsletter(email)
      .then(() => {
        this.ui.showSuccess('Thank you for subscribing!');
        document.querySelector('.newsletter-form').reset();
      })
      .catch(error => {
        console.error('Subscription error:', error);
        this.ui.showError('Subscription failed. Please try again.');
      });
  }
}

/**
 * Data Manager Class
 */
class DataManager {
  constructor() {
    this.baseUrl = 'https://api.indianliteraturearchive.com/v1';
    this.cache = new Map();
  }

  init() {
    // Initialize any data-related setup
    console.log('DataManager initialized');
  }

  async fetchLanguages() {
    const cacheKey = 'languages';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}/languages`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  }

  async fetchFeaturedTexts() {
    const cacheKey = 'featured-texts';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}/texts/featured`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching featured texts:', error);
      throw error;
    }
  }

  async searchTexts(query) {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error searching texts:', error);
      throw error;
    }
  }

  async subscribeToNewsletter(email) {
    try {
      const response = await fetch(`${this.baseUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) throw new Error('Subscription failed');
      return await response.json();
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }

  async getTextById(id) {
    const cacheKey = `text-${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}/texts/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching text ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Router Class
 */
class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
  }

  init() {
    window.addEventListener('popstate', () => this.handleRouting());
    document.addEventListener('DOMContentLoaded', () => this.handleRouting());
  }

  addRoute(path, callback) {
    this.routes.push({ path, callback });
  }

  navigateTo(path) {
    history.pushState({}, '', path);
    this.handleRouting();
  }

  handleRouting() {
    const path = window.location.pathname;
    const matchingRoute = this.routes.find(route => {
      const routeRegex = new RegExp(`^${route.path.replace(/:\w+/g, '([^/]+)')}$`);
      return routeRegex.test(path);
    });

    if (matchingRoute) {
      this.currentRoute = matchingRoute;
      const params = this.extractParams(path, matchingRoute.path);
      matchingRoute.callback(params);
    } else {
      // Default route or 404 handling
      console.log('Route not found:', path);
    }
  }

  extractParams(currentPath, routePath) {
    const params = {};
    const currentParts = currentPath.split('/');
    const routeParts = routePath.split('/');

    routeParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = currentParts[index];
      }
    });

    return params;
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new IndianLiteratureArchive();
});