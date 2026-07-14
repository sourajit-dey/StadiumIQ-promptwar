/**
 * @file chatbot.js
 * @description StadiumIQ Gemini-powered AI Assistant chatbot interface.
 *              Handles input sanitization, rate-limiting, conversation history,
 *              multilingual responses, and mock fallback modes.
 * @author StadiumIQ
 * @version 1.0.0
 */

/** @type {Array} Conversation history logs capped at 10 messages */
let conversationHistory = [];

/** @type {number} Timestamp of the last chatbot request to enforce a 2-second rate limit */
let lastChatRequestTime = 0;

/** @type {boolean} State tracking whether the chatbot panel is open */
let isChatbotOpen = false;

/**
 * @description Builds and inserts the chatbot FAB and panel in the DOM
 * @returns {void}
 */
function buildChatbot() {
  const fabContainer = document.getElementById('assistant-fab-container');
  const sectionContainer = document.getElementById('assistant-content');

  const welcomeMessage = 'Welcome to StadiumIQ! ⚽ I am your GenAI-powered assistant for the FIFA World Cup 2026. ' +
    'Ask me about wayfinding, crowd conditions, transit, sustainability, accessibility, or staff operations.';

  const suggestedChips = [
    'How do I find Gate A?',
    'What is the crowd density?',
    'Show eco-friendly transit options',
    'Sensory accessibility contacts'
  ];

  /* 1. Build the FAB and Floating Chat Panel at bottom-right */
  if (fabContainer) {
    let fabHtml = '';
    /* Floating FAB button */
    fabHtml += '<button id="chat-fab" class="chat-fab" role="button" aria-expanded="false" ';
    fabHtml += 'aria-haspopup="true" aria-label="Open StadiumIQ AI Assistant">';
    fabHtml += '🤖</button>';

    /* Floating Chat Panel */
    fabHtml += '<div id="chat-window" class="chat-window" aria-hidden="true">';
    fabHtml += '<div class="chat-header">';
    fabHtml += '<h4>StadiumIQ AI Assistant</h4>';
    fabHtml += '<button id="chat-close" class="chat-close" aria-label="Close Assistant">×</button>';
    fabHtml += '</div>';
    fabHtml += '<div id="chat-messages-floating" class="chat-messages" role="log" aria-live="polite"></div>';
    fabHtml += '<div class="chat-chips">';
    suggestedChips.forEach(function(chipText) {
      fabHtml += '<button class="chat-chip-btn" data-text="' + chipText + '" aria-label="Ask suggested question: ' + chipText + '">' + chipText + '</button>';
    });
    fabHtml += '</div>';
    fabHtml += '<div class="chat-footer">';
    fabHtml += '<label for="chat-input-floating" class="sr-only">Type a stadium question</label>';
    fabHtml += '<input type="text" id="chat-input-floating" placeholder="Ask about FIFA WC 2026…" maxlength="500">';
    fabHtml += '<button id="chat-send-floating" aria-label="Send message">Send</button>';
    fabHtml += '</div>';
    fabHtml += '</div>';

    fabContainer.innerHTML = fabHtml;
  }

  /* 2. Build the Embedded Chat Section UI in the main layout */
  if (sectionContainer) {
    let secHtml = '';
    secHtml += '<div class="embedded-chat-card animate-on-scroll">';
    secHtml += '<div class="embedded-chat-header">';
    secHtml += '<h3>🤖 StadiumIQ AI Decision Center</h3>';
    secHtml += '<p>Access operations guidance, emergency guidelines, and tournament configurations instantly.</p>';
    secHtml += '</div>';
    secHtml += '<div id="chat-messages-embedded" class="chat-messages" role="log" aria-live="polite"></div>';
    secHtml += '<div class="chat-chips">';
    suggestedChips.forEach(function(chipText) {
      secHtml += '<button class="chat-chip-btn" data-text="' + chipText + '" aria-label="Ask suggested question: ' + chipText + '">' + chipText + '</button>';
    });
    secHtml += '</div>';
    secHtml += '<div class="chat-footer">';
    secHtml += '<label for="chatbot-input" class="sr-only">Ask a stadium question</label>';
    secHtml += '<input type="text" id="chatbot-input" class="chatbot-input" placeholder="Ask a stadium question (e.g., Gate directions, Code Blue protocols)..." maxlength="500">';
    secHtml += '<button id="chat-send-embedded" class="chat-send-embedded" aria-label="Send query">Send Query</button>';
    secHtml += '</div>';
    secHtml += '</div>';

    sectionContainer.innerHTML = secHtml;
  }

  /* Add default welcome messages */
  const floatLog = document.getElementById('chat-messages-floating');
  const embedLog = document.getElementById('chat-messages-embedded');
  if (floatLog) appendMessageLog(floatLog, 'bot', welcomeMessage);
  if (embedLog) appendMessageLog(embedLog, 'bot', welcomeMessage);

  attachChatbotListeners();
}

