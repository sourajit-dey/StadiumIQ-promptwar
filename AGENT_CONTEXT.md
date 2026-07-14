# AGENT_CONTEXT.md — StadiumIQ
# FIFA World Cup 2026 — GenAI Stadium Experience Platform
# READ THIS ENTIRE FILE BEFORE WRITING A SINGLE LINE OF CODE

==============================================================
WHAT THIS PROJECT IS
==============================================================

StadiumIQ is a GenAI-powered web platform for the FIFA World
Cup 2026 that serves fans, volunteers, organizers, and venue
staff. It leverages Google Gemini 2.0 Flash to provide
intelligent assistance across navigation, crowd management,
accessibility, transportation, sustainability, multilingual
support, and real-time operational decision support.

This is a Google PromptWars Virtual 2026 Challenge 4 submission.
Evaluated by an AI checker on 6 parameters.

TARGET: Top 3 ranking on first and only submission attempt.
There are no second chances. Build it right the first time.

==============================================================
THE EXACT PROBLEM STATEMENT — SOLVE EVERY WORD
==============================================================

"Build a GenAI-enabled solution that enhances stadium operations
and the overall tournament experience for fans, organizers,
volunteers, or venue staff. The solution must leverage
Generative AI to improve navigation, crowd management,
accessibility, transportation, sustainability, multilingual
assistance, operational intelligence, or real-time decision
support during the FIFA World Cup 2026."

EVERY feature must map to at least one of these 8 areas:
1. Navigation — covered by: Smart Wayfinding section + Maps
2. Crowd management — covered by: Live Crowd Monitor + Charts
3. Accessibility — covered by: Accessibility Hub section
4. Transportation — covered by: Transport Hub section
5. Sustainability — covered by: Green Stadium Dashboard
6. Multilingual assistance — covered by: AI chatbot + Translate
7. Operational intelligence — covered by: Staff Operations section
8. Real-time decision support — covered by: AI Assistant + Firebase

If a feature does not serve one of these 8 areas, do not build it.

==============================================================
PROVEN SCORING KNOWLEDGE — FROM RANK 48/20,448
==============================================================

These are real results from Challenge 2 (96.78% score, rank 48):

WHAT SCORED 100%:
- Efficiency: Service Worker + PWA + single IntersectionObserver
  + debounced inputs + DNS prefetch hints + lazy loading
- Google Services: 12 services, each serving a real purpose,
  Cloud Functions backend detected, Firebase detected
- Problem Statement Alignment: every section of the app
  directly addressed a specific part of the problem statement

WHAT SCORED 98.75%:
- Security: strict CSP with zero unsafe-inline, Cloud Functions
  proxy keeping API key off client, sanitizeInput on all input,
  rate limiting, input length caps, named event listeners
- Accessibility: lang=en-IN on html, skip link, aria-labels,
  aria-expanded, role attributes, WCAG AA contrast, keyboard nav

WHAT SCORED 97.5%:
- Testing: 15 test groups triggered by ?test=true URL param

WHAT SCORED 86.25% — THE ONE FAILURE — FIX THIS:
- Code Quality: some functions lacked JSDoc, some event listeners
  were anonymous, some edge-case functions had no @param/@returns
- FIX: Every single function, no exceptions, must have complete
  JSDoc with @description, @param with types, @returns with type

==============================================================
THE 6 JUDGING PARAMETERS — WHAT EACH ONE REQUIRES
==============================================================

PARAMETER 1 — CODE QUALITY (target 95%+)
Requirements:
- Every JS file starts with @file JSDoc block
- Every function has @description, @param {type}, @returns {type}
- No exceptions. Zero anonymous event handlers
- All event listeners use named functions
- const/let only — never var
- No console.log() outside tests.js
- Object.freeze() on all data constants
- eslint.config.js present and configured
- README.md with architecture, features, deploy instructions
- Clean modular file structure (one concern per file)

PARAMETER 2 — TESTING (target 97%+)
Requirements:
- Minimum 15 test groups in tests.js
- Triggered ONLY by ?test=true URL parameter
- Covers: data integrity, DOM structure, sanitization,
  failure paths, utility functions, storage, Google services,
  accessibility, performance, PWA, multilingual, backend,
  chatbot security, and 2 domain-specific test groups
- Every test uses console.assert() with clear FAIL message
- Every passing test uses console.log('PASS: ...')
- All 15 groups called from runAllTests()

PARAMETER 3 — SECURITY (target 99%+)
Requirements:
- Content Security Policy meta tag with ZERO unsafe-inline
  and ZERO unsafe-eval
