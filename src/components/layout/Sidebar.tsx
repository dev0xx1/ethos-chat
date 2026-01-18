import { IconLock, IconCircleCheck, IconUsers, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setActiveRoom } from '@/store/slices/chatSlice'
import { setMobileMenuOpen } from '@/store/slices/uiSlice'
import { CHAT_ROOMS, canAccessRoom } from '@/constants/chatRooms'
import type { ChatRoom } from '@/types'
import { EthosLogo } from '@/components/ui/EthosLogo'

interface RoomButtonProps {
  room: ChatRoom
  isActive: boolean
  isAccessible: boolean
  onClick: () => void
}

function RoomButton({ room, isActive, isAccessible, onClick }: RoomButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isAccessible}
      className={cn(
        'w-full text-left p-4 transition-all duration-200 border group',
        isActive
          ? 'border-brand bg-brand-muted'
          : isAccessible
          ? 'border-transparent hover:border-border hover:bg-card/50'
          : 'border-border-muted bg-card/10 opacity-40 cursor-not-allowed'
      )}
      style={isAccessible && !isActive ? { 
        backgroundColor: `color-mix(in srgb, ${room.color} 8%, transparent)`,
        borderColor: `color-mix(in srgb, ${room.color} 25%, transparent)`
      } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{room.emoji}</span>
          <span 
            className="font-medium text-sm tracking-wide"
            style={isAccessible ? { color: room.color } : undefined}
          >
            {room.name}
          </span>
        </div>
        {isAccessible ? (
          <IconCircleCheck 
            size={16} 
            style={{ color: room.color }} 
          />
        ) : (
          <IconLock size={16} className="text-muted" />
        )}
      </div>
      <div className="text-xs text-muted font-mono">
        {room.minScore} - {room.maxScore}
      </div>
    </button>
  )
}

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { activeRoomId } = useAppSelector((state) => state.chat)
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui)

  const userScore = user?.ethosScore ?? 0

  const handleRoomClick = (room: ChatRoom) => {
    if (canAccessRoom(userScore, room)) {
      dispatch(setActiveRoom(room.id))
      dispatch(setMobileMenuOpen(false))
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setMobileMenuOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-80',
          'flex flex-col border-r border-border bg-background',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile header */}
        <div className="lg:hidden h-16 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <EthosLogo size={36} />
            <span className="text-lg font-light tracking-[0.15em]">CHAT</span>
          </div>
          <button
            onClick={() => dispatch(setMobileMenuOpen(false))}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-card rounded transition-colors"
            aria-label="Close menu"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 lg:p-5 space-y-2">
          <div className="flex items-center gap-2 mb-5 px-1">
            <IconUsers size={14} className="text-muted" />
            <h2 className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium">
              Chat Rooms
            </h2>
          </div>

          {CHAT_ROOMS.map((room) => (
            <RoomButton
              key={room.id}
              room={room}
              isActive={activeRoomId === room.id}
              isAccessible={canAccessRoom(userScore, room)}
              onClick={() => handleRoomClick(room)}
            />
          ))}
        </div>
      </aside>
    </>
  )
}
