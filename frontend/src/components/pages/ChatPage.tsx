import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ChatArea } from '@/components/chat/ChatArea'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setActiveRoom } from '@/store/slices/chatSlice'
import { getRoomForScore } from '@/constants/chatRooms'

export function ChatPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { activeRoomId } = useAppSelector((state) => state.chat)

  // Auto-select user's room on first load
  useEffect(() => {
    if (user && !activeRoomId) {
      const userRoom = getRoomForScore(user.ethosScore)
      if (userRoom) {
        dispatch(setActiveRoom(userRoom.id))
      }
    }
  }, [user, activeRoomId, dispatch])

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 flex min-h-0">
          <ChatArea />
        </main>
      </div>
    </div>
  )
}
