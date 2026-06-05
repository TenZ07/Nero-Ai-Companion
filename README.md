# Nero.AI Companion

<div align="center">

![Nero.AI Banner](https://img.shields.io/badge/Nero.AI-Companion-b8fb3c?style=for-the-badge&logo=ai&logoColor=03045e)

**An AI co-pilot powered by Google Gemini and OpenRouter**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20API-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API-FF6B6B?style=flat-square)](https://openrouter.ai/)

</div>

## Features

- Glassmorphic, modern UI with neon accents and refined visual hierarchy.
- Real-time AI chat with integrated Google Gemini and OpenRouter backends.
- Multi-model support (e.g., Gemini 2.5 Flash, Gemini 2.5 Flash lite, Qwen3 Coder, Nemotron Nano).
- Configurable AI behaviors: Explainer, Brief, Sarcastic Humor.
- Interruptible responses to stop generation mid-stream.
- Fully responsive design optimized for desktop, tablet, and mobile.
- Quick prompts with curated, pre-configured suggestions.

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Google AI Studio API Key ([Get it here](https://makersuite.google.com/app/apikey))
- OpenRouter API Key (Optional - [Get it here](https://openrouter.ai/keys))

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/TenZ07/Nero-Ai-Companion.git
   ```

2. Install server dependencies

   ```bash
   # Nero.AI Companion

   Nero.AI Companion is a lightweight, open-source chat application that connects a React + Vite frontend to a Node.js backend which can use Google Gemini (via Google Generative AI) and OpenRouter models. It is designed for fast local development and experimentation with multiple model endpoints and conversation behaviors.

   Repository layout:
   - `client/` — React + Vite frontend
   - `server/` — Express backend and API wrapper for model calls

   Live demo: run locally.

   Requirements
   - Node.js v16+ and npm (or yarn)
   - A Google AI Studio API key
   - An OpenRouter API key
    ```
### Quickstart — run locally

1) Install dependencies

   ```bash
   # from repository root
   cd server
   npm install

   cd ../client
   npm install
   ```

2) Configure environment for the server

   Create `server/.env` (example keys shown):

   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   GOOGLE_MODEL=gemini-2.5-flash
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   PORT=5000(default)
   ```

   Notes:
   - If you do not provide `GOOGLE_API_KEY`, the server will still attempt to use OpenRouter models when a model identifier contains `/` or known OpenRouter model names.

3) Start the backend and frontend (two terminals)

   ```bash
   # Terminal 1 — server
   cd server
   npm run dev

   # Terminal 2 — client
   cd client
   npm run dev
   ```
   ## Configuration & behavior

   - Frontend model options and labels are defined in `client/src/App.jsx`.
   - Server behavior presets are in `server/src/index.js` under the `BEHAVIOURS` constant; these control system messages and generation config.
   - The server exposes a `/health` endpoint which returns `{ status: 'ok', model: <MODEL_NAME> }` (defaults to `GOOGLE_MODEL` from `.env`).

   ## Project structure

   - `client/` — React application
     - `src/` — app sources; main component: `client/src/App.jsx`
     - `src/lib/api.js` — client

   - `server/` — Express server
     - `src/index.js` — main server file and model-bridge logic
     - `.env` — runtime configuration (not committed)

   ## Development notes

   - The client uses Vite for fast HMR and dev server.
   - The server uses `nodemon` in `npm run dev` for automatic reloads.
   - Error handling in the client sets user-facing `status` and `error` strings; model IDs are reported by the server as the `model` field on chat responses.

   ## Troubleshooting

   - If the server logs `Missing GOOGLE_API_KEY` or `Missing OPENROUTER_API_KEY`, add the respective key to `server/.env`.
   - If the client shows `Offline` in the status bar, verify the server is running and reachable at the address configured in `client/src/lib/api.js`.
   - Check console log messages for error details.

   ## Contributing

   PRs and issues are welcome. Suggested workflow:

   1. Fork the repository
   2. Create a feature branch
   3. Open a concise PR describing the change

   Please include tests or manual verification steps for non-trivial features.

   ## License

   This project is provided under the MIT License.

   <hr>

    Author: TenZ07 — https://github.com/TenZ07

   ---
    
    ><p align="center">Peace ;)</p>

