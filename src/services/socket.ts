import type { Message } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
// Convert http(s) to ws(s)
const WS_URL = API_URL.replace(/^http/, 'ws')

class SocketService {
  private socket: WebSocket | null = null
  private currentRoom: string | null = null
  private messageCallback: ((message: Message) => void) | null = null
  private reconnectTimeout: number | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect() {
    // Will connect when joining a room
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      this.currentRoom = null
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  joinRoom(roomId: string) {
    // If already in this room, don't reconnect
    if (this.currentRoom === roomId && this.socket?.readyState === WebSocket.OPEN) {
      return
    }

    // Disconnect from previous room
    if (this.socket) {
      this.socket.close()
    }

    this.currentRoom = roomId
    this.reconnectAttempts = 0
    this.connectToRoom(roomId)
  }

  private connectToRoom(roomId: string) {
    try {
      const wsUrl = `${WS_URL}/ws/${roomId}`
      console.log(`🔌 Connecting to WebSocket: ${wsUrl}`)
      
      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        console.log(`🔌 WebSocket connected to room: ${roomId}`)
        this.reconnectAttempts = 0
      }

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as Message
          if (this.messageCallback) {
            this.messageCallback(message)
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      }

      this.socket.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        this.attemptReconnect(roomId)
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.attemptReconnect(roomId)
    }
  }

  private attemptReconnect(roomId: string) {
    if (this.currentRoom !== roomId) return
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`)
    
    this.reconnectTimeout = window.setTimeout(() => {
      if (this.currentRoom === roomId) {
        this.connectToRoom(roomId)
      }
    }, delay)
  }

  leaveRoom(roomId: string) {
    if (this.currentRoom === roomId) {
      this.disconnect()
    }
  }

  onNewMessage(callback: (message: Message) => void) {
    this.messageCallback = callback
  }

  offNewMessage(_callback: (message: Message) => void) {
    this.messageCallback = null
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }
}

export const socketService = new SocketService()
