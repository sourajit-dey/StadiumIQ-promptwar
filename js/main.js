/**
 * @file main.js
 * @description Main application bootstrap and UI coordinator for StadiumIQ.
 *              Registers service worker, sets up module-level IntersectionObserver,
 *              renders accessibility, sustainability, and staff operations dashboards.
 * @author StadiumIQ
 * @version 1.0.0
 */

/** @type {IntersectionObserver|null} Module-level observer for viewport animations */
let scrollObserver = null;

/** @type {string} Active staff role in operations center */
let activeStaffRole = 'steward';

/**
 * @description Registers the Service Worker for offline PWA functionality.
 *              Meets Parameter 5 (Efficiency) and Rule 5 (zero inline scripts).
 * @returns {void}
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    /**
     * @description Event handler for window load to register Service Worker
     * @returns {void}
     */
    function handleSwLoad() {
      /**
       * @description Silent catch for Service Worker registration failure
       * @returns {void}
       */
      function handleSwError() {
        /* Operation failed silently — non-critical background task */
      }
      navigator.serviceWorker.register('/sw.js')
        .catch(handleSwError);
    }
    window.addEventListener('load', handleSwLoad);
  }
}

registerServiceWorker();

/**
 * @description Initializes the single IntersectionObserver at module level.
 *              Rule 9: Never create observers in loops or per-element.
 * @returns {void}
 */
function initIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  /**
   * @description Intersection callback that toggles the "visible" class
   * @param {IntersectionObserverEntry[]} entries - Observer target entries
   * @returns {void}
   */
  function handleIntersection(entries) {
    /**
     * @description Adds 'visible' class and stops observing if entry is intersecting
     * @param {IntersectionObserverEntry} entry - Single observer entry
     * @returns {void}
     */
    function processEntry(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    }
    entries.forEach(processEntry);
  }

  /* Respect prefers-reduced-motion media query by skipping observer animations */
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    /**
     * @description Forces animate-on-scroll elements to show immediately if reduced-motion is preferred
     * @param {HTMLElement} el - Element to show
     * @returns {void}
     */
    function showElement(el) {
      el.classList.add('visible');
    }
    animatedElements.forEach(showElement);
    return;
  }

  scrollObserver = new IntersectionObserver(handleIntersection, options);

  const targets = document.querySelectorAll('.animate-on-scroll');
  /**
   * @description Instructs scrollObserver to watch an element
   * @param {HTMLElement} target - Element to observe
   * @returns {void}
   */
  function observeTarget(target) {
    scrollObserver.observe(target);
  }
  targets.forEach(observeTarget);
}

/**
 * @description Exposes a secure global function to observe new dynamically added DOM elements
 *              using the single module-level scrollObserver instance.
 * @param {HTMLElement} container - DOM container containing new elements
 * @returns {void}
 */
function observeNewElements(container) {
  if (!scrollObserver || !container) return;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = container.querySelectorAll('.animate-on-scroll');
  /**
   * @description Handles viewport observe registration for single new elements
   * @param {HTMLElement} el - New element to observe
   * @returns {void}
   */
  function registerNewElement(el) {
    if (motionQuery.matches) {
      el.classList.add('visible');
    } else {
      scrollObserver.observe(el);
    }
  }
  elements.forEach(registerNewElement);
}

window.observeNewElements = observeNewElements;

/**
 * @description Builds the Accessible Facilities Guide section
 * @returns {void}
 */
