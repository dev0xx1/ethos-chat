import { useState, useRef, useEffect, useCallback } from 'react'
import { IconSend, IconMessageCircle } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addMessage, setMessages } from '@/store/slices/chatSlice'
import { CHAT_ROOMS, getRoomForScore } from '@/constants/chatRooms'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MessageBubble } from './MessageBubble'
import { fetchMessages, sendMessage } from '@/services/api'
import { socketService } from '@/services/socket'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

export function ChatArea() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { activeRoomId, messages } = useAppSelector((state) => state.chat)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeRoom = CHAT_ROOMS.find((r) => r.id === activeRoomId)
  const roomMessages = activeRoomId ? messages[activeRoomId] || [] : []
  const userRoom = user ? getRoomForScore(user.ethosScore) : null

  // Connect to socket on mount
  useEffect(() => {
    socketService.connect()
    return () => {
      socketService.disconnect()
    }
  }, [])

  // Handle incoming messages via socket
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (message.roomId === activeRoomId) {
        dispatch(addMessage(message))
      }
    }

    socketService.onNewMessage(handleNewMessage)
    return () => {
      socketService.offNewMessage(handleNewMessage)
    }
  }, [activeRoomId, dispatch])

  // Load messages and join room when room changes
  useEffect(() => {
    if (!activeRoomId) return

    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const messages = await fetchMessages(activeRoomId)
        dispatch(setMessages({ roomId: activeRoomId, messages }))
      } catch (error) {
        console.error('Failed to load messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
    socketService.joinRoom(activeRoomId)
  }, [activeRoomId, dispatch])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [roomMessages])

  // Focus input on room change
  useEffect(() => {
    if (activeRoomId) {
      inputRef.current?.focus()
    }
  }, [activeRoomId])

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeRoomId || !user || isSending) return

    setIsSending(true)
    const text = newMessage.trim()
    setNewMessage('')

    try {
      const message = await sendMessage(activeRoomId, user.id, user.username, text)
      if (!message) {
        // If send failed, restore the message
        setNewMessage(text)
      }
      // Note: message will be added via socket event
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(text)
    } finally {
      setIsSending(false)
    }
  }, [newMessage, activeRoomId, user, isSending])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Empty state when no room selected
  if (!activeRoomId || !activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md px-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-card border border-border flex items-center justify-center">
            <IconMessageCircle size={36} className="text-muted" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-muted-foreground">
              Select a room to start
            </h2>
            {userRoom && (
              <p className="text-muted text-sm font-mono">
                Access granted to:{' '}
                <span style={{ color: userRoom.color }}>{userRoom.name}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-0">
      {/* Room header */}
      <div className="flex-shrink-0 border-b border-border px-4 lg:px-6 py-4 bg-card/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{activeRoom.emoji}</span>
          <div>
            <h3 className="font-medium text-lg">{activeRoom.name}</h3>
            <p className="text-xs text-muted font-mono">
              {roomMessages.length} message{roomMessages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 min-h-0">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-muted text-sm font-mono animate-pulse">
              Loading messages...
            </div>
          </div>
        ) : roomMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted py-12 font-mono text-sm animate-fade-in">
              <p>No messages yet.</p>
              <p className="mt-1">Start the conversation.</p>
            </div>
          </div>
        ) : (
          roomMessages.map((msg, index) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={msg.username === user?.username}
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="flex-shrink-0 border-t border-border p-4 bg-background">
        <div className="flex gap-3">
          <Input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isSending}
            className={cn(
              'flex-1',
              isSending && 'opacity-50'
            )}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="px-5"
          >
            <IconSend size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
