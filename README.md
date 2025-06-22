# 🎤 Live Transcribe & Translate

A real-time speech transcription and translation system that captures speech and displays live captions with optional translation to multiple languages. Built for conferences, meetings, presentations, and public speaking events.

## 📖 Description

This web application listens to speech through the microphone, displays live captions, and can translate them to 11 different languages in real-time. The interface features large, readable text optimized for projection or display screens, with a clean dark theme and intuitive language selection through flag buttons.

The application processes speech continuously, applying intelligent punctuation and capitalization rules, and maintains a translation cache to improve performance during repeated phrases.

## ⚡ Key Techniques & Technologies

The codebase demonstrates several modern web development techniques:

- **[Deepgram Speech Recognition API](https://developers.deepgram.com/)** - Professional speech-to-text with real-time streaming and high accuracy
- **[CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)** - Consistent theming with CSS variables in `:root`
- **[Flexbox Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)** - Responsive interface layout and component alignment
- **[Local Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)** - Persistent storage of API keys across sessions
- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)** - HTTP requests to translation services with proper error handling
- **[CSS Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)** - Blur effect behind modal dialogs
- **[Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)** - Handles microphone management when tab becomes hidden/visible
- **[CSS Transforms & Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)** - Smooth animations for UI interactions
- **Async/Await Pattern** - Clean asynchronous code for API calls and speech recognition
- **Debouncing with setTimeout** - Prevents excessive API calls during continuous speech
- **Map-based Caching** - Translation cache with size limits to improve performance

## 🔗 External Services & Libraries

- **[Google Gemini API](https://ai.google.dev/)** - Powers the real-time translation functionality using the Gemini 2.5 Flash model
- **[FlagCDN](https://flagcdn.com/)** - Provides scalable flag images for language selection
- **System Font Stack** - Uses native OS fonts (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, etc.) for optimal performance

## 📁 Project Structure

```
live-transcribe-translate/
├── server.js                    # Node.js backend with Deepgram + Gemini
├── package.json                 # Dependencies and scripts
├── public/index.html            # Frontend interface
├── env-example.txt              # Environment variables template
└── SETUP.md                     # Setup instructions
```

The application uses a modern client-server architecture with a Node.js backend handling speech recognition and translation, and a clean frontend for user interaction.

## 🌍 Supported Languages

The application supports translation between multiple languages including:

- English (British)
- German (Deutsch)
- French (Français)
- Spanish (Español)
- Polish (Polski)
- Italian (Italiano)
- Turkish (Türkçe)
- Arabic (العربية)
- Chinese (中文)
- Russian (Русский)
- Portuguese (Português)

## ⚙️ Technical Requirements

- Node.js (v16 or higher)
- Modern web browser with microphone support
- Deepgram API key (free tier available)
- Google Gemini API key (free tier available)
- Internet connection for speech recognition and translation services

## 🌐 Browser Compatibility

The application works in all modern browsers that support:

- WebSocket connections
- Microphone access (getUserMedia API)
- Basic HTML5 and CSS3 features

This includes all major browsers: Chrome, Firefox, Safari, Edge, and their mobile versions. 