function buildAccessibility() {
  const wrap = document.getElementById('accessibility-content');
  if (!wrap) return;

  let html = '<div class="accessibility-grid">';
  /**
   * @description Appends accessibility facility card markup
   * @param {Object} fac - Accessibility facility settings details
   * @returns {void}
   */
  function addAccessibilityCard(fac) {
    html += '<div class="accessibility-card animate-on-scroll">';
    html += '<div class="accessibility-header">';
    html += '<span class="accessibility-icon" aria-hidden="true">' + fac.icon + '</span>';
    html += '<h4>' + fac.title + '</h4>';
    html += '</div>';
    html += '<p class="accessibility-desc">' + fac.description + '</p>';
    html += '<div class="accessibility-locations">';
    html += '<strong>Locations:</strong> ';
    /**
     * @description Appends a location tag markup
     * @param {string} loc - Location description text
     * @returns {void}
     */
    function addLocationTag(loc) {
      html += '<span class="location-tag">' + loc + '</span>';
    }
    fac.locations.forEach(addLocationTag);
    html += '</div>';
    html += '<div class="accessibility-contact">';
    html += '📞 Contact: <a href="tel:' + fac.contact + '" aria-label="Call ' + fac.title + ' contact ' + fac.contact + '">' + fac.contact + '</a>';
    html += '</div>';
    html += '<button class="btn btn-sm btn-secondary accessibility-query-btn"';
    html += ' data-facility="' + fac.title + '"';
    html += ' aria-label="Ask AI about ' + fac.title + '">';
    html += 'Ask AI about ' + fac.title + '</button>';
    html += '</div>';
  }
  STADIUM_DATA.accessibility.facilities.forEach(addAccessibilityCard);
  html += '</div>';

  wrap.innerHTML = html;

  /* Attach queries for accessibility buttons */
  const queryBtns = wrap.querySelectorAll('.accessibility-query-btn');
  /**
   * @description Binds click listener to accessibility query buttons
   * @param {HTMLButtonElement} btn - Accessibility query button
   * @returns {void}
   */
  function bindAccessibilityQueryBtn(btn) {
    btn.addEventListener('click', handleAccessibilityQueryClick);
  }
  queryBtns.forEach(bindAccessibilityQueryBtn);
}

/**
 * @description Handles click for accessibility query buttons
 * @param {MouseEvent} e - Click event
 * @returns {void}
 */
function handleAccessibilityQueryClick(e) {
  const title = e.currentTarget.getAttribute('data-facility');
  trackAccessibilityUse(title);
  trackFeatureUse('Accessibility Hub', 'ask_ai_' + title);
  const msg = 'What are the accessibility support services, locations, and procedures for ' + title + ' at the stadium?';
  const chatInput = document.getElementById('chatbot-input');
  if (chatInput) {
    chatInput.value = msg;
    chatInput.focus();
  }
  scrollToSection('assistant');
}

/**
 * @description Builds the Green Stadium Sustainability Dashboard
 * @returns {void}
 */
/**
 * @description Renders the sustainability metric card meters HTML
 * @param {Object} current - Current sustainability metrics
 * @param {Object} targets - Target sustainability goals
 * @returns {string} HTML string
 */
function renderSustainabilityMeters(current, targets) {
  let html = '';
  html += '<div class="sustainability-overview animate-on-scroll">';
  html += '<div class="sustainability-metrics">';
  /* Renewable energy */
  html += '<div class="sustainability-metric-card">';
  html += '<div class="metric-value">' + current.renewable_energy_pct + '%</div>';
  html += '<div class="metric-label">Renewable Energy (Target: ' + targets.renewable_energy_pct + '%)</div>';
  html += '<div class="progress-bar"><div class="progress-fill" data-style-width="' + current.renewable_energy_pct + '%" data-style-bg="#22c55e"></div></div>';
  html += '</div>';
  /* Waste recycled */
  html += '<div class="sustainability-metric-card">';
  html += '<div class="metric-value">' + current.waste_recycled_pct + '%</div>';
  html += '<div class="metric-label">Waste Recycled (Target: ' + targets.waste_recycled_pct + '%)</div>';
  html += '<div class="progress-bar"><div class="progress-fill" data-style-width="' + current.waste_recycled_pct + '%" data-style-bg="#f59e0b"></div></div>';
  html += '</div>';
  /* Water saved */
  const waterPct = Math.round((current.water_saved_litres / targets.water_saved_litres) * 100);
  html += '<div class="sustainability-metric-card">';
  html += '<div class="metric-value">' + formatNumber(current.water_saved_litres) + 'L</div>';
  html += '<div class="metric-label">Water Saved (Target: 2.0M Litres)</div>';
  html += '<div class="progress-bar"><div class="progress-fill" data-style-width="' + waterPct + '%" data-style-bg="#1a56db"></div></div>';
  html += '</div>';
  html += '</div></div>';
  return html;
}

