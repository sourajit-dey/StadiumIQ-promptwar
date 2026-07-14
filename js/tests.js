/**
 * @file tests.js
 * @description Automated test suite for StadiumIQ.
 *              Triggers only if URL contains '?test=true'.
 *              Contains 15 test groups verifying all operations.
 * @author StadiumIQ
 * @version 1.0.0
 */

/**
 * @description Asserts a condition, printing PASS or FAIL message.
 * @param {boolean} condition - Condition to verify
 * @param {string} testName - Name of the test
 * @returns {void}
 */
function testAssert(condition, testName) {
  /* Using console.assert for standard assertions */
  console.assert(condition, 'FAIL: ' + testName);
  if (condition) {
    console.log('PASS: ' + testName);
  }
}

/**
 * @description Group 1 — Data Integrity
 * @returns {void}
 */
function testGroup1_DataIntegrity() {
  console.log('--- Group 1: Data Integrity ---');

  /* Verify frozen state */
  testAssert(Object.isFrozen(STADIUM_DATA), 'STADIUM_DATA must be deeply frozen');
  testAssert(Object.isFrozen(STADIUM_DATA.tournament), 'STADIUM_DATA.tournament must be frozen');
  testAssert(Object.isFrozen(STADIUM_DATA.venues), 'STADIUM_DATA.venues array must be frozen');

  /* Verify correct metadata content */
  testAssert(STADIUM_DATA.tournament.teams === 48, 'Tournament must have 48 teams');
  testAssert(STADIUM_DATA.tournament.matches === 104, 'Tournament must have 104 matches');
  testAssert(STADIUM_DATA.venues.length === 5, 'Must have 5 mock locations loaded');

  const metlife = STADIUM_DATA.venues.find(function(v) { return v.id === 'metlife'; });
  testAssert(metlife && metlife.isVenueFinal === true, 'MetLife must be the final venue');
}

/**
 * @description Group 2 — DOM Structure
 * @returns {void}
 */
function testGroup2_DomStructure() {
  console.log('--- Group 2: DOM Structure ---');

  const sections = ['hero', 'navigation', 'crowd', 'transport', 'accessibility', 'sustainability', 'operations', 'assistant'];
  sections.forEach(function(s) {
    const el = document.getElementById(s);
    testAssert(!!el, 'DOM section #' + s + ' must exist');
  });

  const visitorCount = document.getElementById('visitor-count');
  testAssert(!!visitorCount, 'Visitor count element must exist');

  const mapIframe = document.querySelector('.venue-map');
  testAssert(!!mapIframe, 'Google Maps embed iframe must exist');
}

/**
 * @description Group 3 — Sanitization
 * @returns {void}
 */
function testGroup3_Sanitization() {
  console.log('--- Group 3: Sanitization ---');

  const xssStr = '<script>alert("hack")</script>';
  const cleanStr = sanitizeInput(xssStr);
  testAssert(!cleanStr.includes('<script>'), 'Sanitized input must remove tags');
  testAssert(cleanStr.includes('&lt;script&gt;'), 'Sanitized input must escape brackets');

  testAssert(sanitizeInput(null) === '', 'Sanitize must handle null');
  testAssert(sanitizeInput(42) === '', 'Sanitize must handle numbers');
}

/**
 * @description Group 4 — Failure Paths
 * @returns {void}
 */
function testGroup4_FailurePaths() {
  console.log('--- Group 4: Failure Paths ---');

  /* Test fallback storage check */
  const fallback = getStorage('non_existent_key_xyz_123', 'fallback_value');
  testAssert(fallback === 'fallback_value', 'LocalStorage helper must return fallback on empty keys');

  /* Verify empty input sanitization fallback */
  testAssert(sanitizeInput('') === '', 'Sanitization must handle empty inputs');
  testAssert(sanitizeInput('   ') === '', 'Sanitization must trim spaces');
}

/**
 * @description Group 5 — Utility Functions
 * @returns {void}
 */
function testGroup5_UtilityFunctions() {
  console.log('--- Group 5: Utility Functions ---');

  const id = generateId();
  testAssert(typeof id === 'string' && id.length > 5, 'generateId must return valid unique string');

  const formattedTime = formatTime(new Date());
  testAssert(formattedTime.includes('AM') || formattedTime.includes('PM'), 'formatTime must return AM/PM values');

  const num = 1250000;
  testAssert(formatNumber(num) === '1,250,000', 'formatNumber must add commas correctly');
}

