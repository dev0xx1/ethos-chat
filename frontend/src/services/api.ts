import type { Message } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function fetchMessages(roomId: string, limit = 100): Promise<Message[]> {
  try {
    const response = await fetch(`${API_URL}/api/rooms/${roomId}/messages?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

export async function sendMessage(
  roomId: string,
  userId: string,
  username: string,
  text: string
): Promise<Message | null> {
  try {
    const response = await fetch(`${API_URL}/api/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, username, text }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to send message')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error sending message:', error)
    return null
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`)
    return response.ok
  } catch {
    return false
  }
}
