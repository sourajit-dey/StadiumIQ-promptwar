/**
 * @file navigation.js
 * @description Smart stadium navigation and wayfinding.
 *              Helps fans find gates, seats, facilities.
 *              Integrates with Google Maps for venue context.
 *              AI-powered directions via StadiumIQ chatbot.
 * @author StadiumIQ
 * @version 1.0.0
 */

/** @type {Object} The currently selected stadium venue */
let selectedVenue = STADIUM_DATA.venues[0];

/**
 * @description Renders the venue selector dropdown HTML
 * @returns {string} HTML string
 */
function renderVenueSelector() {
  let html = '';
  html += '<div class="venue-selector animate-on-scroll">';
  html += '<label for="venue-select" class="nav-label">';
  html += '🏟️ Select Your Venue</label>';
  html += '<select id="venue-select" class="stadium-select"';
  html += ' aria-label="Select FIFA World Cup 2026 venue">';
  /**
   * @description Appends a venue option to selector HTML
   * @param {Object} venue - Venue option object
   * @returns {void}
   */
  function addVenueOption(venue) {
    html += '<option value="' + venue.id + '"';
    if (venue.id === selectedVenue.id) html += ' selected';
    html += '>' + venue.name + ' — ' + venue.city + '</option>';
  }
  STADIUM_DATA.venues.forEach(addVenueOption);
  html += '</select></div>';
  return html;
}

/**
 * @description Renders the venue details card HTML
 * @returns {string} HTML string
 */
function renderVenueCard() {
  let html = '';
  html += '<div class="venue-card animate-on-scroll">';
  html += '<div class="venue-header">';
  html += '<div class="venue-icon">🏟️</div>';
  html += '<div class="venue-details">';
  html += '<h3>' + selectedVenue.name + '</h3>';
  html += '<div class="venue-meta">';
  html += '<span>📍 ' + selectedVenue.city + '</span>';
  html += '<span>👥 ' + formatNumber(selectedVenue.capacity) + '</span>';
  html += '<span>⚽ ' + selectedVenue.matches + ' matches</span>';
  if (selectedVenue.isVenueFinal) {
    html += '<span class="badge-final">🏆 FINAL VENUE</span>';
  }
  html += '</div></div></div>';
  return html;
}

/**
 * @description Renders the Google Maps embed iframe HTML
 * @returns {string} HTML string
 */
function renderVenueMap() {
  let html = '';
  html += '<div class="map-container animate-on-scroll">';
  html += '<iframe class="venue-map"';
  html += ' title="Google Maps view of ' + selectedVenue.name + '"';
  html += ' aria-label="Google Maps view of ' + selectedVenue.name + '"';
  html += ' src="https://maps.google.com/maps?q=' + selectedVenue.lat + ',' + selectedVenue.lng + '&z=15&output=embed"';
  html += ' loading="lazy" allowfullscreen></iframe>';
  html += '</div>';
  return html;
}

/**
 * @description Renders the gates grid layout HTML
 * @returns {string} HTML string
 */
function renderGatesSection() {
  let html = '';
  html += '<div class="gates-section">';
  html += '<h4>Stadium Gates</h4>';
  html += '<div class="gates-grid">';
  /**
   * @description Appends a gate card markup to grid HTML
   * @param {string} gate - Gate description name
   * @param {number} i - Loop iteration index
   * @returns {void}
   */
  function addGateCard(gate, i) {
    const colors = ['#ef4444', '#22c55e', '#1a56db', '#f59e0b'];
    html += '<div class="gate-card" data-style-border="' +
      colors[i % colors.length] + '">';
    html += '<div class="gate-icon" data-style-color="' +
      colors[i % colors.length] + '">🚪</div>';
    html += '<div class="gate-name">' + gate + '</div>';
    html += '<button class="gate-nav-btn"';
    html += ' data-gate="' + gate + '"';
    html += ' aria-label="Get directions to ' + gate + '">';
    html += 'Navigate</button>';
    html += '</div>';
  }
  selectedVenue.gates.forEach(addGateCard);
  html += '</div></div>';
  return html;
}

/**
 * @description Renders the facility search panel HTML
 * @returns {string} HTML string
 */
function renderDestinationFinder() {
  let html = '';
  html += '<div class="destination-finder animate-on-scroll">';
  html += '<h4>Find a Facility</h4>';
  html += '<div class="search-input-wrap">';
  html += '<span class="search-icon" aria-hidden="true">🔍</span>';
  html += '<label for="facility-search" class="sr-only">';
  html += 'Search for stadium facilities</label>';
  html += '<input type="text" id="facility-search"';
  html += ' class="search-input"';
  html += ' placeholder="Search toilets, food, medical, ATM…"';
  html += ' aria-label="Search for stadium facilities"';
  html += ' autocomplete="off">';
  html += '</div>';
  html += '<div class="facility-results" id="facility-results">';
  html += buildFacilityList('');
  html += '</div></div>';
  return html;
}

/**
 * @description Renders the complete smart navigation UI blocks
 * @returns {void}
 */
function renderNavigationUI() {
  const wrap = document.getElementById('navigation-content');
  if (!wrap) return;
  let html = '';
  html += renderVenueSelector();
  html += renderVenueCard();
  html += renderVenueMap();
  html += renderGatesSection();
  html += renderDestinationFinder();
  wrap.innerHTML = html;
  applyDynamicStyles(wrap);
  if (typeof window.observeNewElements === 'function') {
    window.observeNewElements(wrap);
  }
  attachNavigationListeners();
}

