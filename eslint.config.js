import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        STADIUM_DATA: "readonly",
        GEMINI_API_KEY: "readonly",
        CLOUD_FUNCTION_URL: "readonly",
        buildNavigation: "readonly",
        buildCrowdMonitor: "readonly",
        buildTransportHub: "readonly",
        buildAccessibility: "readonly",
        buildSustainability: "readonly",
        buildOperations: "readonly",
        buildChatbot: "readonly",
        initGoogleCharts: "readonly",
        buildCharts: "readonly",
        initFirebase: "readonly",
        trackVisit: "readonly",
        getVisitCount: "readonly",
        recordZoneView: "readonly",
        recordChatQuery: "readonly",
        debounce: "readonly",
        scrollToSection: "readonly",
        formatTime: "readonly",
        sanitizeInput: "readonly",
        generateId: "readonly",
        getStorage: "readonly",
        setStorage: "readonly",
        runAllTests: "readonly",
        trackPageView: "readonly",
        trackFeatureUse: "readonly",
        trackChatMessage: "readonly",
        trackNavigationUse: "readonly",
        trackTransportQuery: "readonly",
        googleTranslateElementInit: "readonly",
        sendToGemini: "readonly",
        gtag: "readonly",
        firebase: "readonly",
        google: "readonly",
        toggleAccordion: "readonly",
        applyDynamicStyles: "readonly"
      }
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "eqeqeq": "error",
      "no-empty": "warn",
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "no-unused-expressions": "warn",
      "consistent-return": "warn",
      "default-case": "warn"
    }
  }
];
