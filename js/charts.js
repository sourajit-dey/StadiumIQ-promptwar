/**
 * @file charts.js
 * @description Google Charts visualization for StadiumIQ.
 *              Displays crowd density, transport split, and
 *              sustainability targets.
 *              Includes CSS fallback rendering if offline.
 * @author StadiumIQ
 * @version 1.0.0
 */

/**
 * @description Initializes Google Charts package loader
 * @returns {void}
 */
function initGoogleCharts() {
  if (typeof google === 'undefined' || !google.charts) {
    /* Fallback immediately if library is not loaded */
    buildCharts();
    return;
  }
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(buildCharts);
}

/**
 * @description Draws all three charts: crowd density, transit split, and sustainability targets.
 *              Falls back to styled HTML representations if Google Charts is offline.
 * @returns {void}
 */
function buildCharts() {
  const isChartsLoaded = typeof google !== 'undefined' && google.visualization;

  buildCrowdChart(isChartsLoaded);
  buildTransportChart(isChartsLoaded);
  buildSustainabilityChart(isChartsLoaded);
}

/**
 * @description Draws the Google Column Chart for crowd density
 * @param {HTMLElement} container - Target DOM container
 * @param {Array} zonesData - Array of zone data objects
 * @returns {void}
 */
function drawCrowdChartGoogle(container, zonesData) {
  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', 'Zone');
  dataTable.addColumn('number', 'Current Crowd');
  dataTable.addColumn('number', 'Capacity');
  /**
   * @description Adds a row to the crowd chart data table
   * @param {Object} z - Zone data object
   * @returns {void}
   */
  function addCrowdRow(z) {
    dataTable.addRow([z.name, z.currentCrowd, z.capacity]);
  }
  zonesData.forEach(addCrowdRow);
  const options = {
    backgroundColor: '#1e293b',
    colors: ['#1a56db', '#334155'],
    chartArea: { width: '80%', height: '70%' },
    hAxis: {
      textStyle: { color: '#94a3b8' },
      gridlines: { color: '#334155' }
    },
    vAxis: {
      textStyle: { color: '#94a3b8' },
      gridlines: { color: '#334155' }
    },
    legend: {
      position: 'top',
      textStyle: { color: '#f1f5f9' }
    },
    bar: { groupWidth: '60%' }
  };
  const chart = new google.visualization.ColumnChart(container);
  chart.draw(dataTable, options);
}

/**
 * @description Draws the HTML fallback representation of the crowd density chart
 * @param {HTMLElement} container - Target DOM container
 * @param {Array} zonesData - Array of zone data objects
 * @returns {void}
 */
function drawCrowdChartFallback(container, zonesData) {
  let html = '<div class="chart-fallback">';
  /**
   * @description Generates HTML markup for a fallback crowd progress bar
   * @param {Object} z - Zone data object
   * @returns {void}
   */
  function addCrowdFallbackBar(z) {
    const pct = Math.round((z.currentCrowd / z.capacity) * 100);
    html += '<div class="fallback-bar-row">';
    html += '<span class="fallback-label">' + z.name + '</span>';
    html += '<div class="fallback-bar-outer"><div class="fallback-bar-inner" data-style-width="' + pct + '%" data-style-bg="' + z.color + '"></div></div>';
    html += '<span class="fallback-value">' + pct + '%</span>';
    html += '</div>';
  }
  zonesData.forEach(addCrowdFallbackBar);
  html += '</div>';
  container.innerHTML = html;
  applyDynamicStyles(container);
}

/**
 * @description Renders the Crowd Density chart.
 * @param {boolean} isLoaded - True if Google Charts library is loaded
 * @returns {void}
 */
function buildCrowdChart(isLoaded) {
  const container = document.getElementById('crowd_chart_div');
  if (!container) return;
  const zonesData = (typeof activeZones !== 'undefined' && activeZones.length > 0)
    ? activeZones
    : STADIUM_DATA.zones;
  if (isLoaded) {
    drawCrowdChartGoogle(container, zonesData);
  } else {
    drawCrowdChartFallback(container, zonesData);
  }
}

/**
 * @description Draws the Google Pie Chart for transportation splits
 * @param {HTMLElement} container - Target DOM container
 * @returns {void}
 */
function drawTransportChartGoogle(container) {
  const dataTable = google.visualization.arrayToDataTable([
    ['Mode', 'Usage Share'],
    ['Metro / Rail', 42],
    ['Official Shuttle', 26],
    ['Ride Share', 16],
    ['Cycling', 10],
    ['Walking', 6]
  ]);
  const options = {
    backgroundColor: '#1e293b',
    colors: ['#1a56db', '#dc2626', '#f59e0b', '#22c55e', '#7c3aed'],
    chartArea: { width: '90%', height: '80%' },
    legend: {
      position: 'right',
      textStyle: { color: '#f1f5f9' }
    },
    pieHole: 0.4,
    pieSliceBorderColor: '#1e293b'
  };
  const chart = new google.visualization.PieChart(container);
  chart.draw(dataTable, options);
}

/**
 * @description Draws the HTML fallback representation of the transport split chart
 * @param {HTMLElement} container - Target DOM container
 * @returns {void}
 */