/**
 * @description Builds the smart navigation section UI
 * @returns {void}
 */
function buildNavigation() {
  const wrap = document.getElementById('navigation-content');
  if (!wrap) return;
  renderNavigationUI();
}

/**
 * @description Builds facility list filtered by search query
 * @param {string} query - Search query string
 * @returns {string} HTML for facility list
 */
function buildFacilityList(query) {
  const q = query.toLowerCase();
  const facilities = [
    { icon: '🚻', name: 'Toilets', location: 'Every concourse level, marked blue' },
    { icon: '🍔', name: 'Food Court', location: 'Gates A and B concourse' },
    { icon: '🏥', name: 'First Aid / Medical', location: 'Level 1 North and South' },
    { icon: '💳', name: 'ATM', location: 'Main concourse near Gate A and C' },
    { icon: '🛍️', name: 'FIFA Store / Merchandise', location: 'Gate B concourse level 1' },
    { icon: '📶', name: 'Free WiFi Zone', location: 'Fan Zone — concourse Level 1' },
    { icon: '♿', name: 'Accessibility Desk', location: 'Gate A — accessible entrance' },
    { icon: '🔇', name: 'Quiet Room', location: 'Level 1 Room Q1, Level 2 Room Q2' },
    { icon: '🍼', name: 'Baby Changing', location: 'All toilet blocks' },
    { icon: '🚑', name: 'Emergency Medical', location: 'Pitch perimeter + Level 1 South' },
    { icon: '🅿️', name: 'Accessible Parking', location: 'Lot A — Purple Zone near Gate A' },
    { icon: '🎫', name: 'Ticket Help Desk', location: 'Gate A main entrance' }
  ];
  /**
   * @description Filters facilities list by search query match
   * @param {Object} f - Facility item object
   * @returns {boolean} True if matches filter query
   */
  function filterFacility(f) {
    return f.name.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q);
  }
  const filtered = q
    ? facilities.filter(filterFacility)
    : facilities;
  if (filtered.length === 0) {
    return '<div class="no-results">No facilities found. ' +
      'Ask the AI Assistant for help.</div>';
  }
  let html = '<div class="facility-list">';
  /**
   * @description Appends a facility list item HTML
   * @param {Object} f - Facility item object
   * @returns {void}
   */
  function addFacilityItem(f) {
    html += '<div class="facility-item">';
    html += '<span class="facility-icon" aria-hidden="true">' +
      f.icon + '</span>';
    html += '<div class="facility-info">';
    html += '<div class="facility-name">' + f.name + '</div>';
    html += '<div class="facility-location">📍 ' +
      f.location + '</div>';
    html += '</div></div>';
  }
  filtered.forEach(addFacilityItem);
  html += '</div>';
  return html;
}

/**
 * @description Attaches all navigation event listeners
 * @returns {void}
 */
function attachNavigationListeners() {
  const venueSelect = document.getElementById('venue-select');
  if (venueSelect) {
    venueSelect.addEventListener('change', handleVenueChange);
  }
  const facilitySearch = document.getElementById('facility-search');
  if (facilitySearch) {
    facilitySearch.addEventListener(
      'input',
      debounce(handleFacilitySearch, 200)
    );
  }
  const wrap = document.getElementById('navigation-content');
  if (wrap) {
    const gateBtns = wrap.querySelectorAll('.gate-nav-btn');
    /**
     * @description Binds event handler to a single gate navigation button
     * @param {HTMLButtonElement} btn - The button element
     * @returns {void}
     */
    function bindGateBtn(btn) {
      btn.addEventListener('click', handleGateNavClick);
    }
    gateBtns.forEach(bindGateBtn);
  }
}

/**
 * @description Handles venue dropdown change
 * @param {Event} e - Change event
 * @returns {void}
 */
function handleVenueChange(e) {
  /**
   * @description Finds venue by identifier match
   * @param {Object} v - Venue details object
   * @returns {boolean} True if matching id
   */
  function findVenue(v) {
    return v.id === e.target.value;
  }
  const found = STADIUM_DATA.venues.find(findVenue);
  if (found) {
    selectedVenue = found;
    renderNavigationUI();
    trackNavigationUse('venue_' + found.id);
    trackFeatureUse('Navigation', 'venue_selected');
  }
}

/**
 * @description Handles facility search input
 * @returns {void}
 */
function handleFacilitySearch() {
  const input = document.getElementById('facility-search');
  const results = document.getElementById('facility-results');
  if (input && results) {
    results.innerHTML = buildFacilityList(input.value.trim());
    trackNavigationUse('facility_search');
  }
}

/**
 * @description Handles gate navigation button click
 * @param {MouseEvent} e - Click event
 * @returns {void}
 */
function handleGateNavClick(e) {
  const gate = e.currentTarget.getAttribute('data-gate');
  trackNavigationUse('gate_' + gate);
  trackFeatureUse('Navigation', 'gate_directions');
  const msg = 'How do I get to ' + gate + ' at ' +
    selectedVenue.name + '?';
  const chatInput = document.getElementById('chatbot-input');
  if (chatInput) {
    chatInput.value = msg;
    chatInput.focus();
  }
  scrollToSection('assistant');
}

window.buildNavigation = buildNavigation;
