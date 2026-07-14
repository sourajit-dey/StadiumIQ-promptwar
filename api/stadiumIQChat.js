/**
 * @file stadiumIQChat.js
 * @description Vercel Serverless Function proxying requests to Google Gemini 2.0 Flash.
 *              Acts as a secure bridge to isolate the GEMINI_API_KEY from the client side.
 */

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * @description Serves POST requests to connect securely to the Gemini API
 * @param {import('@vercel/node').VercelRequest} req - Request object
 * @param {import('@vercel/node').VercelResponse} res - Response object
 * @returns {Promise<void>}
 */
module.exports = async function (req, res) {
  /* Set CORS headers for local developer testing compatibility */
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const { message, history } = req.body || {};
  if (!message) {
    res.status(400).json({ error: 'Missing message parameter.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Gemini API Key is not configured on server environments.' });
    return;
  }

  const cleanMessage = String(message).substring(0, 500).replace(/[<>]/g, '');

  try {
    /* Build conversational context from history logs */
    const contents = [];
    contents.push({
      role: 'user',
      parts: [{
        text: 'You are StadiumIQ AI, the official Generative AI assistant for the FIFA World Cup 2026 operations. ' +
              'Support fans, volunteers, and operations staff across 16 venues (including MetLife Stadium, Azteca, BC Place). ' +
              'Provide helpful answers about navigation, crowd density (6 zones), green transport (metro, shuttle, cycling), ' +
              'accessibility facilities (wheelchairs, sensory quiet rooms, loops), sustainability progress (solar energy), ' +
              'and operations roles (stewards, medicals). Enforce emergency codes (CODE GREEN, BLUE, RED, YELLOW). Keep answers concise.'
      }]
    });

    if (Array.isArray(history)) {
      history.forEach(function (h) {
        const role = h.role === 'model' ? 'model' : 'user';
        const text = String(h.content).replace(/[<>]/g, '');
        contents.push({
          role: role,
          parts: [{ text: text }]
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: cleanMessage }]
    });

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: contents })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned from AI model.';

    res.status(200).json({ reply: replyText });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error occurred during AI processing.' });
  }
};