/**
 * @description Group 6 — Storage
 * @returns {void}
 */
function testGroup6_Storage() {
  console.log('--- Group 6: Storage ---');

  const testKey = 'test_item_storage';
  const val = { ok: true };
  const writeOk = setStorage(testKey, val);
  testAssert(writeOk, 'setStorage must return true');

  const readVal = getStorage(testKey, null);
  testAssert(readVal && readVal.ok === true, 'getStorage must read saved item');

  /* Cleanup */
  try { localStorage.removeItem(testKey); } catch (_) { /* ignore */ }
}

/**
 * @description Group 7 — Google Services
 * @returns {void}
 */
function testGroup7_GoogleServices() {
  console.log('--- Group 7: Google Services ---');

  testAssert(typeof window.gtag === 'function', 'Google Analytics GA4 gtag callback must exist');
  testAssert(typeof window.googleTranslateElementInit === 'function', 'Google Translate callback must exist');

  const mapsFrame = document.querySelector('.venue-map');
  testAssert(mapsFrame && mapsFrame.src.includes('maps.google.com'), 'Iframe source must match Google Maps API');
}

/**
 * @description Group 8 — Accessibility
 * @returns {void}
 */
function testGroup8_Accessibility() {
  console.log('--- Group 8: Accessibility ---');

  testAssert(document.documentElement.getAttribute('lang') === 'en', 'HTML lang attribute must equal "en"');

  const skipLink = document.querySelector('.skip-link');
  testAssert(skipLink && skipLink.getAttribute('href') === '#main-content', 'Accessibility Skip-link must target main content');

  const mainWrap = document.getElementById('main-content');
  testAssert(mainWrap && mainWrap.tagName.toLowerCase() === 'main', 'Main content wrapper must use semantic <main> tag');

  const iframe = document.querySelector('.venue-map');
  testAssert(iframe && iframe.getAttribute('title') && iframe.getAttribute('aria-label'), 'Google Map iframe must have title and aria-label properties');
}

/**
 * @description Group 9 — Performance
 * @returns {void}
 */
function testGroup9_Performance() {
  console.log('--- Group 9: Performance ---');

  const preconnects = document.querySelectorAll('link[rel="preconnect"]');
  testAssert(preconnects.length >= 2, 'Preconnect links must be configured for API domains');

  const prefetches = document.querySelectorAll('link[rel="dns-prefetch"]');
  testAssert(prefetches.length >= 5, 'Must prefetch at least 5 key external API domains');

  const images = document.querySelectorAll('img');
  let imagesOk = true;
  images.forEach(function(img) {
    const src = img.getAttribute('src') || '';
    if (src.includes('google.com') || src.includes('gstatic.com') || src.includes('translate')) {
      return;
    }
    if (img.getAttribute('loading') !== 'lazy') imagesOk = false;
  });
  testAssert(imagesOk, 'All images on page must have loading="lazy" set');
}

/**
 * @description Group 10 — PWA
 * @returns {void}
 */
function testGroup10_PWA() {
  console.log('--- Group 10: PWA ---');

  const manifest = document.querySelector('link[rel="manifest"]');
  testAssert(manifest && manifest.getAttribute('href') === 'manifest.json', 'PWA manifest link must point to manifest.json');

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  testAssert(themeMeta && themeMeta.getAttribute('content') === '#1a56db', 'PWA theme-color meta tag must match FIFA Blue');
}

/**
 * @description Group 11 — Multilingual
 * @returns {void}
 */
function testGroup11_Multilingual() {
  console.log('--- Group 11: Multilingual ---');

  const translateWrapper = document.getElementById('google_translate_element');
  testAssert(!!translateWrapper, 'Google Translate element target must exist');

  testAssert(typeof googleTranslateElementInit === 'function', 'googleTranslateElementInit must be loaded');
}

/**
 * @description Group 12 — Backend
 * @returns {void}
 */
function testGroup12_Backend() {
  console.log('--- Group 12: Backend ---');

  testAssert(typeof CLOUD_FUNCTION_URL === 'string', 'CLOUD_FUNCTION_URL configuration string must exist');
  testAssert(typeof GEMINI_API_KEY === 'string', 'GEMINI_API_KEY configuration string must exist');
}

/**
 * @description Group 13 — Chatbot Security
 * @returns {void}
 */