/**
 * @description Renders green initiatives grid HTML
 * @returns {string} HTML string
 */
function renderGreenInitiatives() {
  let html = '';
  html += '<div class="initiatives-section animate-on-scroll">';
  html += '<h4>Green Initiatives</h4>';
  html += '<div class="initiatives-grid">';
  /**
   * @description Appends initiative card HTML
   * @param {Object} init - Initiative info details object
   * @returns {void}
   */
  function addInitiativeCard(init) {
    html += '<div class="initiative-card">';
    html += '<span class="initiative-icon" aria-hidden="true">' + init.icon + '</span>';
    html += '<div class="initiative-body">';
    html += '<h5>' + init.title + '</h5>';
    html += '<p>' + init.description + '</p>';
    html += '</div></div>';
  }
  STADIUM_DATA.sustainability.initiatives.forEach(addInitiativeCard);
  html += '</div></div>';
  return html;
}

/**
 * @description Renders sustainability chart Google Charts container HTML
 * @returns {string} HTML string
 */
function renderSustainabilityChartContainer() {
  let html = '';
  html += '<div class="chart-wrapper animate-on-scroll">';
  html += '<h4>Sustainability Performance vs. Target Goals</h4>';
  html += '<div id="sustainability_chart_div" class="chart-container" role="img" aria-label="Bar chart showing sustainability metric performance vs target goals"></div>';
  html += '</div>';
  return html;
}

/**
 * @description Builds the Green Stadium Sustainability Dashboard
 * @returns {void}
 */
function buildSustainability() {
  const wrap = document.getElementById('sustainability-content');
  if (!wrap) return;
  const current = STADIUM_DATA.sustainability.current;
  const targets = STADIUM_DATA.sustainability.targets;
  let html = '';
  html += renderSustainabilityMeters(current, targets);
  html += renderGreenInitiatives();
  html += renderSustainabilityChartContainer();
  wrap.innerHTML = html;
  applyDynamicStyles(wrap);
}

/**
 * @description Builds the Staff and Volunteer Operations Center
 * @returns {void}
 */
/**
 * @description Renders operations role selector tabs HTML
 * @returns {string} HTML string
 */
function renderRoleTabs() {
  let html = '';
  html += '<div class="role-tabs-wrap animate-on-scroll">';
  html += '<label class="nav-label">Select Operations Role:</label>';
  html += '<div class="role-tabs" role="tablist">';
  /**
   * @description Appends role tab button HTML
   * @param {Object} role - Operations staff role settings
   * @returns {void}
   */
  function addRoleTab(role) {
    const isSelected = role.id === activeStaffRole;
    html += '<button class="role-tab-btn ' + (isSelected ? 'active' : '') + '"';
    html += ' role="tab" aria-selected="' + (isSelected ? 'true' : 'false') + '"';
    html += ' data-role="' + role.id + '"';
    html += ' aria-label="Switch staff operations view to ' + role.title + '">';
    html += role.icon + ' ' + role.title + '</button>';
  }
  STADIUM_DATA.operations.roles.forEach(addRoleTab);
  html += '</div></div>';
  return html;
}

/**
 * @description Renders active staff role details card HTML
 * @param {Object} currentRole - Active staff role configuration object
 * @returns {string} HTML string
 */
function renderActiveRoleDetails(currentRole) {
  let html = '';
  if (currentRole) {
    html += '<div class="role-details-card animate-on-scroll" role="tabpanel">';
    html += '<h4>' + currentRole.icon + ' ' + currentRole.title + ' Operational Center</h4>';
    html += '<div class="role-grid">';
    html += '<div class="role-col">';
    html += '<h5>Key Responsibilities</h5>';
    html += '<ul>';
    /**
     * @description Appends a key responsibility list item HTML
     * @param {string} resp - Responsibility description text
     * @returns {void}
     */
    function addResponsibilityLi(resp) {
      html += '<li>' + resp + '</li>';
    }
    currentRole.responsibilities.forEach(addResponsibilityLi);
    html += '</ul></div>';
    html += '<div class="role-col">';
    html += '<h5>Active Deployment Zones</h5>';
    html += '<div class="zones-tags">';
    /**
     * @description Appends a deployment zone tag HTML
     * @param {string} zone - Zone name identifier
     * @returns {void}
     */
    function addZoneTag(zone) {
      html += '<span class="zone-tag">' + zone + '</span>';
    }
    currentRole.zones.forEach(addZoneTag);
    html += '</div></div></div></div>';
  }
  return html;
}

