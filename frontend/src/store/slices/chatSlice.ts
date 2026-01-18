import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Message } from '@/types'

interface ChatState {
  activeRoomId: string | null
  messages: Record<string, Message[]>
  isLoadingMessages: boolean
  sendingMessage: boolean
  error: string | null
}

const initialState: ChatState = {
  activeRoomId: null,
  messages: {},
  isLoadingMessages: false,
  sendingMessage: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveRoom: (state, action: PayloadAction<string | null>) => {
      state.activeRoomId = action.payload
    },
    setMessages: (state, action: PayloadAction<{ roomId: string; messages: Message[] }>) => {
      state.messages[action.payload.roomId] = action.payload.messages
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { roomId } = action.payload
      if (!state.messages[roomId]) {
        state.messages[roomId] = []
      }
      // Check if message already exists to avoid duplicates
      const exists = state.messages[roomId].some(m => m.id === action.payload.id)
      if (!exists) {
        state.messages[roomId].push(action.payload)
      }
    },
    setLoadingMessages: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMessages = action.payload
    },
    setSendingMessage: (state, action: PayloadAction<boolean>) => {
      state.sendingMessage = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      state.messages[action.payload] = []
    },
    clearAllMessages: (state) => {
      state.messages = {}
      state.activeRoomId = null
    },
  },
})

export const {
  setActiveRoom,
  setMessages,
  addMessage,
  setLoadingMessages,
  setSendingMessage,
  setError,
  clearMessages,
  clearAllMessages,
} = chatSlice.actions

export default chatSlice.reducer
