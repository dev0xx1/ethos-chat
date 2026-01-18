import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium border',
        {
          'bg-card border-border text-muted-foreground': variant === 'default',
          'bg-brand-muted border-brand/30 text-brand': variant === 'brand',
          'bg-success/10 border-success/30 text-success': variant === 'success',
          'bg-warning/10 border-warning/30 text-warning': variant === 'warning',
          'bg-error/10 border-error/30 text-error': variant === 'error',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