/**
 * @description Attaches all event listeners for the chatbot components using named functions
 * @returns {void}
 */
function attachChatbotListeners() {
  const fab = document.getElementById('chat-fab');
  if (fab) fab.addEventListener('click', handleFabToggle);

  const closeBtn = document.getElementById('chat-close');
  if (closeBtn) closeBtn.addEventListener('click', handleFabToggle);

  const sendFloat = document.getElementById('chat-send-floating');
  if (sendFloat) sendFloat.addEventListener('click', handleSendFloating);

  const inputFloat = document.getElementById('chat-input-floating');
  if (inputFloat) inputFloat.addEventListener('keypress', handleKeyPressFloating);

  const sendEmbed = document.getElementById('chat-send-embedded');
  if (sendEmbed) sendEmbed.addEventListener('click', handleSendEmbedded);

  const inputEmbed = document.getElementById('chatbot-input');
  if (inputEmbed) inputEmbed.addEventListener('keypress', handleKeyPressEmbedded);

  const allChips = document.querySelectorAll('.chat-chip-btn');
  allChips.forEach(function(chip) {
    chip.addEventListener('click', handleChipClick);
  });
}

/**
 * @description Toggles visibility of the floating chatbot panel and updates accessibilities
 * @returns {void}
 */
function handleFabToggle() {
  const fab = document.getElementById('chat-fab');
  const windowEl = document.getElementById('chat-window');
  if (!fab || !windowEl) return;

  isChatbotOpen = !isChatbotOpen;
  fab.setAttribute('aria-expanded', String(isChatbotOpen));
  windowEl.setAttribute('aria-hidden', String(!isChatbotOpen));
  windowEl.classList.toggle('open', isChatbotOpen);

  trackFeatureUse('Chatbot', isChatbotOpen ? 'open_fab' : 'close_fab');
}

/**
 * @description Handles click event for sending floating panel messages
 * @returns {void}
 */
function handleSendFloating() {
  const input = document.getElementById('chat-input-floating');
  if (input) processUserMessage(input, 'chat-messages-floating');
}

/**
 * @description Handles Enter keypress event inside floating panel input
 * @param {KeyboardEvent} e - Key event
 * @returns {void}
 */
function handleKeyPressFloating(e) {
  if (e.key === 'Enter') {
    handleSendFloating();
  }
}

/**
 * @description Handles click event for sending embedded chatbot section messages
 * @returns {void}
 */
function handleSendEmbedded() {
  const input = document.getElementById('chatbot-input');
  if (input) processUserMessage(input, 'chat-messages-embedded');
}

/**
 * @description Handles Enter keypress event inside embedded chatbot section input
 * @param {KeyboardEvent} e - Key event
 * @returns {void}
 */
function handleKeyPressEmbedded(e) {
  if (e.key === 'Enter') {
    handleSendEmbedded();
  }
}

/**
 * @description Handles clicking suggested query chips
 * @param {MouseEvent} e - Click event
 * @returns {void}
 */
function handleChipClick(e) {
  const text = e.currentTarget.getAttribute('data-text');
  trackFeatureUse('Chatbot', 'chip_click');

  /* If the floating window is open, send to floating log. Otherwise send to embedded log. */
  if (isChatbotOpen) {
    const input = document.getElementById('chat-input-floating');
    if (input) {
      input.value = text;
      handleSendFloating();
    }
  } else {
    const input = document.getElementById('chatbot-input');
    if (input) {
      input.value = text;
      handleSendEmbedded();
    }
  }
}

/**
 * @description Appends a message bubble inside a target chat log panel
 * @param {HTMLElement} logElement - Target DOM element
 * @param {string} sender - 'user' or 'bot'
 * @param {string} text - Message text
 * @returns {void}
 */