- ALL inline scripts moved to external JS files:
  → gtag initialization goes in analytics.js
  → googleTranslateElementInit goes in analytics.js
  → Service Worker registration goes in main.js
  → Zero inline <script> blocks in index.html
- API key in js/config.js which is in .gitignore
- Cloud Functions proxy: API key only in process.env
- sanitizeInput() called before every API request
- Server-side sanitization in functions/index.js
- Rate limiting: 2-second minimum between chatbot requests
- Input length cap: 500 characters maximum
- Named event listeners only — no inline onclick=""
- Security headers in Cloud Function response
- functions/node_modules in .gitignore

PARAMETER 4 — PROBLEM STATEMENT ALIGNMENT (target 100%)
Requirements:
- All 8 GenAI use cases from brief must have dedicated features:
  navigation, crowd management, accessibility, transportation,
  sustainability, multilingual assistance, operational
  intelligence, real-time decision support
- AI chatbot system prompt specifically trained for FIFA WC 2026
  stadium operations context
- Gemini API used meaningfully, not decoratively
- README explicitly maps each feature to the problem statement

PARAMETER 5 — EFFICIENCY (target 100%)
Requirements:
- sw.js at project root with cache-first strategy
- manifest.json with proper PWA configuration
- Single IntersectionObserver instance for ALL animations
- Never create IntersectionObserver inside a loop or per element
- debounce() on all search and filter inputs (min 200ms)
- Conversation history capped at 10 entries
- <img loading="lazy"> on all images
- <link rel="preconnect"> for fonts.googleapis.com + gstatic.com
- <link rel="dns-prefetch"> for 5+ external domains
- will-change: transform on animated elements
- @media prefers-reduced-motion disables all animations

PARAMETER 6 — ACCESSIBILITY (target 99%+)
Requirements:
- <html lang="en"> (FIFA is global — use en not en-IN)
- <a href="#main-content" class="skip-link"> as FIRST body element
- <main id="main-content"> wrapping all sections
- <nav aria-label="Main navigation">
- aria-label on every interactive element
- aria-expanded on all accordions, toggles, chatbot FAB
- role="log" aria-live="polite" on chatbot messages
- role="img" + aria-label on all chart containers
- All iframes have title + aria-label
- :focus-visible with visible outline (3px solid)
- Never outline: none anywhere
- WCAG AA contrast (4.5:1) everywhere
- Text on dark backgrounds must be white or very light
- Text on light backgrounds must be dark

==============================================================
ABSOLUTE RULES — BREAKING ANY OF THESE DROPS THE SCORE
==============================================================

RULE 1: ZERO inline scripts in index.html.
Move ALL initialization to external JS files.
gtag init → analytics.js
googleTranslateElementInit → analytics.js
Service Worker registration → main.js
No exceptions.

RULE 2: ZERO inline onclick="" anywhere.
Every interactive element uses addEventListener with named function.

RULE 3: ZERO var declarations anywhere.
const for values that don't change. let for values that do.

RULE 4: ZERO console.log() outside tests.js.

RULE 5: ZERO anonymous event handler functions.
Wrong: element.addEventListener('click', function() {})
Right: element.addEventListener('click', handleButtonClick)

RULE 6: Every function must have complete JSDoc.
Wrong: function doSomething(x) { ... }
Right:
/**
 * @description What this function does
 * @param {string} x - What x is
 * @returns {void}
 */
function doSomething(x) { ... }

RULE 7: js/config.js must be in .gitignore always.

RULE 8: Object.freeze() on all DATA constants.

RULE 9: Single IntersectionObserver at module level.
Never inside loops, forEach, or per-element creation.

RULE 10: sanitizeInput() before EVERY API call.
Both client-side (chatbot.js) and server-side (functions/index.js).

RULE 11: CSP never weakened.
Only ADD domains. Never add unsafe-inline or unsafe-eval.

RULE 12: DO NOT COMMIT TO GITHUB BEFORE LOCAL TESTING.
DO NOT DEPLOY TO CLOUD BEFORE GITHUB COMMIT.
Order is always: local verify → git commit → gcloud deploy.

==============================================================
DEPLOYMENT ORDER — NEVER SKIP STEPS
==============================================================

