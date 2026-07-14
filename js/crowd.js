/**
 * @file crowd.js
 * @description Live crowd monitoring and zone management.
 *              Shows real-time crowd density by stadium zone.
 *              Helps fans find less crowded areas.
 *              Gives organizers operational intelligence.
 * @author StadiumIQ
 * @version 1.0.0
 */

/** @type {Array} Mutable local state copy of stadium zones */
let activeZones = [];

/**
 * @description Builds the crowd monitoring dashboard
 * @returns {void}
 */
function buildCrowdMonitor() {
  const wrap = document.getElementById('crowd-content');
  if (!wrap) return;

  /* Initialize local mutable zones state if not already done */
  if (activeZones.length === 0) {
    activeZones = STADIUM_DATA.zones.map(function(zone) {
      return {
        id: zone.id,
        name: zone.name,
        icon: zone.icon,
        capacity: zone.capacity,
        currentCrowd: zone.currentCrowd,
        color: zone.color,
        facilities: zone.facilities,
        accessibleSeats: zone.accessibleSeats
      };
    });
  }

  /**
   * @description Calculates crowd density percentage for a zone
   * @param {Object} zone - Zone object with capacity and currentCrowd
   * @returns {number} Density percentage 0-100
   */
  function getDensity(zone) {
    return Math.round((zone.currentCrowd / zone.capacity) * 100);
  }

  /**
   * @description Gets crowd status label based on density
   * @param {number} density - Density percentage
   * @returns {Object} Status with label and color
   */
  function getCrowdStatus(density) {
    if (density < 60) {
      return { label: 'Low Crowd 🟢', color: '#22c55e', level: 'low' };
    } else if (density < 80) {
      return { label: 'Moderate 🟡', color: '#f59e0b', level: 'medium' };
    } else if (density < 95) {
      return { label: 'Busy 🟠', color: '#f97316', level: 'high' };
    }
    return { label: 'At Capacity 🔴', color: '#ef4444', level: 'full' };
  }

  /**
   * @description Renders the crowd monitor UI
   * @returns {void}
   */
  function render() {
    const totalCurrent = activeZones.reduce(function(s, z) {
      return s + z.currentCrowd;
    }, 0);
    const totalCapacity = activeZones.reduce(function(s, z) {
      return s + z.capacity;
    }, 0);
    const overallPct = Math.round((totalCurrent / totalCapacity) * 100);

    let html = '';

    /* Stadium overview */
    html += '<div class="crowd-overview animate-on-scroll">';
    html += '<div class="crowd-stats-row">';
    html += '<div class="crowd-stat-card">';
    html += '<div class="crowd-stat-value">' +
      formatNumber(totalCurrent) + '</div>';
    html += '<div class="crowd-stat-label">Fans In Stadium</div>';
    html += '</div>';
    html += '<div class="crowd-stat-card">';
    html += '<div class="crowd-stat-value">' + overallPct + '%</div>';
    html += '<div class="crowd-stat-label">Overall Capacity</div>';
    html += '</div>';
    html += '<div class="crowd-stat-card">';
    html += '<div class="crowd-stat-value">' +
      formatNumber(totalCapacity - totalCurrent) + '</div>';
    html += '<div class="crowd-stat-label">Seats Available</div>';
    html += '</div>';
    html += '</div>';

    /* Overall progress */
    html += '<div class="crowd-overall-bar">';
    html += '<div class="crowd-bar-label">';
    html += '<span>Stadium Capacity</span>';
    html += '<span>' + overallPct + '%</span>';
    html += '</div>';
    html += '<div class="progress-bar">';
    html += '<div class="progress-fill" data-style-width="' + overallPct +
      '%" data-style-bg="' + (overallPct > 85 ? '#ef4444' : '#1a56db') + '">';
    html += '</div></div>';
    html += '</div></div>';

    /* Zone cards */
    html += '<div class="zones-grid animate-on-scroll">';
    activeZones.forEach(function(zone) {
      const density = getDensity(zone);
      const status = getCrowdStatus(density);
      html += '<div class="zone-card" data-zone="' + zone.id + '">';
      html += '<div class="zone-header">';
      html += '<span class="zone-icon" aria-hidden="true">' +
        zone.icon + '</span>';
      html += '<div class="zone-title">';
      html += '<h4>' + zone.name + '</h4>';
      html += '<span class="zone-status" data-style-color="' +
        status.color + '">' + status.label + '</span>';
      html += '</div></div>';
      html += '<div class="zone-numbers">';
      html += '<span>' + formatNumber(zone.currentCrowd) + ' / ' +
        formatNumber(zone.capacity) + '</span>';
      html += '<span data-style-color="' + status.color + '">' +
        density + '%</span>';
      html += '</div>';
      html += '<div class="progress-bar zone-bar">';
      html += '<div class="progress-fill" data-style-width="' + density +
        '%" data-style-bg="' + status.color + '"></div>';
      html += '</div>';
      html += '<div class="zone-facilities">';
      html += '<div class="zone-facilities-label">Facilities:</div>';
      zone.facilities.forEach(function(fac) {
        html += '<span class="zone-facility-tag">' + fac + '</span>';
      });
      html += '</div>';
      html += '<div class="zone-accessible">';
      html += '♿ ' + zone.accessibleSeats + ' accessible seats';
      html += '</div>';
      html += '<button class="btn btn-sm zone-ask-btn"';
      html += ' data-zone="' + zone.name + '"';
      html += ' aria-label="Ask AI about ' + zone.name + '">';
      html += '🤖 Ask AI about this zone</button>';
      html += '</div>';
    });
    html += '</div>';

    /* Last updated */
    html += '<div class="crowd-updated animate-on-scroll">';
    html += '<span>🔄 Last updated: ' + formatTime(new Date()) + '</span>';
    html += '<button class="btn btn-sm btn-secondary" id="refresh-crowd"';
    html += ' aria-label="Refresh crowd data">';
    html += '↺ Refresh</button>';
    html += '</div>';

    /* Insert Google Chart container */
    html += '<div class="chart-wrapper animate-on-scroll">';
    html += '<h4>Zone Density Visualization</h4>';
    html += '<div id="crowd_chart_div" class="chart-container" role="img" aria-label="Bar chart showing crowd density by zone"></div>';
    html += '</div>';

    wrap.innerHTML = html;
    applyDynamicStyles(wrap);
    attachCrowdListeners();
  }

  /**
   * @description Attaches crowd monitor event listeners
   * @returns {void}
   */
  function attachCrowdListeners() {
    const refreshBtn = document.getElementById('refresh-crowd');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', handleRefreshCrowd);
    }

    const askBtns = wrap.querySelectorAll('.zone-ask-btn');
    askBtns.forEach(function(btn) {
      btn.addEventListener('click', handleZoneAskClick);
    });
  }

  /**
   * @description Handles crowd data refresh button click
   * @returns {void}
   */
  function handleRefreshCrowd() {
    activeZones.forEach(function(zone) {
      zone.currentCrowd = Math.max(0, Math.min(
        zone.capacity,
        zone.currentCrowd + randomInt(-500, 800)
      ));
      recordZoneView(zone.name);
    });
    render();
    trackFeatureUse('Crowd Monitor', 'refresh_data');
    if (typeof buildCharts === 'function') {
      buildCharts();
    }
  }

  /**
   * @description Handles zone AI ask button click
   * @param {MouseEvent} e - Click event
   * @returns {void}
   */
  function handleZoneAskClick(e) {
    const zoneName = e.currentTarget.getAttribute('data-zone');
    trackFeatureUse('Crowd Monitor', 'ask_ai_' + zoneName);
    const msg = 'What is the current status, capacity, and operations guide for the ' + zoneName + '?';
    const chatInput = document.getElementById('chatbot-input');
    if (chatInput) {
      chatInput.value = msg;
      chatInput.focus();
    }
    scrollToSection('assistant');
  }

  render();
}

window.buildCrowdMonitor = buildCrowdMonitor;