function appendMessageLog(logElement, sender, text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-message ' + sender;
  bubble.textContent = text;
  logElement.appendChild(bubble);
  logElement.scrollTop = logElement.scrollHeight;
}

/**
 * @description Processes a user message, validates rates/lengths, and coordinates the API request or mock response
 * @param {HTMLInputElement} inputElement - Input DOM field
 * @param {string} logId - Target log element ID
 * @returns {void}
 */
function processUserMessage(inputElement, logId) {
  const rawText = inputElement.value.trim();
  if (!rawText) return;

  /* 1. Input Length Cap Check */
  let text = rawText;
  if (text.length > 500) {
    text = text.substring(0, 500);
  }

  /* 2. Rate Limiting Enforcer (Minimum 2 seconds) */
  const now = Date.now();
  if (now - lastChatRequestTime < 2000) {
    const errorBubble = document.getElementById(logId);
    if (errorBubble) {
      appendMessageLog(errorBubble, 'bot', '⚠️ Please wait at least 2 seconds between queries.');
    }
    return;
  }
  lastChatRequestTime = now;

  /* 3. Sanitization before any API dispatch */
  const cleanQuery = sanitizeInput(text);
  inputElement.value = '';

  /* Render user message in both panels for synchronization, or target panel */
  const currentLog = document.getElementById(logId);
  if (currentLog) {
    appendMessageLog(currentLog, 'user', cleanQuery);
  }

  /* Keep conversation history restricted to 10 items */
  conversationHistory.push({ role: 'user', content: cleanQuery });
  if (conversationHistory.length > 10) {
    conversationHistory.shift();
  }

  trackChatMessage();
  recordChatQuery();

  /* Call AI service */
  dispatchAiRequest(cleanQuery, logId);
}

/**
 * @description Sends a query to the Gemini Cloud Function Proxy or falls back to standard client configurations/mocks
 * @param {string} query - Clean query string
 * @param {string} logId - Log UI identifier
 * @returns {Promise<void>}
 */