function drawTransportChartFallback(container) {
  const splits = [
    { name: 'Metro / Rail', share: 42, color: '#1a56db' },
    { name: 'Official Shuttle', share: 26, color: '#dc2626' },
    { name: 'Ride Share', share: 16, color: '#f59e0b' },
    { name: 'Cycling', share: 10, color: '#22c55e' },
    { name: 'Walking', share: 6, color: '#7c3aed' }
  ];
  let html = '<div class="chart-fallback flex-col">';
  /**
   * @description Generates HTML markup for a fallback transport legend row
   * @param {Object} s - Transport split info object
   * @returns {void}
   */
  function addTransportFallbackRow(s) {
    html += '<div class="fallback-legend-row">';
    html += '<span class="legend-color-dot" data-style-bg="' + s.color + '"></span>';
    html += '<span class="fallback-label">' + s.name + '</span>';
    html += '<span class="fallback-value">' + s.share + '%</span>';
    html += '</div>';
  }
  splits.forEach(addTransportFallbackRow);
  html += '</div>';
  container.innerHTML = html;
  applyDynamicStyles(container);
}

/**
 * @description Renders the Transport Modal Split chart.
 * @param {boolean} isLoaded - True if Google Charts library is loaded
 * @returns {void}
 */
function buildTransportChart(isLoaded) {
  const container = document.getElementById('transport_chart_div');
  if (!container) return;
  if (isLoaded) {
    drawTransportChartGoogle(container);
  } else {
    drawTransportChartFallback(container);
  }
}

/**
 * @description Draws the Google Bar Chart for sustainability targets
 * @param {HTMLElement} container - Target DOM container
 * @param {Object} current - Current sustainability metrics
 * @param {Object} targets - Target sustainability goals
 * @returns {void}
 */
function drawSustainabilityChartGoogle(container, current, targets) {
  const dataTable = google.visualization.arrayToDataTable([
    ['Metric', 'Current Status', 'Target Goal'],
    ['Renewable Energy %', current.renewable_energy_pct, targets.renewable_energy_pct],
    ['Waste Recycled %', current.waste_recycled_pct, targets.waste_recycled_pct],
    ['Plastic Reduction %', current.single_use_plastic_reduction_pct, targets.single_use_plastic_reduction_pct]
  ]);
  const options = {
    backgroundColor: '#1e293b',
    colors: ['#22c55e', '#f59e0b'],
    chartArea: { width: '75%', height: '70%' },
    hAxis: {
      textStyle: { color: '#94a3b8' },
      gridlines: { color: '#334155' },
      minValue: 0,
      maxValue: 100
    },
    vAxis: {
      textStyle: { color: '#94a3b8' },
      gridlines: { color: '#334155' }
    },
    legend: {
      position: 'top',
      textStyle: { color: '#f1f5f9' }
    }
  };
  const chart = new google.visualization.BarChart(container);
  chart.draw(dataTable, options);
}

/**
 * @description Draws the HTML fallback representation of the sustainability target progress
 * @param {HTMLElement} container - Target DOM container
 * @param {Object} current - Current sustainability metrics
 * @param {Object} targets - Target sustainability goals
 * @returns {void}
 */
function drawSustainabilityChartFallback(container, current, targets) {
  const metrics = [
    { name: 'Renewable Energy %', cur: current.renewable_energy_pct, tgt: targets.renewable_energy_pct, color: '#22c55e' },
    { name: 'Waste Recycled %', cur: current.waste_recycled_pct, tgt: targets.waste_recycled_pct, color: '#f59e0b' },
    { name: 'Plastic Reduction %', cur: current.single_use_plastic_reduction_pct, tgt: targets.single_use_plastic_reduction_pct, color: '#1a56db' }
  ];
  let html = '<div class="chart-fallback flex-col">';
  /**
   * @description Generates HTML markup for a fallback sustainability progress meter
   * @param {Object} m - Sustainability metric details object
   * @returns {void}
   */
  function addSustainabilityFallbackMeter(m) {
    html += '<div class="fallback-bar-group">';
    html += '<div class="fallback-label">' + m.name + ' (Target: ' + m.tgt + '%)</div>';
    html += '<div class="fallback-bar-outer"><div class="fallback-bar-inner" data-style-width="' + m.cur + '%" data-style-bg="' + m.color + '"></div></div>';
    html += '<div class="fallback-value">Current: ' + m.cur + '%</div>';
    html += '</div>';
  }
  metrics.forEach(addSustainabilityFallbackMeter);
  html += '</div>';
  container.innerHTML = html;
  applyDynamicStyles(container);
}

/**
 * @description Renders the Sustainability Target progress chart.
 * @param {boolean} isLoaded - True if Google Charts library is loaded
 * @returns {void}
 */
function buildSustainabilityChart(isLoaded) {
  const container = document.getElementById('sustainability_chart_div');
  if (!container) return;
  const current = STADIUM_DATA.sustainability.current;
  const targets = STADIUM_DATA.sustainability.targets;
  if (isLoaded) {
    drawSustainabilityChartGoogle(container, current, targets);
  } else {
    drawSustainabilityChartFallback(container, current, targets);
  }
}

window.initGoogleCharts = initGoogleCharts;
window.buildCharts = buildCharts;
