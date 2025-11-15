# 🚀 Quick Setup Guide - ElevenLabs Scribe v2 Realtime

## Prerequisites
- Node.js (v16 or higher)
- ElevenLabs API key ([Sign up here](https://elevenlabs.io/))
- Google Gemini API key (free tier available)

## 1. Get API Keys

### ElevenLabs API Key
1. Go to [elevenlabs.io](https://elevenlabs.io/)
2. Sign up for an account
3. Navigate to [Settings > API Keys](https://elevenlabs.io/app/settings/api-keys)
4. Create a new API key
5. Copy your API key (starts with "sk_...")

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign up with your Google account
3. Create a new API key
4. Copy your API key (starts with "AIza...")

## 2. Installation

```bash
# Clone or download the project
# Navigate to project directory

# Install dependencies
npm install

# Create environment file
cp env-example.txt .env
```

## 3. Configuration

Edit the `.env` file:
```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

## 4. Run

```bash
# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

## 5. Test

1. Open your browser and go to `http://localhost:3000`
2. Allow microphone permissions when prompted
3. Select your input and output languages
4. Click "Start Listening"
5. Speak and see real-time transcription/translation with ultra-low latency!

## Troubleshooting

### "ELEVENLABS_API_KEY not configured" error
- Make sure your `.env` file exists and has the correct API key
- Restart the server after editing `.env`
- Verify your API key is valid and starts with "sk_"

### "Connection error" in browser
- Check if the server is running on port 3000
- Check browser console for WebSocket errors
- Ensure your browser supports ES6 modules

### "Microphone access denied"
- Allow microphone permissions in your browser
- Some browsers require HTTPS for microphone access in production
- Try using Chrome or Edge for best compatibility

### No transcription appearing
- Check that your ElevenLabs API key is valid
- Verify you have credits remaining in your ElevenLabs account
- Check browser console for errors
- Check server logs for error messages

### "Failed to get token" error
- Verify your ElevenLabs API key is correct
- Check that you have sufficient credits
- Ensure the API key has permissions for Scribe v2 Realtime

## Quick Test
To verify everything is working:

```bash
# Test the API keys
curl -X POST http://localhost:3000/api/test-keys
```

Should return:
```json
{
  "success": true,
  "elevenlabs": true,
  "gemini": true
}
```

## Features

### Ultra-Low Latency
ElevenLabs Scribe v2 Realtime provides transcription in under 150ms, making it perfect for real-time applications.

### Voice Activity Detection (VAD)
The application uses automatic speech segmentation based on silence detection:
- **VAD Silence Threshold**: 1.5 seconds of silence before committing a transcript
- **VAD Threshold**: 0.4 (moderate sensitivity)
- **Min Speech Duration**: 100ms
- **Min Silence Duration**: 100ms

### Supported Languages
- **Primary Languages** (optimized accuracy): English, French, German, Italian, Spanish, Portuguese
- **Additional Languages**: 90+ languages with automatic language detection

### Audio Quality
- **Sample Rate**: 16kHz PCM
- **Channels**: Mono (1 channel)
- **Features**: Echo cancellation, noise suppression, auto gain control

## Next Steps
- Set up SSL/HTTPS for production use
- Consider using PM2 or Docker for deployment
- Add monitoring and logging for production environments
- Configure custom VAD parameters based on your use case
- Explore additional ElevenLabs features like timestamps and word-level data 