/**
 * @file transport.js
 * @description Multi-modal transport hub for StadiumIQ.
 *              Displays transit options, sustainability scores,
 *              peak times, and interactive route planner.
 * @author StadiumIQ
 * @version 1.0.0
 */

/** @type {string} Active filter for transport options: all, eco, fast, cheap */
let activeTransportFilter = 'all';

/**
 * @description Builds the transport hub section UI
 * @returns {void}
 */
function buildTransportHub() {
  const wrap = document.getElementById('transport-content');
  if (!wrap) return;

  /**
   * @description Checks if a transport option matches the current filter
   * @param {Object} option - Transport option object
   * @returns {boolean} True if option matches filter
   */
  function matchesFilter(option) {
    if (activeTransportFilter === 'all') return true;
    if (activeTransportFilter === 'eco') {
      return option.sustainability.toLowerCase().includes('low') ||
             option.sustainability.toLowerCase().includes('zero');
    }
    if (activeTransportFilter === 'fast') {
      const minutes = parseInt(option.time, 10);
      return minutes <= 30;
    }
    if (activeTransportFilter === 'cheap') {
      return option.cost.includes('Free') || option.cost.includes('$3') || option.cost.includes('$0');
    }
    return true;
  }

  /**
   * @description Renders the transport hub UI
   * @returns {void}
   */
  function render() {
    let html = '';

    /* Peak Operational Advice Warning Box */
    html += '<div class="alert-box alert-warning animate-on-scroll">';
    html += '<span class="alert-icon">⚠️</span>';
    html += '<div class="alert-text">';
    html += '<strong>Peak Transport Congestion:</strong> ' +
      STADIUM_DATA.transport.peakTimes.join(' and ') + '. ';
    html += '<em>Avoid traveling ' + STADIUM_DATA.transport.avoidTime + '.</em>';
    html += '</div></div>';

    /* Filters row */
    html += '<div class="filter-chips animate-on-scroll">';
    const chips = [
      { id: 'all', label: 'All Modes' },
      { id: 'eco', label: '🌱 Eco-Friendly' },
      { id: 'fast', label: '⚡ Fastest (≤30m)' },
      { id: 'cheap', label: '🪙 Cheapest' }
    ];
    chips.forEach(function(c) {
      const activeClass = activeTransportFilter === c.id ? 'active' : '';
      html += '<button class="filter-chip ' + activeClass + '"';
      html += ' data-filter="' + c.id + '"';
      html += ' aria-label="Filter transport by ' + c.label + '">';
      html += c.label + '</button>';
    });
    html += '</div>';

    /* Options grid */
    html += '<div class="transport-grid animate-on-scroll">';
    const filteredOptions = STADIUM_DATA.transport.options.filter(matchesFilter);
    filteredOptions.forEach(function(opt) {
      html += '<div class="transport-card" data-mode="' + opt.id + '">';
      html += '<div class="transport-header">';
      html += '<span class="transport-icon" aria-hidden="true">' +
        opt.icon + '</span>';
      html += '<h4>' + opt.name + '</h4>';
      html += '</div>';
      html += '<div class="transport-details">';
      html += '<div>⏱️ Duration: <strong>' + opt.time + '</strong></div>';
      html += '<div>💵 Est. Cost: <strong>' + opt.cost + '</strong></div>';
      html += '<div>🔄 Frequency: <strong>' + opt.frequency + '</strong></div>';
      html += '<div class="sustainability-badge">🌱 ' +
        opt.sustainability + '</div>';
      html += '</div>';
      html += '<p class="transport-tip">' + opt.tip + '</p>';
      html += '<button class="btn btn-sm btn-primary route-btn"';
      html += ' data-mode="' + opt.name + '"';
      html += ' aria-label="Plan route using ' + opt.name + '">';
      html += 'Route Info</button>';
      html += '</div>';
    });
    html += '</div>';

    /* Interactive carbon savings calculator */
    html += '<div class="calculator-card animate-on-scroll">';
    html += '<h4>🌱 Green Commute Carbon Calculator</h4>';
    html += '<p class="calc-intro">Enter your travel distance to estimate carbon savings compared to personal gas cars.</p>';
    html += '<div class="calc-form">';
    html += '<div class="form-group">';
    html += '<label for="calc-distance">Travel Distance (km):</label>';
    html += '<input type="number" id="calc-distance" min="1" max="100" value="15"';
    html += ' aria-label="Travel distance in kilometers">';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<label for="calc-mode">Preferred Transit Mode:</label>';
    html += '<select id="calc-mode" aria-label="Select transit mode">';
    STADIUM_DATA.transport.options.forEach(function(opt) {
      html += '<option value="' + opt.id + '">' + opt.icon + ' ' + opt.name + '</option>';
    });
    html += '</select></div></div>';
    html += '<div class="calc-result" id="calc-result">';
    html += 'Calculate carbon savings dynamically above!';
    html += '</div></div>';

    /* Google Chart placeholder */
    html += '<div class="chart-wrapper animate-on-scroll">';
    html += '<h4>Modal Split & Usage Share</h4>';
    html += '<div id="transport_chart_div" class="chart-container" role="img" aria-label="Pie chart showing transit mode split"></div>';
    html += '</div>';

    wrap.innerHTML = html;
    attachTransportListeners();
    updateCarbonSavings();
  }

  /**
   * @description Attaches all transport event listeners
   * @returns {void}
   */
  function attachTransportListeners() {
    const chipBtns = wrap.querySelectorAll('.filter-chip');
    chipBtns.forEach(function(btn) {
      btn.addEventListener('click', handleFilterClick);
    });

    const routeBtns = wrap.querySelectorAll('.route-btn');
    routeBtns.forEach(function(btn) {
      btn.addEventListener('click', handleRouteClick);
    });

    const calcDistance = document.getElementById('calc-distance');
    if (calcDistance) {
      calcDistance.addEventListener('input', debounce(updateCarbonSavings, 200));
    }

    const calcMode = document.getElementById('calc-mode');
    if (calcMode) {
      calcMode.addEventListener('change', updateCarbonSavings);
    }
  }

  /**
   * @description Handles filter chip clicks
   * @param {MouseEvent} e - Click event
   * @returns {void}
   */
  function handleFilterClick(e) {
    const filter = e.currentTarget.getAttribute('data-filter');
    activeTransportFilter = filter;
    render();
    trackFeatureUse('Transport Hub', 'filter_' + filter);
  }

  /**
   * @description Handles route info button click
   * @param {MouseEvent} e - Click event
   * @returns {void}
   */
  function handleRouteClick(e) {
    const mode = e.currentTarget.getAttribute('data-mode');
    trackTransportQuery(mode);
    recordTransportQuery(mode);
    const msg = 'What are the travel route options, parking maps, and updates for the ' + mode + ' route to MetLife Stadium?';
    const chatInput = document.getElementById('chatbot-input');
    if (chatInput) {
      chatInput.value = msg;
      chatInput.focus();
    }
    scrollToSection('assistant');
  }

  /**
   * @description Updates dynamic carbon savings calculations
   * @returns {void}
   */
  function updateCarbonSavings() {
    const distInput = document.getElementById('calc-distance');
    const modeSelect = document.getElementById('calc-mode');
    const resultDiv = document.getElementById('calc-result');

    if (!distInput || !modeSelect || !resultDiv) return;

    const distance = parseFloat(distInput.value) || 0;
    const mode = modeSelect.value;

    /* Emissions per km (grams of CO2) */
    /* Personal car: 120g, Metro: 15g, Shuttle: 20g, Rideshare: 90g, Cycling/Walking: 0g */
    let modeEmissions = 0;
    if (mode === 'metro') modeEmissions = 15;
    else if (mode === 'shuttle') modeEmissions = 20;
    else if (mode === 'rideshare') modeEmissions = 90;

    const carEmissions = distance * 120;
    const selectedEmissions = distance * modeEmissions;
    const savings = Math.max(0, Math.round(carEmissions - selectedEmissions));

    resultDiv.innerHTML = '<div class="savings-number">🌱 ' + savings + 'g CO₂ Saved</div>' +
      '<div class="savings-text">By choosing this mode over a private gas vehicle for a ' + distance + 'km commute, ' +
      'you reduce environmental footprint significantly.</div>';
  }

  render();
}

window.buildTransportHub = buildTransportHub;
