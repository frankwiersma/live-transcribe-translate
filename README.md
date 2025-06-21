# 🎤 Live Transcribe & Translate

A real-time speech transcription and translation system that captures Dutch speech and displays live captions with optional translation to multiple languages. Built for church services and public speaking events.

## 📖 Description

This web application listens to Dutch speech through the microphone, displays live captions, and can translate them to 11 different languages in real-time. The interface features large, readable text optimized for projection or display screens, with a clean dark theme and intuitive language selection through flag buttons.

The application processes speech continuously, applying intelligent punctuation and capitalization rules for religious content, and maintains a translation cache to improve performance during repeated phrases.

## ⚡ Key Techniques & Technologies

The codebase demonstrates several modern web development techniques:

- **[Web Speech Recognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)** - Captures live audio and converts speech to text with continuous listening and interim results
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
├── church-caption.html          # Complete single-file application
```

The entire application is contained in a single HTML file with embedded CSS and JavaScript, making it easy to deploy and distribute. The [church-caption.html](./church-caption.html) file includes all styling, logic, and UI components needed for the transcription and translation functionality.

## 🌍 Supported Languages

The application supports translation from Dutch to:

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

- Modern web browser with Web Speech Recognition support (Chrome, Edge)
- Microphone access permissions
- Valid Google Gemini API key for translation functionality
- Internet connection for translation services and flag images

## 🌐 Browser Compatibility

The application requires browsers that support the Web Speech Recognition API. This includes:

- Google Chrome (desktop and mobile)
- Microsoft Edge
- Safari (limited support)

Firefox currently does not support the Web Speech Recognition API. 