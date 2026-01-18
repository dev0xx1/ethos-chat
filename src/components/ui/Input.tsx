import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full bg-card border border-border px-4 py-3 text-sm text-foreground',
          'placeholder:text-muted font-mono',
          'focus:outline-none focus:border-brand transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-error focus:border-error',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
