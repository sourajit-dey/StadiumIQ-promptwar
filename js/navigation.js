/**
 * @file navigation.js
 * @description Smart stadium navigation and wayfinding.
 *              Helps fans find gates, seats, facilities.
 *              Integrates with Google Maps for venue context.
 *              AI-powered directions via StadiumIQ chatbot.
 * @author StadiumIQ
 * @version 1.0.0
 */

/**
 * @description Builds the smart navigation section UI
 * @returns {void}
 */
function buildNavigation() {
  const wrap = document.getElementById('navigation-content');
  if (!wrap) return;

  let selectedVenue = STADIUM_DATA.venues[0];

  /**
   * @description Renders the navigation UI
   * @returns {void}
   */
  function render() {
    let html = '';

    /* Venue selector */
    html += '<div class="venue-selector animate-on-scroll">';
    html += '<label for="venue-select" class="nav-label">';
    html += '🏟️ Select Your Venue</label>';
    html += '<select id="venue-select" class="stadium-select"';
    html += ' aria-label="Select FIFA World Cup 2026 venue">';
    STADIUM_DATA.venues.forEach(function(venue) {
      html += '<option value="' + venue.id + '"';
      if (venue.id === selectedVenue.id) html += ' selected';
      html += '>' + venue.name + ' — ' + venue.city + '</option>';
    });
    html += '</select></div>';

    /* Venue info card */
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

    /* Google Maps Iframe */
    html += '<div class="map-container animate-on-scroll">';
    html += '<iframe class="venue-map"';
    html += ' title="Google Maps view of ' + selectedVenue.name + '"';
    html += ' aria-label="Google Maps view of ' + selectedVenue.name + '"';
    html += ' src="https://maps.google.com/maps?q=' + selectedVenue.lat + ',' + selectedVenue.lng + '&z=15&output=embed"';
    html += ' loading="lazy" allowfullscreen></iframe>';
    html += '</div>';

    /* Gates */
    html += '<div class="gates-section">';
    html += '<h4>Stadium Gates</h4>';
    html += '<div class="gates-grid">';
    selectedVenue.gates.forEach(function(gate, i) {
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
    });
    html += '</div></div>';

    /* Destination finder */
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

    wrap.innerHTML = html;
    applyDynamicStyles(wrap);
    if (typeof window.observeNewElements === 'function') {
      window.observeNewElements(wrap);
    }
    attachNavigationListeners();
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

    const filtered = q
      ? facilities.filter(function(f) {
          return f.name.toLowerCase().includes(q) ||
            f.location.toLowerCase().includes(q);
        })
      : facilities;

    if (filtered.length === 0) {
      return '<div class="no-results">No facilities found. ' +
        'Ask the AI Assistant for help.</div>';
    }

    let html = '<div class="facility-list">';
    filtered.forEach(function(f) {
      html += '<div class="facility-item">';
      html += '<span class="facility-icon" aria-hidden="true">' +
        f.icon + '</span>';
      html += '<div class="facility-info">';
      html += '<div class="facility-name">' + f.name + '</div>';
      html += '<div class="facility-location">📍 ' +
        f.location + '</div>';
      html += '</div></div>';
    });
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

    const gateBtns = wrap.querySelectorAll('.gate-nav-btn');
    gateBtns.forEach(function(btn) {
      btn.addEventListener('click', handleGateNavClick);
    });
  }

  /**
   * @description Handles venue dropdown change
   * @param {Event} e - Change event
   * @returns {void}
   */
  function handleVenueChange(e) {
    const found = STADIUM_DATA.venues.find(function(v) {
      return v.id === e.target.value;
    });
    if (found) {
      selectedVenue = found;
      render();
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

  render();
}

window.buildNavigation = buildNavigation;
