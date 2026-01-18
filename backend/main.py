import os
import json
import uuid
import time
from typing import Dict, Set
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("⚠️  Supabase credentials not configured")


# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        # room_id -> set of websockets
        self.rooms: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(websocket)
        print(f"Client connected to room: {room_id}")

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.rooms:
            self.rooms[room_id].discard(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]
        print(f"Client disconnected from room: {room_id}")

    async def broadcast_to_room(self, room_id: str, message: dict):
        if room_id in self.rooms:
            disconnected = []
            for ws in self.rooms[room_id]:
                try:
                    await ws.send_json(message)
                except Exception:
                    disconnected.append(ws)
            # Clean up disconnected clients
            for ws in disconnected:
                self.rooms[room_id].discard(ws)


manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 EthosChat API starting...")
    yield
    print("👋 EthosChat API shutting down...")


app = FastAPI(title="EthosChat API", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Models
class MessageCreate(BaseModel):
    userId: str
    username: str
    text: str


class MessageResponse(BaseModel):
    id: str
    roomId: str
    userId: str
    username: str
    text: str
    timestamp: int


# Routes
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "timestamp": int(time.time() * 1000)}


@app.get("/api/rooms/{room_id}/messages")
async def get_messages(room_id: str, limit: int = 100):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    
    try:
        response = supabase.table("messages") \
            .select("*") \
            .eq("room_id", room_id) \
            .order("timestamp", desc=False) \
            .limit(limit) \
            .execute()
        
        messages = [
            MessageResponse(
                id=m["id"],
                roomId=m["room_id"],
                userId=m["user_id"],
                username=m["username"],
                text=m["text"],
                timestamp=m["timestamp"]
            )
            for m in response.data
        ]
        return messages
    except Exception as e:
        print(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages")


@app.post("/api/rooms/{room_id}/messages", response_model=MessageResponse)
async def post_message(room_id: str, message: MessageCreate):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    
    try:
        msg_id = f"{int(time.time() * 1000)}-{uuid.uuid4().hex[:7]}"
        timestamp = int(time.time() * 1000)
        
        data = {
            "id": msg_id,
            "room_id": room_id,
            "user_id": message.userId,
            "username": message.username,
            "text": message.text.strip(),
            "timestamp": timestamp,
        }
        
        response = supabase.table("messages").insert(data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save message")
        
        saved = response.data[0]
        result = MessageResponse(
            id=saved["id"],
            roomId=saved["room_id"],
            userId=saved["user_id"],
            username=saved["username"],
            text=saved["text"],
            timestamp=saved["timestamp"]
        )
        
        # Broadcast to WebSocket clients in the room
        await manager.broadcast_to_room(room_id, result.model_dump())
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error posting message: {e}")
        raise HTTPException(status_code=500, detail="Failed to post message")


@app.websocket("/socket.io/{path:path}")
async def socket_io_handler(websocket: WebSocket, path: str = ""):
    await websocket.close(code=1000)


@app.get("/socket.io/{path:path}")
async def socket_io_http_handler(path: str = ""):
    return {"status": "not_supported"}


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received from client in {room_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, room_id)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
