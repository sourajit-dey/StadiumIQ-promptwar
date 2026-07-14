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
    window.addEventListener('load', function handleSwLoad() {
      navigator.serviceWorker.register('/sw.js')
        .catch(function() {
          /* Fallback failure path: silences registration errors */
        });
    });
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
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }

  /* Respect prefers-reduced-motion media query by skipping observer animations */
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(function(el) {
      el.classList.add('visible');
    });
    return;
  }

  scrollObserver = new IntersectionObserver(handleIntersection, options);

  const targets = document.querySelectorAll('.animate-on-scroll');
  targets.forEach(function(target) {
    scrollObserver.observe(target);
  });
}

/**
 * @description Builds the Accessible Facilities Guide section
 * @returns {void}
 */
function buildAccessibility() {
  const wrap = document.getElementById('accessibility-content');
  if (!wrap) return;

  let html = '<div class="accessibility-grid">';
  STADIUM_DATA.accessibility.facilities.forEach(function(fac) {
    html += '<div class="accessibility-card animate-on-scroll">';
    html += '<div class="accessibility-header">';
    html += '<span class="accessibility-icon" aria-hidden="true">' + fac.icon + '</span>';
    html += '<h4>' + fac.title + '</h4>';
    html += '</div>';
    html += '<p class="accessibility-desc">' + fac.description + '</p>';
    html += '<div class="accessibility-locations">';
    html += '<strong>Locations:</strong> ';
    fac.locations.forEach(function(loc) {
      html += '<span class="location-tag">' + loc + '</span>';
    });
    html += '</div>';
    html += '<div class="accessibility-contact">';
    html += '📞 Contact: <a href="tel:' + fac.contact + '" aria-label="Call ' + fac.title + ' contact ' + fac.contact + '">' + fac.contact + '</a>';
    html += '</div>';
    html += '<button class="btn btn-sm btn-secondary accessibility-query-btn"';
    html += ' data-facility="' + fac.title + '"';
    html += ' aria-label="Ask AI about ' + fac.title + '">';
    html += 'Ask AI about ' + fac.title + '</button>';
    html += '</div>';
  });
  html += '</div>';

  wrap.innerHTML = html;

  /* Attach queries for accessibility buttons */
  const queryBtns = wrap.querySelectorAll('.accessibility-query-btn');
  queryBtns.forEach(function(btn) {
    btn.addEventListener('click', handleAccessibilityQueryClick);
  });
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
function buildSustainability() {
  const wrap = document.getElementById('sustainability-content');
  if (!wrap) return;

  const current = STADIUM_DATA.sustainability.current;
  const targets = STADIUM_DATA.sustainability.targets;

  let html = '';

  /* Current progress meters */
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

  /* Initiatives Grid */
  html += '<div class="initiatives-section animate-on-scroll">';
  html += '<h4>Green Initiatives</h4>';
  html += '<div class="initiatives-grid">';
  STADIUM_DATA.sustainability.initiatives.forEach(function(init) {
    html += '<div class="initiative-card">';
    html += '<span class="initiative-icon" aria-hidden="true">' + init.icon + '</span>';
    html += '<div class="initiative-body">';
    html += '<h5>' + init.title + '</h5>';
    html += '<p>' + init.description + '</p>';
    html += '</div></div>';
  });
  html += '</div></div>';

  /* Google Chart Div */
  html += '<div class="chart-wrapper animate-on-scroll">';
  html += '<h4>Sustainability Performance vs. Target Goals</h4>';
  html += '<div id="sustainability_chart_div" class="chart-container" role="img" aria-label="Bar chart showing sustainability metric performance vs target goals"></div>';
  html += '</div>';

  wrap.innerHTML = html;
  applyDynamicStyles(wrap);
}

/**
 * @description Builds the Staff and Volunteer Operations Center
 * @returns {void}
 */
function buildOperations() {
  const wrap = document.getElementById('operations-content');
  if (!wrap) return;

  const currentRole = STADIUM_DATA.operations.roles.find(function(r) {
    return r.id === activeStaffRole;
  });

  let html = '';

  /* Role selector Tabs */
  html += '<div class="role-tabs-wrap animate-on-scroll">';
  html += '<label class="nav-label">Select Operations Role:</label>';
  html += '<div class="role-tabs" role="tablist">';
  STADIUM_DATA.operations.roles.forEach(function(role) {
    const isSelected = role.id === activeStaffRole;
    html += '<button class="role-tab-btn ' + (isSelected ? 'active' : '') + '"';
    html += ' role="tab" aria-selected="' + (isSelected ? 'true' : 'false') + '"';
    html += ' data-role="' + role.id + '"';
    html += ' aria-label="Switch staff operations view to ' + role.title + '">';
    html += role.icon + ' ' + role.title + '</button>';
  });
  html += '</div></div>';

  /* Active Role Details card */
  if (currentRole) {
    html += '<div class="role-details-card animate-on-scroll" role="tabpanel">';
    html += '<h4>' + currentRole.icon + ' ' + currentRole.title + ' Operational Center</h4>';
    html += '<div class="role-grid">';
    html += '<div class="role-col">';
    html += '<h5>Key Responsibilities</h5>';
    html += '<ul>';
    currentRole.responsibilities.forEach(function(resp) {
      html += '<li>' + resp + '</li>';
    });
    html += '</ul></div>';
    html += '<div class="role-col">';
    html += '<h5>Active Deployment Zones</h5>';
    html += '<div class="zones-tags">';
    currentRole.zones.forEach(function(zone) {
      html += '<span class="zone-tag">' + zone + '</span>';
    });
    html += '</div></div></div></div>';
  }

  /* Emergency Protocols Reference Panel */
  html += '<div class="emergency-protocols animate-on-scroll">';
  html += '<h4>🚨 Real-Time Emergency Protocol Board</h4>';
  html += '<div class="protocols-grid">';
  STADIUM_DATA.operations.emergencyProtocols.forEach(function(proto) {
    html += '<div class="protocol-card">';
    html += '<div class="protocol-code">' + proto.code + '</div>';
    html += '<div class="protocol-desc">' + proto.description + '</div>';
    html += '<button class="btn btn-sm btn-danger protocol-emergency-btn"';
    html += ' data-code="' + proto.code + '"';
    html += ' aria-label="Activate local command protocol for ' + proto.code + '">';
    html += 'Trigger Alarm</button>';
    html += '</div>';
  });
  html += '</div></div>';

  wrap.innerHTML = html;
  attachOperationsListeners();
}

/**
 * @description Attaches event listeners for operations tab clicks
 * @returns {void}
 */
function attachOperationsListeners() {
  const tabs = document.querySelectorAll('.role-tab-btn');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', handleRoleTabClick);
  });

  const alarmBtns = document.querySelectorAll('.protocol-emergency-btn');
  alarmBtns.forEach(function(btn) {
    btn.addEventListener('click', handleEmergencyAlarmClick);
  });
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
  accordions.forEach(function(acc) {
    acc.addEventListener('click', toggleAccordion);
  });
}

/**
 * @description Main application setup callback on DOM ready
 * @returns {void}
 */
function initApp() {
  /* 1. Page Visitor counter updates */
  trackVisit().then(function(count) {
    const counterEl = document.getElementById('visitor-count');
    if (counterEl) counterEl.textContent = formatNumber(count);
  });

  /* 2. Call all feature builders */
  buildNavigation();
  buildCrowdMonitor();
  buildTransportHub();
  buildAccessibility();
  buildSustainability();
  buildOperations();
  buildChatbot();
  initFaqAccordions();

  /* 3. Run Observer Animations */
  initIntersectionObserver();

  /* 4. Google services initializations */
  initGoogleCharts();
  initFirebase();

  /* Mobile Hamburg Menu handler binding */
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', handleMobileMenuToggle);
  }

  /* Sync skip links and outline styles on page load */
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', handleSkipLinkClick);
  }
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
