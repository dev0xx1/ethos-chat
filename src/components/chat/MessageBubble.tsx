import { cn, formatTimestamp } from '@/lib/utils'
import type { Message } from '@/types'
import type { CSSProperties } from 'react'

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
  style?: CSSProperties
}

export function MessageBubble({ message, isOwnMessage, style }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex message-enter',
        isOwnMessage ? 'justify-end' : 'justify-start'
      )}
      style={style}
    >
      <div className={cn('max-w-[85%] lg:max-w-md space-y-1.5', isOwnMessage && 'items-end')}>
        <div
          className={cn(
            'flex items-center gap-2 px-1',
            isOwnMessage ? 'justify-end' : 'justify-start'
          )}
        >
          <span className="text-xs text-muted font-mono">@{message.username}</span>
          <span className="text-[10px] text-muted/60 font-mono">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div
          className={cn(
            'px-4 py-3 border text-sm leading-relaxed break-words',
            isOwnMessage
              ? 'bg-brand-muted border-brand/30 text-foreground'
              : 'bg-card border-border text-foreground'
          )}
        >
          {message.text}
        </div>
      </div>
    </div>
  )
}
