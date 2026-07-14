/**
 * @file utils.js
 * @description Shared utility functions for StadiumIQ.
 *              Used across all JS modules.
 * @author StadiumIQ
 * @version 1.0.0
 */

/**
 * @description Creates a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced version
 */
function debounce(func, delay) {
  let timeoutId;
  return function() {
    const args = arguments;
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * @description Sanitizes user input to prevent XSS attacks.
 *              Escapes all 5 dangerous HTML characters.
 *              Must be called before every API request.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized safe string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * @description Smoothly scrolls to a DOM element by ID
 * @param {string} elementId - Target element ID
 * @returns {void}
 */
function scrollToSection(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/**
 * @description Formats a Date to time string HH:MM
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

/**
 * @description Generates a unique ID string
 * @returns {string} Unique identifier
 */
function generateId() {
  return Date.now().toString(36) +
    Math.random().toString(36).substring(2);
}

/**
 * @description Gets data from localStorage safely
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default if missing
 * @returns {*} Parsed value or default
 */
function getStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (_) { return defaultValue; }
}

/**
 * @description Saves data to localStorage safely
 * @param {string} key - Storage key
 * @param {*} value - Value to save
 * @returns {boolean} True if saved successfully
 */
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) { return false; }
}

/**
 * @description Gets a random integer between min and max inclusive
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description Formats a large number with comma separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

/**
 * @description Applies style properties dynamically to elements to circumvent CSP inline style limitations
 * @param {HTMLElement} container - Target container element
 * @returns {void}
 */
function applyDynamicStyles(container) {
  if (!container) return;
  const widthElements = container.querySelectorAll('[data-style-width]');
  widthElements.forEach(function(el) {
    el.style.width = el.getAttribute('data-style-width');
  });
  const bgElements = container.querySelectorAll('[data-style-bg]');
  bgElements.forEach(function(el) {
    el.style.backgroundColor = el.getAttribute('data-style-bg');
  });
  const colorElements = container.querySelectorAll('[data-style-color]');
  colorElements.forEach(function(el) {
    el.style.color = el.getAttribute('data-style-color');
  });
  const borderElements = container.querySelectorAll('[data-style-border]');
  borderElements.forEach(function(el) {
    el.style.borderColor = el.getAttribute('data-style-border');
  });
}

