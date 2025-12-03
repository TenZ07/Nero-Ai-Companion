# Nero.AI Companion

<div align="center">

![Nero.AI Banner](https://img.shields.io/badge/Nero.AI-Companion-b8fb3c?style=for-the-badge&logo=ai&logoColor=03045e)

**Your AI co-pilot powered by Google Gemini**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20API-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

## Features

- Stunning Glassmorphic UI with modern design and neon accents
- Real-time AI Chat powered by Google's Gemini AI model
- Multiple AI Behaviors: Explainer, Brief, JSON API, Sarcastic Humor
- Interrupt Support to stop AI responses mid-generation
- Responsive Design optimized for desktop, tablet, and mobile
- Quick Prompts with pre-configured suggestions
- Smooth Scrolling with auto-scroll and custom scrollbars
- Lightning Fast performance built with Vite

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Google AI Studio API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/TenZ07/chatbot.git
   cd chatbot
   ```

2. Install server dependencies

   ```bash
   cd server
   npm install
   ```

3. Install client dependencies

   ```bash
   cd ../client
   npm install
   ```

### Configuration

**IMPORTANT:** You must configure your Google AI Studio API key before running the application.

1. Navigate to the server directory

   ```bash
   cd server
   ```

2. Create a `.env` file in the `server` folder

   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env

   # Linux/Mac
   cp .env.example .env
   ```

3. Add your Google AI Studio API key to the `.env` file:

   ```env
   GOOGLE_API_KEY=your_google_ai_studio_api_key_here
   GOOGLE_MODEL=gemini-2.5-pro || gemini-2.5-flash || gemini-2.5-flash-lite
   PORT=5000
   ```

   How to get your API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy and paste the key into your `.env` file

## Usage

### Running the Application

You need to run both the server and client simultaneously.

#### Terminal 1: Start the Backend Server

```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

#### Terminal 2: Start the Frontend Client

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### Using Nero.AI

1. Open your browser and navigate to `http://localhost:5173`
2. You'll see a welcome message from Nero
3. Type your question in the input field at the bottom
4. Press Enter or click the send button
5. Watch Nero respond with AI-generated answers
6. Click the stop button anytime to interrupt a response

## Project Structure

```
chatbot/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── lib/           # API utilities
│   │   │   └── api.js
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Styling
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js server
│   ├── src/
│   │   └── index.js       # Express server & Gemini API
│   ├── .env               # Environment variables (create this!)
│   └── package.json
│
└── README.md
```

## Tech Stack

### Frontend
- React 18.3.1
- Vite 5.4.11
- CSS3 with custom animations

### Backend
- Node.js
- Express
- Google Generative AI (Gemini API)
- CORS
- dotenv

## Customization

### Changing the Theme

Edit `client/src/App.css` to customize colors:

```css
/* Primary accent color */
--accent: #b8fb3c;

/* Background colors */
--bg-primary: #03045e;
--bg-secondary: #05071d;
```

### Modifying Prompts

Edit the `PROMPTS` array in `client/src/App.jsx`:

```javascript
const PROMPTS = [
  "Your custom prompt 1",
  "Your custom prompt 2",
];
```

### Changing AI Model

Modify the `GOOGLE_MODEL` in `server/.env`:

```env
GOOGLE_MODEL=gemini-2.5-pro  # or gemini-2.5-flash, gemini-2.5-flash-lite
```

## Troubleshooting

### Server won't start

- Ensure you've created the `.env` file in the `server` folder
- Verify your `GOOGLE_API_KEY` is valid
- Check if port 5000 is available

### Client won't connect

- Make sure the server is running first
- Check that `VITE_API_BASE_URL` matches your server URL
- Verify both services are running on different terminals

### API errors

- Confirm your Google AI Studio API key is active
- Check your API quota hasn't been exceeded
- Ensure you have internet connection

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

**TenZ07**

- GitHub: [@TenZ07](https://github.com/TenZ07)

## Show your support

Give a star if this project helped you!

<div align="center">

**Built with React, Node.js, and Google Gemini AI**

</div>
