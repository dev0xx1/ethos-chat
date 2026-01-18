# EthosChat

A credibility-gated chat application powered by [Ethos Network](https://ethos.network). Users are placed into chat rooms based on their on-chain credibility score.

## Features

- **Credibility-Gated Rooms**: Access chat rooms based on your Ethos credibility score (0-2800)
- **Twitter/X Authentication**: Secure login via Privy with Twitter OAuth
- **Real-time Messaging**: WebSocket-powered live chat with automatic reconnection
- **Persistent Storage**: Messages stored in Supabase with PostgreSQL
- **Modern UI**: Dark theme with smooth animations and responsive design

## Chat Room Tiers

Based on [Ethos Network's credibility score system](https://whitepaper.ethos.network/ethos-mechanisms/credibility-score):

| Room | Score Range | Description |
|------|-------------|-------------|
| ⚠️ Untrusted | 0-799 | New or flagged accounts. Build your reputation to unlock more rooms. |
| 🔄 Neutral | 800-1199 | Baseline credibility. Most new verified users start here. |
| ✓ Established | 1200-1599 | Verified contributors with a track record of positive interactions. |
| ⭐ Reputable | 1600-1999 | Highly trusted members recognized for consistent credibility. |
| 💎 Exemplary | 2000-2800 | Top-tier credibility. The most trusted voices in the ecosystem. |

## Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS v4** - Styling
- **Privy** - Authentication
- **Tabler Icons** - Icon library

### Backend
- **FastAPI** - Python web framework
- **WebSockets** - Real-time communication
- **Supabase** - PostgreSQL database
- **Uvicorn** - ASGI server

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/        # ChatArea, MessageBubble
│   │   │   ├── layout/      # Header, Sidebar
│   │   │   ├── pages/       # ChatPage, LoginPage
│   │   │   └── ui/          # Button, Card, Input, Badge
│   │   ├── constants/       # Chat rooms configuration
│   │   ├── lib/             # Utility functions
│   │   ├── services/        # API, WebSocket, Ethos clients
│   │   ├── store/           # Redux store and slices
│   │   └── types/           # TypeScript definitions
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Container configuration
└── supabase-schema.sql      # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12+
- Supabase account

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8080
```

**Backend** (`backend/.env`):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=8080
```

### Database Setup

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor to create the messages table.

## Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel deploy --prod
```

### Backend (Docker)

```bash
cd backend
docker build -t ethoschat-api .
docker run -p 8080:8080 --env-file .env ethoschat-api
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/rooms/{room_id}/messages` | Fetch room messages |
| POST | `/api/rooms/{room_id}/messages` | Send a message |
| WS | `/ws/{room_id}` | WebSocket connection for real-time updates |

## License

MIT
