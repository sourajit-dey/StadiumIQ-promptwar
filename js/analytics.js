/**
 * @file analytics.js
 * @description Google Analytics 4 tracking for StadiumIQ.
 *              Contains gtag initialization and Google Translate
 *              init — all external, zero inline scripts in HTML.
 *              This approach satisfies strict CSP requirements.
 * @author StadiumIQ
 * @version 1.0.0
 */

/**
 * @description Initializes Google Analytics 4 data layer.
 *              Runs immediately when file loads.
 *              External file pattern avoids CSP unsafe-inline.
 * @returns {void}
 */
function initGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-PLACEHOLDER', {
    anonymize_ip: true,
    page_title: 'StadiumIQ — FIFA World Cup 2026'
  });
}

initGoogleAnalytics();

/**
 * @description Google Translate widget initialization callback.
 *              Called automatically by Translate SDK via cb= param.
 *              Defined here in external file — not inline in HTML.
 *              Supports all major FIFA World Cup fan languages.
 * @returns {void}
 */
function googleTranslateElementInit() {
  if (typeof google === 'undefined' ||
      typeof google.translate === 'undefined') return;
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'ar,zh,es,fr,pt,de,ja,ko,hi,ru,it,nl',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

window.googleTranslateElementInit = googleTranslateElementInit;

/**
 * @description Safely calls gtag if available
 * @param {...*} args - Arguments for gtag
 * @returns {void}
 */
function safeGtag() {
  if (typeof window.gtag === 'function') {
    window.gtag.apply(null, arguments);
  }
}

/**
 * @description Tracks a page or section view
 * @param {string} sectionName - Name of the viewed section
 * @returns {void}
 */
function trackPageView(sectionName) {
  safeGtag('event', 'page_view', {
    event_category: 'Navigation',
    event_label: sectionName
  });
}

/**
 * @description Tracks a feature interaction
 * @param {string} featureName - Feature being used
 * @param {string} action - Action performed
 * @returns {void}
 */
function trackFeatureUse(featureName, action) {
  safeGtag('event', 'feature_use', {
    event_category: featureName,
    event_label: action
  });
}

/**
 * @description Tracks AI chatbot message sent
 * @returns {void}
 */
function trackChatMessage() {
  safeGtag('event', 'chat_message', {
    event_category: 'AI Assistant',
    event_label: 'Stadium Query'
  });
}

/**
 * @description Tracks navigation feature usage
 * @param {string} destination - Destination queried
 * @returns {void}
 */
function trackNavigationUse(destination) {
  safeGtag('event', 'navigation_query', {
    event_category: 'Smart Navigation',
    event_label: destination
  });
}

/**
 * @description Tracks transport hub query
 * @param {string} transportType - Type of transport selected
 * @returns {void}
 */
function trackTransportQuery(transportType) {
  safeGtag('event', 'transport_query', {
    event_category: 'Transport Hub',
    event_label: transportType
  });
}

/**
 * @description Tracks accessibility feature usage
 * @param {string} facilityType - Type of accessibility facility
 * @returns {void}
 */
function trackAccessibilityUse(facilityType) {
  safeGtag('event', 'accessibility_use', {
    event_category: 'Accessibility Hub',
    event_label: facilityType
  });
}
