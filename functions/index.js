/**
 * @file index.js
 * @description Google Cloud Functions backend proxy for StadiumIQ.
 *              Acts as a secure bridge to Gemini 2.0 Flash, keeping the API key hidden.
 *              Performs server-side input sanitization, length validation, and header injection.
 * @author StadiumIQ
 * @version 1.0.0
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
const { GoogleGenAI } = require('@google/generative-ai');

admin.initializeApp();

/** @type {Function} CORS middleware handler */
const corsHandler = cors({ origin: true });

/**
 * @description Sanitizes server-side string inputs to prevent XSS injections.
 * @param {string} input - Raw string
 * @returns {string} Sanitized string
 */
function sanitizeServerInput(input) {
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
 * @description Cloud Function HTTPS endpoint proxying user prompts securely to the Gemini API.
 *              Exports 'stadiumIQChat' endpoint.
 * @param {functions.https.Request} req - The HTTPS request object
 * @param {functions.Response} res - The response object
 * @returns {void}
 */
exports.stadiumIQChat = functions.https.onRequest(function(req, res) {
  return corsHandler(req, res, async function() {
    /* Inject HTTP Security headers */
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
      return;
    }

    const rawMessage = req.body.message || '';
    const history = req.body.history || [];

    /* Server-side validation: Max 500 characters */
    let message = sanitizeServerInput(rawMessage);
    if (!message) {
      res.status(400).json({ error: 'Bad Request. Message is empty.' });
      return;
    }

    if (message.length > 500) {
      message = message.substring(0, 500);
    }

    /* Retrieve Gemini API Key from configuration environment */
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Operational Error. Gemini API key is not configured.' });
      return;
    }

    try {
      /* Initialize Gemini client */
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const model = ai.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: 'You are StadiumIQ AI, the official Generative AI assistant for the FIFA World Cup 2026 operations. ' +
          'Support fans, volunteers, and operations staff across 16 venues (including MetLife Stadium, Azteca, BC Place). ' +
          'Provide helpful answers about navigation, crowd density (6 zones), green transport (metro, shuttle, cycling), ' +
          'accessibility facilities (wheelchairs, sensory quiet rooms, loops), sustainability progress (solar energy), ' +
          'and operations roles (stewards, medicals). Enforce emergency codes (CODE GREEN, BLUE, RED, YELLOW). Keep answers concise.'
      });

      /* Reconstruct thread contents matching the API schema */
      const contents = [];

      /* Map historical conversations up to the last 10 */
      const slicedHistory = history.slice(-8); // Slice history to keep payload size efficient
      slicedHistory.forEach(function(msg) {
        contents.push({
          role: msg.role === 'bot' ? 'model' : 'user',
          parts: [{ text: sanitizeServerInput(msg.content) }]
        });
      });

      /* Append active user query */
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const responseResult = await model.generateContent({
        contents: contents
      });

      const replyText = responseResult.response.text();
      res.status(200).json({ reply: replyText });

    } catch (err) {
      /* Fallback responses when connection errors or api exhaustion happens */
      res.status(500).json({
        error: 'AI assistant error.',
        fallback: 'StadiumIQ assistant: Operational teams are checking connection lines. ' +
          'For immediate support, locate the nearest Stadium steward or volunteer.'
      });
    }
  });
});