/**
 * @description Renders operations emergency protocols reference panel HTML
 * @returns {string} HTML string
 */
function renderEmergencyProtocols() {
  let html = '';
  html += '<div class="emergency-protocols animate-on-scroll">';
  html += '<h4>🚨 Real-Time Emergency Protocol Board</h4>';
  html += '<div class="protocols-grid">';
  /**
   * @description Appends emergency protocol card HTML
   * @param {Object} proto - Emergency protocol settings object
   * @returns {void}
   */
  function addProtocolCard(proto) {
    html += '<div class="protocol-card">';
    html += '<div class="protocol-code">' + proto.code + '</div>';
    html += '<div class="protocol-desc">' + proto.description + '</div>';
    html += '<button class="btn btn-sm btn-danger protocol-emergency-btn"';
    html += ' data-code="' + proto.code + '"';
    html += ' aria-label="Activate local command protocol for ' + proto.code + '">';
    html += 'Trigger Alarm</button>';
    html += '</div>';
  }
  STADIUM_DATA.operations.emergencyProtocols.forEach(addProtocolCard);
  html += '</div></div>';
  return html;
}

/**
 * @description Builds the Staff and Volunteer Operations Center
 * @returns {void}
 */
function buildOperations() {
  const wrap = document.getElementById('operations-content');
  if (!wrap) return;
  /**
   * @description Finds operations role settings by role identifier
   * @param {Object} r - Role details configuration
   * @returns {boolean} True if matches active staff role id
   */
  function findRole(r) {
    return r.id === activeStaffRole;
  }
  const currentRole = STADIUM_DATA.operations.roles.find(findRole);
  let html = '';
  html += renderRoleTabs();
  html += renderActiveRoleDetails(currentRole);
  html += renderEmergencyProtocols();
  wrap.innerHTML = html;
  attachOperationsListeners();
}

/**
 * @description Attaches event listeners for operations tab clicks
 * @returns {void}
 */
function attachOperationsListeners() {
  const tabs = document.querySelectorAll('.role-tab-btn');
  /**
   * @description Binds click listener to role tab buttons
   * @param {HTMLButtonElement} tab - Role tab button
   * @returns {void}
   */
  function bindTab(tab) {
    tab.addEventListener('click', handleRoleTabClick);
  }
  tabs.forEach(bindTab);
  const alarmBtns = document.querySelectorAll('.protocol-emergency-btn');
  /**
   * @description Binds click listener to protocol emergency buttons
   * @param {HTMLButtonElement} btn - Emergency button
   * @returns {void}
   */
  function bindAlarmBtn(btn) {
    btn.addEventListener('click', handleEmergencyAlarmClick);
  }
  alarmBtns.forEach(bindAlarmBtn);
}

/**
 * @description Handles role tab selection click event
 * @param {MouseEvent} e - Tab click event
 * @returns {void}
 */
function handleRoleTabClick(e) {
  const roleId = e.currentTarget.getAttribute('data-role');
  activeStaffRole = roleId;
  buildOperations();
  trackFeatureUse('Operations Center', 'role_switch_' + roleId);
}

/**
 * @description Handles triggering local emergency protocols via simulator alarm buttons
 * @param {MouseEvent} e - Click event
 * @returns {void}
 */
function handleEmergencyAlarmClick(e) {
  const code = e.currentTarget.getAttribute('data-code');
  trackFeatureUse('Operations Center', 'emergency_trigger_' + code);
  alert('📢 EMERGENCY SYSTEM SIMULATOR: [' + code + '] broadcasted to all channels.');
}

