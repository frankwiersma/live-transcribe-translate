require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');
const { createServer } = require('http');
const fetch = require('cross-fetch');
const path = require('path');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Handle favicon.ico to prevent 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Translate function using Google Cloud Translation API v2 (Basic)
// 20x faster than Gemini, optimized for real-time translation
async function translate(source, target, text) {
  if (!process.env.GOOGLE_CLOUD_API_KEY) {
    console.warn('No Google Cloud API key provided');
    return text;
  }

  try {
    const url = new URL('https://translation.googleapis.com/language/translate/v2');
    url.searchParams.append('key', process.env.GOOGLE_CLOUD_API_KEY);
    url.searchParams.append('q', text);
    url.searchParams.append('source', source);
    url.searchParams.append('target', target);
    url.searchParams.append('format', 'text');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Translation API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Log for debugging
    console.log('Translation API response:', JSON.stringify(data, null, 2));

    // Extract translated text
    if (data?.data?.translations?.[0]?.translatedText) {
      return data.data.translations[0].translatedText;
    }

    throw new Error('Invalid response structure from Translation API');
  } catch (error) {
    console.error('Translation error:', error);
    return `[Translation Error] ${text}`; // Return original text with error note
  }
}

// Endpoint to generate ElevenLabs single-use token for Scribe v2 Realtime
app.post('/api/scribe-token', async (req, res) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    const response = await fetch('https://api.elevenlabs.io/v1/single-use-token/realtime_scribe', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorData?.error || 'Unknown error'}`);
    }

    const data = await response.json();
    res.json({ token: data.token });
  } catch (error) {
    console.error('Error generating ElevenLabs token:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// WebSocket connection handling for translation requests
wss.on('connection', (ws) => {
  console.log('Client connected for translation service');

  let currentInputLanguage = 'nl'; // Default input language
  let currentOutputLanguage = 'en'; // Default output language

  ws.on('message', async (message) => {
    try {
      const messageText = Buffer.isBuffer(message) ? message.toString('utf8') : message;
      const data = JSON.parse(messageText);

      if (data.type === 'config') {
        // Update language settings
        currentInputLanguage = data.inputLanguage || 'nl';
        currentOutputLanguage = data.outputLanguage || 'en';

        ws.send(JSON.stringify({
          type: 'status',
          message: `Ready - Input: ${currentInputLanguage}, Output: ${currentOutputLanguage}`
        }));
      } else if (data.type === 'translate') {
        // Handle translation request from client
        const { text, isFinal } = data;

        if (currentInputLanguage === currentOutputLanguage) {
          // No translation needed
          ws.send(JSON.stringify({
            type: 'transcription',
            text: text,
            isFinal: isFinal
          }));
        } else {
          // Translate the text
          if (isFinal) {
            const translatedText = await translate(currentInputLanguage, currentOutputLanguage, text);
            ws.send(JSON.stringify({
              type: 'translation',
              text: translatedText,
              original: text,
              isFinal: true
            }));
          } else {
            // For interim results, optionally skip translation to reduce API calls
            ws.send(JSON.stringify({
              type: 'transcription',
              text: text,
              isFinal: false
            }));
          }
        }
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Server error processing request'
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from translation service');
  });

  // Send initial status
  ws.send(JSON.stringify({
    type: 'status',
    message: 'Translation service ready'
  }));
});

// API endpoint to test keys
app.post('/api/test-keys', async (req, res) => {
  try {
    // Test ElevenLabs key by generating a token
    const elevenlabsResponse = await fetch('https://api.elevenlabs.io/v1/single-use-token/realtime_scribe', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!elevenlabsResponse.ok) {
      throw new Error(`ElevenLabs test failed: ${elevenlabsResponse.status}`);
    }

    const elevenlabsData = await elevenlabsResponse.json();

    // Test Gemini key
    const geminiTest = await translate('en', 'es', 'Hello');

    res.json({
      success: true,
      elevenlabs: !!elevenlabsData.token,
      gemini: geminiTest !== 'Hello' && !geminiTest.includes('[Translation Error]')
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to set ELEVENLABS_API_KEY and GOOGLE_CLOUD_API_KEY in your .env file');
});
