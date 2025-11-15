# 🎤 Live Transcribe & Translate

A real-time speech transcription and translation system powered by **ElevenLabs Scribe v2 Realtime** that captures speech and displays live captions with optional translation to multiple languages. Built for conferences, meetings, presentations, and public speaking events.

## 📖 Description

This web application listens to speech through the microphone using ElevenLabs Scribe v2 Realtime, displays live captions with ultra-low latency (under 150ms), and can translate them to 11 different languages in real-time. The interface features large, readable text optimized for projection or display screens, with a clean dark theme and intuitive language selection through flag buttons.

The application uses ElevenLabs' state-of-the-art Scribe v2 Realtime model for speech-to-text, providing:
- **Ultra-low latency**: Transcription in under 150ms
- **High accuracy**: Human-level understanding optimized for agentic use cases
- **90+ languages**: Automatic language detection with support for major world languages
- **Partial and committed transcripts**: Real-time streaming with interim results

## ⚡ Key Techniques & Technologies

The codebase demonstrates several modern web development techniques:

- **[ElevenLabs Scribe v2 Realtime](https://elevenlabs.io/docs/cookbooks/speech-to-text/streaming)** - State-of-the-art real-time speech-to-text with ultra-low latency
- **WebSocket Streaming** - Real-time bidirectional communication for audio streaming and transcripts
- **Voice Activity Detection (VAD)** - Automatic speech segmentation based on silence detection
- **Single-Use Token Authentication** - Secure client-side SDK access with server-generated tokens
- **[CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)** - Consistent theming with CSS variables in `:root`
- **[Flexbox Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)** - Responsive interface layout and component alignment
- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)** - HTTP requests to translation services with proper error handling
- **[CSS Transforms & Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)** - Smooth animations for UI interactions
- **ES6 Modules** - Modern JavaScript module system for clean code organization
- **Async/Await Pattern** - Clean asynchronous code for API calls and speech recognition
- **Audio Processing** - Real-time PCM audio capture and processing at 16kHz sample rate

## 🔗 External Services & Libraries

- **[ElevenLabs Scribe v2 Realtime](https://elevenlabs.io/)** - Ultra-low latency speech-to-text API (under 150ms)
- **[Google Gemini API](https://ai.google.dev/)** - Powers the real-time translation functionality using the Gemini 2.5 Flash model
- **[FlagCDN](https://flagcdn.com/)** - Provides scalable flag images for language selection
- **System Font Stack** - Uses native OS fonts (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, etc.) for optimal performance

## 📁 Project Structure

```
live-transcribe-translate/
├── server.js                    # Node.js backend with ElevenLabs token generation + Gemini translation
├── package.json                 # Dependencies and scripts
├── public/index.html            # Frontend interface with ElevenLabs SDK integration
├── env-example.txt              # Environment variables template
└── SETUP.md                     # Setup instructions
```

The application uses a modern client-server architecture:
- **Client**: Uses ElevenLabs JavaScript SDK for direct WebSocket connection to Scribe v2 Realtime
- **Server**: Generates single-use tokens for ElevenLabs API and handles translation requests via Google Gemini

## 🌍 Supported Languages

The application supports real-time transcription and translation for:

- **Input Languages**: Dutch, English, German, French, Spanish, Italian, Portuguese (with automatic language detection for 90+ languages)
- **Output Languages**: English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Arabic

ElevenLabs Scribe v2 Realtime provides optimal accuracy for English, French, German, Italian, Spanish, and Portuguese, with support for 90 additional languages.

## ⚙️ Technical Requirements

- Node.js (v16 or higher)
- Modern web browser with microphone support and ES6 module support
- ElevenLabs API key ([Get your key here](https://elevenlabs.io/app/settings/api-keys))
- Google Gemini API key (free tier available at [Google AI Studio](https://makersuite.google.com/app/apikey))
- Internet connection for speech recognition and translation services

## 🌐 Browser Compatibility

The application works in all modern browsers that support:

- ES6 Modules
- WebSocket connections
- Microphone access (getUserMedia API)
- AudioContext API
- Basic HTML5 and CSS3 features

This includes all major browsers: Chrome, Firefox, Safari, Edge (version 79+), and their mobile versions. 