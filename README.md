# AI Chatbot

A modern AI chatbot built with FastAPI backend and React frontend, powered by Groq's LLM API.

## Features

- 🤖 Real-time AI chat interface
- 💬 Conversation history management
- ⚡ Fast API responses with Groq LLM
- 🔄 Session management with conversation IDs

## Tech Stack

- **Backend**: FastAPI, Groq API, Python
- **Frontend**: React, Vite, Tailwind CSS

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Groq API key

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:

```
GROQ_API_KEY=your_groq_api_key_here
```

Run the backend:

```bash
python app.py
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend/chatbotui
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `POST /chat/` - Send a message and get AI response
  - Body: `{"message": "Hello", "conversation_id": "123", "role": "user"}`

## Getting Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up/Login
3. Create an API key
4. Add it to your `.env` file

## Project Structure

```
├── backend/          # FastAPI backend
│   ├── app.py       # Main API server
│   └── requirements.txt
└── frontend/
    └── chatbotui/   # React frontend
        ├── src/
        │   └── App.jsx
        └── package.json
```

## Local Development

1. Start backend: `cd backend && python app.py`
2. Start frontend: `cd frontend/chatbotui && npm run dev`
3. Open http://localhost:3000

## Note

The UI design will be improved in future updates. This is a functional prototype with basic styling.


