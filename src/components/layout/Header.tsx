import { IconLogout, IconMenu2 } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { clearAllMessages } from '@/store/slices/chatSlice'
import { toggleMobileMenu } from '@/store/slices/uiSlice'
import { usePrivy } from '@privy-io/react-auth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getScoreColor } from '@/lib/utils'
import { EthosLogo } from '@/components/ui/EthosLogo'

export function Header() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { logout: privyLogout } = usePrivy()

  const handleLogout = async () => {
    try {
      await privyLogout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    dispatch(logout())
    dispatch(clearAllMessages())
  }

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            <IconMenu2 size={20} />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <EthosLogo size={36} />
            <span className="text-lg font-light tracking-[0.15em] text-foreground hidden sm:block">
              CHAT
            </span>
          </div>

          {/* Score badge */}
          <div className="hidden sm:flex items-center gap-2 ml-4">
            <Badge variant="brand" className="px-3 py-1.5">
              <span className="text-muted text-[10px] uppercase tracking-wider mr-1">Score</span>
              <span 
                className="font-bold text-sm"
                style={{ color: getScoreColor(user.ethosScore) }}
              >
                {user.ethosScore}
              </span>
            </Badge>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-mono hidden sm:block">
            @{user.username}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <IconLogout size={18} />
          </Button>
        </div>
      </div>
    </header>
  )
}