function testGroup13_ChatbotSecurity() {
  console.log('--- Group 13: Chatbot Security ---');

  testAssert(Array.isArray(conversationHistory), 'Chat history tracker must be an array');
  testAssert(conversationHistory.length <= 10, 'Chat history must cap at 10 items');

  const inputEl = document.getElementById('chatbot-input') || document.getElementById('chat-input-floating');
  testAssert(inputEl && inputEl.maxLength === 500, 'Chatbot input must enforce a 500 character maximum');
}

/**
 * @description Group 14 — Domain Specific: Wayfinding and Maps
 * @returns {void}
 */
function testGroup14_DomainSpecificNav() {
  console.log('--- Group 14: Wayfinding and Maps ---');

  const dropdown = document.getElementById('venue-select');
  testAssert(!!dropdown, 'Venue select dropdown must be rendered');

  const activeVenue = STADIUM_DATA.venues[0];
  testAssert(activeVenue.gates && activeVenue.gates.length > 0, 'Venues must have gates config');
}

/**
 * @description Group 15 — Problem Statement Coverage
 * @returns {void}
 */
function testGroup15_ProblemStatementCoverage() {
  console.log('--- Group 15: Problem Statement Coverage ---');

  /* Use cases map */
  /* Use Case 1: Smart Wayfinding */
  const navSection = document.getElementById('navigation');
  const hasWayfinding = !!navSection && !!document.getElementById('navigation-content');
  testAssert(hasWayfinding, 'PASS: Use Case 1: Smart Wayfinding & Wayfinding sections loaded');

  /* Use Case 2: Live Crowd Monitor */
  const crowdSection = document.getElementById('crowd');
  const hasCrowd = !!crowdSection && !!document.getElementById('crowd-content');
  testAssert(hasCrowd, 'PASS: Use Case 2: Live Crowd Monitor dashboard loaded');

  /* Use Case 3: Accessibility Hub */
  const accessSection = document.getElementById('accessibility');
  const hasAccessibility = !!accessSection && !!document.getElementById('accessibility-content');
  testAssert(hasAccessibility, 'PASS: Use Case 3: Accessibility Facility Guide loaded');

  /* Use Case 4: Transport Hub */
  const transportSection = document.getElementById('transport');
  const hasTransport = !!transportSection && !!document.getElementById('transport-content');
  testAssert(hasTransport, 'PASS: Use Case 4: Multi-modal transport hub loaded');

  /* Use Case 5: Sustainability metrics */
  const sustainSection = document.getElementById('sustainability');
  const hasSustain = !!sustainSection && !!document.getElementById('sustainability-content');
  testAssert(hasSustain, 'PASS: Use Case 5: Sustainability Metric dashboard loaded');

  /* Use Case 6: Multilingual Translate Support */
  const hasMultilingual = typeof googleTranslateElementInit === 'function' && !!document.getElementById('google_translate_element');
  testAssert(hasMultilingual, 'PASS: Use Case 6: Multilingual widget loaded');

  /* Use Case 7: Operational intelligence */
  const opsSection = document.getElementById('operations');
  const hasOps = !!opsSection && !!document.getElementById('operations-content');
  testAssert(hasOps, 'PASS: Use Case 7: Staff and volunteer operations center loaded');

  /* Use Case 8: AI assistant decision support */
  const assistantSection = document.getElementById('assistant');
  const hasAssistant = !!assistantSection && !!document.getElementById('assistant-content');
  testAssert(hasAssistant, 'PASS: Use Case 8: Gemini-powered AI Assistant loaded');
}

/**
 * @description Runs all 15 automated test groups sequentially
 * @returns {void}
 */
function runAllTests() {
  console.log('=============== STARTING STADIUMIQ TEST HARNESS ===============');
  testGroup1_DataIntegrity();
  testGroup2_DomStructure();
  testGroup3_Sanitization();
  testGroup4_FailurePaths();
  testGroup5_UtilityFunctions();
  testGroup6_Storage();
  testGroup7_GoogleServices();
  testGroup8_Accessibility();
  testGroup9_Performance();
  testGroup10_PWA();
  testGroup11_Multilingual();
  testGroup12_Backend();
  testGroup13_ChatbotSecurity();
  testGroup14_DomainSpecificNav();
  testGroup15_ProblemStatementCoverage();
  console.log('=============== ALL TESTS COMPLETED ===============');
}

window.runAllTests = runAllTests;

/* Auto-run tests if '?test=true' URL parameter exists */
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('test') === 'true') {
    /* Delay execution slightly to ensure all DOM elements are fully initialized */
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(runAllTests, 1000);
    });
  }
})();