STEP 1 — LOCAL VERIFICATION (before any git command):
- Open index.html in browser
- Check console: ZERO red errors
- Test all 8 feature sections work
- Open ?test=true — all 15 test groups show PASS
- Verify visitor counter shows a number
- Verify chatbot opens and responds
- Verify charts render
- Verify Google Maps loads
- Check mobile at 375px width — no horizontal scroll
- Run: grep -r "onclick=" js/ — must return zero results
- Run: git status — js/config.js must NOT appear

STEP 2 — GITHUB COMMIT (only after Step 1 passes):
git add .
git commit -m "StadiumIQ — complete build"
git push -u origin main

STEP 3 — DEPLOY APP ENGINE (only after Step 2):
gcloud app deploy --project=YOUR_PROJECT_ID

STEP 4 — DEPLOY CLOUD FUNCTION (only after Step 3):
cd functions && npm install && cd ..
gcloud functions deploy stadiumIQChat \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_REAL_KEY \
  --project YOUR_PROJECT_ID

STEP 5 — UPDATE CONFIG (after getting Cloud Function URL):
Open js/config.js
Replace CLOUD_FUNCTION_URL placeholder with real URL
git add js/config.js
git commit -m "Add Cloud Function URL"
git push
gcloud app deploy --project=YOUR_PROJECT_ID

STEP 6 — SUBMIT on hack2skill

==============================================================
DESIGN SYSTEM — FIFA WORLD CUP 2026 THEME
==============================================================

CSS Variables:
--primary: #1a56db (FIFA blue)
--primary-dark: #1e40af
--secondary: #dc2626 (FIFA red)
--accent: #f59e0b (gold/trophy)
--bg: #0f172a (deep stadium night)
--surface: #1e293b (dark card surface)
--surface-light: #334155
--text-primary: #f1f5f9 (light on dark)
--text-secondary: #94a3b8
--border: #334155
--success: #22c55e (green)
--warning: #f59e0b (amber)
--danger: #ef4444 (red)
--shadow: 0 2px 8px rgba(0,0,0,0.4)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.6)
--radius: 12px
--radius-sm: 8px
--transition: 0.2s ease
--font-heading: 'Rajdhani', sans-serif
--font-body: 'Inter', sans-serif
--gradient: linear-gradient(135deg, #1a56db 0%, #dc2626 100%)

Theme: Dark stadium night aesthetic.
All surfaces are dark. Text is light.
Accents are FIFA blue + red + gold.
Google Fonts: Rajdhani (bold headings) + Inter (body)

==============================================================
GOOGLE SERVICES TO INCLUDE (12 minimum)
==============================================================

1. Google Cloud App Engine — hosting (app.yaml)
2. Google Cloud Functions — Gemini API proxy (functions/)
3. Google Gemini 2.0 Flash — AI assistant (chatbot.js)
4. Firebase Realtime Database — live crowd data + analytics
5. Google Analytics 4 — feature engagement (analytics.js)
6. Google Charts — crowd density, transport, sustainability charts
7. Google Maps Embed — stadium venue map + transport routes
8. Google Translate — multilingual (FIFA = 200+ countries)
9. Google AI Studio — API key management
10. Google Fonts — Rajdhani + Inter
11. Google Antigravity — development environment
12. Service Worker / PWA — offline capability

Every service must serve a REAL purpose tied to the problem.
Charts show real crowd/transport/sustainability data.
Maps show actual FIFA WC 2026 venue locations.
Translate serves global fans from 200+ countries.
Firebase tracks live crowd counts by zone.

==============================================================
FILE STRUCTURE
==============================================================

StadiumIQ/
├── index.html
├── README.md
├── .gitignore
├── .gcloudignore
├── app.yaml
├── sw.js
├── manifest.json
├── nginx.conf
├── Dockerfile
├── eslint.config.js
├── package.json
├── functions/
│   ├── index.js
│   └── package.json
├── css/
│   ├── style.css
│   ├── components.css
│   └── animations.css
├── js/
│   ├── config.js         (GITIGNORED — API keys)
│   ├── utils.js          (shared utilities)
│   ├── analytics.js      (GA4 + gtag init + Translate init)
│   ├── firebase.js       (Firebase + localStorage fallback)
│   ├── charts.js         (Google Charts — 3 chart types)
│   ├── data.js           (Object.freeze(STADIUM_DATA))
│   ├── navigation.js     (venue map, gate finder, wayfinding)
│   ├── crowd.js          (crowd monitor, zone management)
│   ├── transport.js      (transport hub, route planner)
│   ├── main.js           (app init, observers, UI behaviors)
│   ├── chatbot.js        (Gemini AI assistant)
│   └── tests.js          (15 test groups — ?test=true)
└── assets/
    └── stadium.svg

==============================================================
SECTIONS IN index.html (map to all 8 problem areas)
==============================================================

1. #hero — StadiumIQ overview, live match stats counter
2. #navigation — Smart Wayfinding (Maps + AI directions)
3. #crowd — Live Crowd Monitor (Firebase + Charts)
4. #transport — Transport Hub (routes, timing, AI suggestions)
5. #accessibility — Accessible Facilities Guide
6. #sustainability — Green Stadium Dashboard (Charts)
7. #operations — Staff & Volunteer Operations Center
8. #assistant — Dedicated AI Assistant section
   (chatbot FAB also floats on all sections)

==============================================================
WHAT THE AI DATA MUST COVER (system prompt knowledge)
==============================================================

FIFA World Cup 2026 facts for the AI:
- 48 teams (expanded from 32)
- 3 host nations: USA, Canada, Mexico
- 16 venues across all 3 countries
- USA venues: MetLife Stadium NJ, AT&T Stadium TX,
  SoFi Stadium CA, Levi's Stadium CA, Hard Rock Stadium FL,
  Gillette Stadium MA, Lincoln Financial Field PA,
  Arrowhead Stadium MO, Lumen Field WA, Rose Bowl CA
- Canada venues: BC Place Vancouver, BMO Field Toronto
- Mexico venues: Estadio Azteca, Estadio BBVA,
  Estadio Akron
- Total matches: 104
- Final: MetLife Stadium, July 19, 2026
- Tournament dates: June 11 — July 19, 2026
- Expected attendance per match: 60,000-90,000 fans
- Fan nationalities: 200+ countries represented

==============================================================
SCRIPTS LOADING ORDER IN index.html — DO NOT CHANGE
==============================================================

In <head> (external scripts, no inline):
1. gtag/js async script (GA4 SDK only — no init inline)
2. gstatic.com/charts/loader.js async
3. firebasejs SDK scripts
4. Google Fonts link
5. CSS files

At end of <body> (JS files in this order):
1. js/config.js
2. js/utils.js
3. js/analytics.js  ← contains gtag init + translate init
4. js/firebase.js
5. js/charts.js
6. js/data.js
7. js/navigation.js
8. js/crowd.js
9. js/transport.js
10. js/main.js
11. js/chatbot.js
12. js/tests.js
13. translate.google.com/translate_a/element.js?cb=googleTranslateElementInit

==============================================================
LESSONS FROM CHALLENGE 2 — DO NOT REPEAT THESE MISTAKES
==============================================================

MISTAKE 1: Some functions had no JSDoc → Code Quality 86.25%
FIX: Every function, no exceptions, has full JSDoc

MISTAKE 2: Some inline onclick="" in dynamically generated HTML
FIX: Always use data attributes + addEventListener

MISTAKE 3: Antigravity sometimes generates anonymous handlers
FIX: After build, always search for onclick= and function() {})
     inside addEventListener calls

