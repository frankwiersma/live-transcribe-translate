require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');
const { createServer } = require('http');
const fetch = require('cross-fetch');
const { createClient } = require('@deepgram/sdk');
const path = require('path');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// Initialize Deepgram
const deepgram = createClient(process.env.DG_KEY);

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Handle favicon.ico to prevent 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Translation function using Google Gemini API
async function translate(source, target, text) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('No Gemini API key provided');
    return text;
  }

  const targetLanguageMap = {
    'en': 'English',
    'de': 'German', 
    'fr': 'French',
    'es': 'Spanish',
    'pl': 'Polish',
    'it': 'Italian',
    'tr': 'Turkish',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'ru': 'Russian',
    'pt': 'Portuguese',
    'nl': 'Dutch'
  };

  const targetLanguageName = targetLanguageMap[target] || target;
  
  const prompt = `Translate this text to ${targetLanguageName}. Return ONLY the translation, no explanations:

"${text}"

Translation:`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.3, 
          maxOutputTokens: 1500
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      let translation = data.candidates[0].content.parts[0].text.trim();
      
      // Clean up common unwanted patterns
      translation = translation.replace(/^(Translation:|Here.*?:|.*?translation.*?:)/i, '').trim();
      translation = translation.replace(/\*\*.*?\*\*/g, '').trim(); // Remove bold markers
      translation = translation.replace(/^\*.*$/gm, '').trim(); // Remove bullet points
      translation = translation.split('\n')[0].trim(); // Take only first line
      
      return translation;
    }
    
    throw new Error('Invalid response structure from Gemini API');
  } catch (error) {
    console.error('Gemini translation error:', error);
    return `[Translation Error] ${text}`; // Return original text with error note
  }
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  let deepgramLive = null;
  let currentInputLanguage = 'nl'; // Default input language
  let currentOutputLanguage = 'nl'; // Default output language

  ws.on('message', async (message) => {
    // Handle binary audio data first - if it's a Buffer and large, it's likely audio
    if (Buffer.isBuffer(message)) {
      // If message is larger than 100 bytes, treat as binary audio
      if (message.length > 100) {
        if (deepgramLive && deepgramLive.getReadyState() === 1) {
          deepgramLive.send(message);
        }
        return;
      }
      
      // For smaller buffers, check if they start with JSON characters
      const messageStr = message.toString('utf8');
      if (!messageStr.startsWith('{') && !messageStr.startsWith('"')) {
        if (deepgramLive && deepgramLive.getReadyState() === 1) {
          deepgramLive.send(message);
        }
        return;
      }
    }

    // Handle text/JSON messages
    let messageText;
    try {
      messageText = Buffer.isBuffer(message) ? message.toString('utf8') : message;
      
      // Skip empty messages
      if (!messageText || messageText.trim() === '') {
        return;
      }
      
      // Only attempt JSON parsing on messages that look like JSON
      if (!messageText.includes('{') && !messageText.includes('"')) {
        return;
      }
      
      // Try to parse as JSON
      const data = JSON.parse(messageText);
      
      if (data.type === 'config') {
        // Update language settings
        currentInputLanguage = data.inputLanguage || 'nl';
        currentOutputLanguage = data.outputLanguage || 'nl';
        
        // Close existing connection
        if (deepgramLive) {
          deepgramLive.finish();
        }
        
        // Create new Deepgram live connection with updated language
        deepgramLive = deepgram.listen.live({
          model: 'nova-2',
          language: currentInputLanguage,
          punctuate: true,
          interim_results: true,
          endpointing: 300,
        });

        // Handle transcription results
        deepgramLive.on('Results', async (data) => {
          const response = data.channel?.alternatives?.[0];
          
          if (response?.transcript) {
            const originalText = response.transcript;
            
            // If output language is same as input, just send the transcription
            if (currentInputLanguage === currentOutputLanguage) {
              ws.send(JSON.stringify({
                type: 'transcription',
                text: originalText,
                isFinal: data.is_final
              }));
            } else {
              // Only show final translated results to avoid flickering between languages
              if (data.is_final) {
                const translatedText = await translate(currentInputLanguage, currentOutputLanguage, originalText);
                ws.send(JSON.stringify({
                  type: 'translation',
                  text: translatedText,
                  original: originalText,
                  isFinal: true
                }));
              }
              // Skip interim results when translating to avoid showing original language first
            }
          }
        });

        deepgramLive.on('error', (error) => {
          console.error('Deepgram error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Speech recognition error'
          }));
        });

        ws.send(JSON.stringify({
          type: 'status',
          message: `Ready - Input: ${currentInputLanguage}, Output: ${currentOutputLanguage}`
        }));
        
      } else if (data.type === 'start') {
        if (deepgramLive) {
          ws.send(JSON.stringify({
            type: 'status',
            message: 'Listening...'
          }));
        }
      } else if (data.type === 'stop') {
        if (deepgramLive) {
          deepgramLive.finish();
          deepgramLive = null;
        }
        ws.send(JSON.stringify({
          type: 'status',
          message: 'Stopped'
        }));
      }
    } catch (error) {
      // Only log errors for messages that look like they should be JSON
      if (messageText && messageText.length < 200 && (messageText.includes('{') || messageText.includes('"'))) {
        console.error('JSON parsing error for message:', messageText.substring(0, 50), '...', error.message);
      }
      // For binary data that got here, send it to Deepgram if available
      else if (deepgramLive && deepgramLive.getReadyState() === 1) {
        deepgramLive.send(message);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (deepgramLive) {
      deepgramLive.finish();
    }
  });

  // Send initial status
  ws.send(JSON.stringify({
    type: 'status',
    message: 'Connected - Configure languages to start'
  }));
});

// API endpoint to test keys
app.post('/api/test-keys', async (req, res) => {
  try {
    // Test Deepgram key
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      { url: 'https://static.deepgram.com/examples/nasa-spacewalk-interview.wav' },
      { model: 'nova-2', language: 'en' }
    );
    
    if (error) {
      throw new Error(`Deepgram test failed: ${error.message}`);
    }
    
    // Test Gemini key
    const geminiTest = await translate('en', 'es', 'Hello');
    
    res.json({ 
      success: true, 
      deepgram: !!result,
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
  console.log('Make sure to set DG_KEY and GEMINI_API_KEY in your .env file');
}); 