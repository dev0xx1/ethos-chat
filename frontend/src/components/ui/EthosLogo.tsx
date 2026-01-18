import { cn } from '@/lib/utils'

interface EthosLogoProps {
  size?: number
  className?: string
}

export function EthosLogo({ size = 40, className }: EthosLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {/* Three horizontal lines forming an E */}
      <rect x="8" y="8" width="24" height="4" rx="2" fill="#b5b5a5" />
      <rect x="8" y="18" width="18" height="4" rx="2" fill="#d4d4c4" />
      <rect x="8" y="28" width="24" height="4" rx="2" fill="#b5b5a5" />
    </svg>
  )
}

export function EthosLogoLarge({ size = 120, className }: EthosLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {/* Three horizontal lines forming an E - larger version */}
      <rect x="24" y="30" width="72" height="12" rx="6" fill="#b5b5a5" />
      <rect x="24" y="54" width="54" height="12" rx="6" fill="#d4d4c4" />
      <rect x="24" y="78" width="72" height="12" rx="6" fill="#b5b5a5" />
    </svg>
  )
}