MISTAKE 4: gtag initialization was inline in index.html
FIX: Move to analytics.js, load external script tag only in HTML

MISTAKE 5: Service Worker registration was inline in index.html
FIX: Move to main.js DOMContentLoaded handler

MISTAKE 6: Visitor counter showed dash (—) on first load
FIX: localStorage fallback always ensures a number shows

MISTAKE 7: Firebase placeholder config caused silent failure
FIX: localStorage is primary, Firebase is enhancement

MISTAKE 8: Code was committed before local testing was complete
FIX: Always complete all 15 test groups PASS before any git add

==============================================================
AFTER THE BUILD IS COMPLETE — SELF-AUDIT CHECKLIST
==============================================================

Run all of these before Step 2 (git commit):

□ Browser console: ZERO red errors on index.html
□ ?test=true URL: all 15 groups show, every line PASS
□ grep -r "onclick=" js/ → zero results
□ grep -r "addEventListener.*function()" js/ → zero or named only
□ git status → js/config.js NOT in output
□ git status → node_modules NOT in output
□ git status → functions/node_modules NOT in output
□ All 8 sections render correctly
□ Chatbot opens, shows welcome, responds to test message
□ Charts render in insights/crowd/sustainability sections
□ Google Maps iframe loads
□ Visitor counter shows a number (not dash)
□ Mobile 375px: no horizontal scroll
□ Tab key navigates all interactive elements
□ Skip link works: Tab on load → Enter → jumps to main content
□ CSP meta tag has no unsafe-inline or unsafe-eval
□ All functions have JSDoc comments above them
□ README.md exists and is complete