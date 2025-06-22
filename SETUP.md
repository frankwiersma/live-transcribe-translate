# 🚀 Quick Setup Guide - Deepgram Edition

## Prerequisites
- Node.js (v16 or higher)
- Deepgram API key (free tier available)
- Google Gemini API key (free tier available)

## 1. Get API Keys

### Deepgram API Key
1. Go to [console.deepgram.com](https://console.deepgram.com/)
2. Sign up for a free account
3. Create a new project
4. Copy your API key (starts with a long string)

### Google Gemini API Key  
1. Go to [makersuite.google.com](https://makersuite.google.com/app/apikey)
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
DG_KEY=your_deepgram_api_key_here
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
5. Speak and see real-time transcription/translation!

## Troubleshooting

### "DG_KEY is not set" error
- Make sure your `.env` file exists and has the correct API key
- Restart the server after editing `.env`

### "Connection error" in browser
- Check if the server is running on port 3000
- Check browser console for WebSocket errors

### "Microphone access denied"
- Allow microphone permissions in your browser
- Some browsers require HTTPS for microphone access in production

### No transcription appearing
- Check that your Deepgram API key is valid
- Verify you have credits remaining (free tier includes $200)
- Check server logs for error messages

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
  "deepgram": true,
  "gemini": true
}
```

## Next Steps
- Set up SSL/HTTPS for production use
- Consider using PM2 or Docker for deployment
- Add monitoring and logging for production environments 