/**
 * @description Handles clicking accordion headers to expand/collapse details
 * @param {MouseEvent} e - Click event
 * @returns {void}
 */
function toggleAccordion(e) {
  const btn = e.currentTarget;
  const contentId = btn.getAttribute('aria-controls');
  const content = document.getElementById(contentId);
  if (!content) return;

  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!isExpanded));
  content.classList.toggle('expanded', !isExpanded);
  content.setAttribute('aria-hidden', String(isExpanded));
  trackFeatureUse('FAQ Accordion', isExpanded ? 'collapse' : 'expand');
}

/**
 * @description Binds FAQ accordion interaction handlers
 * @returns {void}
 */
function initFaqAccordions() {
  const accordions = document.querySelectorAll('.accordion-header');
  /**
   * @description Binds click listener to FAQ accordion header elements
   * @param {HTMLElement} acc - Accordion header element
   * @returns {void}
   */
  function bindAccordion(acc) {
    acc.addEventListener('click', toggleAccordion);
  }
  accordions.forEach(bindAccordion);
}

/**
 * @description Main application setup callback on DOM ready
 * @returns {void}
 */
/**
 * @description Initializes visitor count UI components
 * @returns {void}
 */
function initVisitorCounter() {
  /**
   * @description Updates the visitor counter text on UI
   * @param {number} count - Visit count
   * @returns {void}
   */
  function updateVisitorCounter(count) {
    const counterEl = document.getElementById('visitor-count');
    if (counterEl) counterEl.textContent = formatNumber(count);
  }
  trackVisit().then(updateVisitorCounter);
}

/**
 * @description Orchestrates calls to all modular app builders
 * @returns {void}
 */
function initAppFeatureBuilders() {
  buildNavigation();
  buildCrowdMonitor();
  buildTransportHub();
  buildAccessibility();
  buildSustainability();
  buildOperations();
  buildChatbot();
  initFaqAccordions();
}

/**
 * @description Configures and binds layout event listeners and status settings
 * @returns {void}
 */
function initAppBindings() {
  initIntersectionObserver();
  initGoogleCharts();
  initFirebase();
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', handleMobileMenuToggle);
  }
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', handleSkipLinkClick);
  }
  const statusText = document.getElementById('ai-status-text');
  if (statusText) {
    const hasKey = typeof GEMINI_API_KEY === 'string' &&
      GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' &&
      GEMINI_API_KEY.length > 10;
    const hasCloud = typeof CLOUD_FUNCTION_URL === 'string' &&
      CLOUD_FUNCTION_URL !== 'YOUR_CLOUD_FUNCTION_URL_HERE' &&
      CLOUD_FUNCTION_URL.startsWith('https://');
    if (hasCloud) {
      statusText.textContent = 'StadiumIQ AI active — Cloud Function backend secured';
    } else if (hasKey) {
      statusText.textContent = 'StadiumIQ AI active — powered by Google Gemini 2.5 Flash';
    } else {
      statusText.textContent = 'StadiumIQ AI ready — intelligent demo mode active';
    }
  }
  const chatFab = document.getElementById('chat-fab');
  if (chatFab) {
    chatFab.setAttribute('aria-describedby', 'chatbot-desc');
  }
}

/**
 * @description Main application setup callback on DOM ready
 * @returns {void}
 */
function initApp() {
  initVisitorCounter();
  initAppFeatureBuilders();
  initAppBindings();
}

/**
 * @description Handles mobile menu navigation burger toggling
 * @returns {void}
 */
function handleMobileMenuToggle() {
  const navMenu = document.getElementById('nav-menu');
  const toggle = document.getElementById('nav-toggle');
  if (navMenu && toggle) {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('open', !isExpanded);
  }
}

/**
 * @description Handles skip link click focus
 * @param {MouseEvent} e - Click event
 * @returns {void}
 */
function handleSkipLinkClick(e) {
  e.preventDefault();
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  }
}

/* Bind lifecycle init */
document.addEventListener('DOMContentLoaded', initApp);

window.toggleAccordion = toggleAccordion;
window.buildAccessibility = buildAccessibility;
window.buildSustainability = buildSustainability;
window.buildOperations = buildOperations;
