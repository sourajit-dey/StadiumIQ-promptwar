/**
 * @file firebase.js
 * @description Firebase Realtime Database integration.
 *              Tracks live crowd counts by zone and fan analytics.
 *              localStorage is primary fallback — always works.
 *              Firebase enhances with real-time data when available.
 *              Zero PII stored — completely anonymous.
 * @author StadiumIQ
 * @version 1.0.0
 */

/** Firebase config — public client config */
const FIREBASE_CONFIG = {
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "stadiumiq-app.firebaseapp.com",
  databaseURL: "https://stadiumiq-app-default-rtdb.firebaseio.com",
  projectId: "stadiumiq-app",
  storageBucket: "stadiumiq-app.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000"
};

/** @type {Object|null} Firebase database reference */
let firebaseDb = null;

/** @type {boolean} Firebase init state */
let firebaseReady = false;

/** localStorage key for visit count fallback */
const LOCAL_VISITS_KEY = 'siq_visits';

/**
 * @description Gets local visit count from localStorage
 * @returns {number} Current local visit count
 */
function getLocalVisitCount() {
  try {
    return parseInt(
      localStorage.getItem(LOCAL_VISITS_KEY) || '0', 10
    );
  } catch (_) { return 0; }
}

/**
 * @description Increments local visit count in localStorage
 * @returns {number} New count after increment
 */
function incrementLocalVisit() {
  try {
    const next = getLocalVisitCount() + 1;
    localStorage.setItem(LOCAL_VISITS_KEY, String(next));
    return next;
  } catch (_) { return 1; }
}

/**
 * @description Initializes Firebase app and Realtime Database.
 *              Returns false safely if SDK unavailable.
 * @returns {boolean} True if Firebase initialized successfully
 */
function initFirebase() {
  try {
    if (typeof firebase === 'undefined') return false;
    if (FIREBASE_CONFIG.apiKey === 'REPLACE_WITH_FIREBASE_API_KEY') {
      return false;
    }
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    firebaseDb = firebase.database();
    firebaseReady = true;
    return true;
  } catch (_) {
    firebaseReady = false;
    return false;
  }
}

/**
 * @description Tracks a page visit using localStorage primarily
 * @returns {Promise<number>} Updated visit count
 */
async function trackVisit() {
  const local = incrementLocalVisit();
  if (!firebaseReady || !firebaseDb) return local;
  try {
    await firebaseDb.ref('analytics/visits')
      .transaction(function(n) { return (n || 0) + 1; });
    const snap = await firebaseDb
      .ref('analytics/visits').once('value');
    return snap.val() || local;
  } catch (_) { return local; }
}

/**
 * @description Gets current visit count
 * @returns {Promise<number>} Current visit count
 */
async function getVisitCount() {
  const local = getLocalVisitCount();
  if (!firebaseReady || !firebaseDb) return local;
  try {
    const snap = await firebaseDb
      .ref('analytics/visits').once('value');
    return snap.val() || local;
  } catch (_) { return local; }
}

/**
 * @description Records which stadium zone was viewed
 * @param {string} zoneName - Zone identifier
 * @returns {Promise<void>}
 */
async function recordZoneView(zoneName) {
  if (!firebaseReady || !firebaseDb) return;
  try {
    const key = zoneName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    await firebaseDb.ref('analytics/zones/' + key)
      .transaction(function(n) { return (n || 0) + 1; });
  } catch (_) { /* fail silently */ }
}

/**
 * @description Records anonymous chatbot query count
 * @returns {Promise<void>}
 */
async function recordChatQuery() {
  if (!firebaseReady || !firebaseDb) return;
  try {
    await firebaseDb.ref('analytics/chat_queries')
      .transaction(function(n) { return (n || 0) + 1; });
  } catch (_) { /* fail silently */ }
}

/**
 * @description Records anonymous transport query
 * @param {string} transportType - Type of transport queried
 * @returns {Promise<void>}
 */
async function recordTransportQuery(transportType) {
  if (!firebaseReady || !firebaseDb) return;
  try {
    const key = transportType.replace(/[^a-z0-9]/gi,'_').toLowerCase();
    await firebaseDb.ref('analytics/transport/' + key)
      .transaction(function(n) { return (n || 0) + 1; });
  } catch (_) { /* fail silently */ }
}