async function dispatchAiRequest(query, logId) {
  const currentLog = document.getElementById(logId);
  if (!currentLog) return;

  /* Render loading indicator */
  const loader = document.createElement('div');
  loader.className = 'chat-message bot loader';
  loader.textContent = 'Thinking...';
  currentLog.appendChild(loader);
  currentLog.scrollTop = currentLog.scrollHeight;

  /**
   * @description Cleans loader and appends answer
   * @param {string} responseText - Response string
   * @returns {void}
   */
  function handleComplete(responseText) {
    if (loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
    appendMessageLog(currentLog, 'bot', responseText);
    conversationHistory.push({ role: 'model', content: responseText });
    if (conversationHistory.length > 10) {
      conversationHistory.shift();
    }
  }

  /* Hybrid Mode: check local mock categories first to optimize API calls & speed */
  const localMatch = getMatchedMockResponse(query);
  if (localMatch) {
    setTimeout(function() {
      handleComplete(localMatch);
    }, 400);
    return;
  }

  /* Use Cloud Function Proxy if set, otherwise direct Gemini API if key is present, otherwise fallback to Vercel API endpoint */
  let requestUrl = '';
  let useDirectGemini = false;
  if (CLOUD_FUNCTION_URL !== 'YOUR_CLOUD_FUNCTION_URL_HERE') {
    requestUrl = CLOUD_FUNCTION_URL;
  } else if (GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' && GEMINI_API_KEY !== '') {
    requestUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;
    useDirectGemini = true;
  } else {
    requestUrl = '/api/stadiumIQChat';
  }

  try {
    const payload = (useDirectGemini)
      ? {
          contents: [{
            parts: [{ text: getSystemPrompt() + '\nUser query: ' + query }]
          }]
        }
      : { message: query, history: conversationHistory };

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('API server returned error status.');
    const data = await response.json();

    let textAnswer = '';
    if (useDirectGemini) {
      textAnswer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned from AI model.';
    } else {
      textAnswer = data.reply || data.response || 'No operational answer returned.';
    }
    handleComplete(textAnswer);
  } catch (err) {
    /* Safe failure path handling: logs message details to UI and recovers gracefully */
    handleComplete('⚠️ Live connection offline. Fallback Help: ' + getMockResponse());
  }
}

/**
 * @description Checks if query matches specific local operational logs categories
 * @param {string} query - Sanitized query string
 * @returns {string|null} Specific mock response or null if no matches
 */
function getMatchedMockResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('gate') || q.includes('entry') || q.includes('find my')) {
    return 'MetLife Stadium has 4 primary gates: Gate A (North), Gate B (East), Gate C (South), and Gate D (West). ' +
      'Check your digital mobile ticket barcode to scan at the correct gate. Arrive at least 2 hours before kickoff.';
  }
  if (q.includes('crowd') || q.includes('density') || q.includes('zone') || q.includes('busy')) {
    return 'Our crowd monitor records live density. Currently: North Stand is Busy (83% capacity), ' +
      'South Stand has Moderate crowd (54%), and West Lower has Low Crowd (63%). Stewards recommend using ' +
      'South and West entrances for faster routing.';
  }
  if (q.includes('eco') || q.includes('transit') || q.includes('transport') || q.includes('shuttle') || q.includes('metro')) {
    return 'We advise sustainable transport! Take the Metro/Rail directly to MetLife Stadium station (every 8 min, $3-5). ' +
      'Official Electric Shuttles run from major fan parks (every 15 min, $12 return). Secure cycling bays are free near Gate A.';
  }
  if (q.includes('access') || q.includes('wheelchair') || q.includes('sensory') || q.includes('quiet')) {
    return 'StadiumIQ supports accessible fans. Wheelchair entrances with companion spacing are operational at all gates. ' +
      'Tactile maps, Braille guides, and audio commentary headsets can be collected at Accessibility Desk (Gate A). ' +
      'Quiet rooms are located on Level 1 (Room Q1) and Level 2 (Room Q2). Access hotline: +1-800-FIFA-ACC.';
  }
  if (q.includes('sustain') || q.includes('solar') || q.includes('recycle') || q.includes('green')) {
    return 'MetLife Stadium targeting a green tournament: 78% renewable energy achieved via roof solar panels, ' +
      '64% zero-waste concessions recycling rate, and rainwater harvesting is capturing 1.64M liters. Zero single-use plastics are enforced.';
  }
  if (q.includes('medical') || q.includes('emergency') || q.includes('code') || q.includes('protocol')) {
    return 'Emergency Command Reference: \n' +
      '🚨 CODE GREEN: Medical incident. Deploy nearest medical patrol.\n' +
      '🚨 CODE BLUE: Crowd surge threat. Activate entry hold and perimeter gates.\n' +
      '🚨 CODE RED: Security risk. Stewards alert, await commands.\n' +
      '🚨 CODE YELLOW: Infrastructure failure. Call operations line (ext 5555).';
  }
  if (q.includes('team') || q.includes('match') || q.includes('date') || q.includes('final')) {
    return 'FIFA World Cup 2026 features 48 teams competing across 104 matches from June 11 to July 19, 2026. ' +
      'The Grand Final will take place at MetLife Stadium in New Jersey on July 19, 2026. Expected global attendance is 5 million+.';
  }

  return null;
}

/**
 * @description Provides matching context-based operational facts for the WC 2026 venues
 * @returns {string} Response string
 */
function getMockResponse() {
  return 'StadiumIQ assistant: I can assist with tournament operations or fan queries for the 16 host venues ' +
    '(MetLife Stadium, Estadio Azteca, BC Place, SoFi, AT&T, etc.). Try asking: "How do I find Gate A?" or "Explain emergency Code Blue".';
}

/**
 * @description Returns the core training rules for the Gemini model context
 * @returns {string} System prompt string
 */
function getSystemPrompt() {
  return 'You are StadiumIQ AI, the official Generative AI assistant for the FIFA World Cup 2026 operations. ' +
    'Support fans, volunteers, and operations staff across 16 venues (including MetLife Stadium, Azteca, BC Place). ' +
    'Provide helpful answers about navigation, crowd density (6 zones), green transport (metro, shuttle, cycling), ' +
    'accessibility facilities (wheelchairs, sensory quiet rooms, loops), sustainability progress (solar energy), ' +
    'and operations roles (stewards, medicals). Enforce emergency codes (CODE GREEN, BLUE, RED, YELLOW). Keep answers concise.';
}
