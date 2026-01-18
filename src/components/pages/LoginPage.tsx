import { usePrivy } from '@privy-io/react-auth'
import { IconBrandX } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLoading, setUser, setError } from '@/store/slices/authSlice'
import { fetchEthosScore } from '@/services/ethosApi'
import { Button } from '@/components/ui/Button'
import { EthosLogoLarge } from '@/components/ui/EthosLogo'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const { login, authenticated, user: privyUser, ready } = usePrivy()

  const handleLogin = async () => {
    dispatch(setLoading(true))

    try {
      // Trigger Privy login with Twitter/X
      await login({ loginMethods: ['twitter'] })
    } catch (err) {
      console.error('Login error:', err)
      dispatch(setError('Failed to initiate login. Please try again.'))
    }
  }

  // Handle successful authentication
  const handleAuthSuccess = async () => {
    if (!authenticated || !privyUser) return

    try {
      // Get Twitter account from linked accounts
      const twitterAccount = privyUser.linkedAccounts?.find(
        (account) => account.type === 'twitter_oauth'
      )

      if (!twitterAccount || !('username' in twitterAccount)) {
        // For demo, allow login without Twitter
        const username = privyUser.id.slice(0, 8)
        const score = await fetchEthosScore(username)
        
        dispatch(setUser({
          id: privyUser.id,
          username: username,
          ethosScore: score,
        }))
        return
      }

      const twitterUsername = twitterAccount.username as string

      // Fetch Ethos score
      const score = await fetchEthosScore(twitterUsername)

      dispatch(setUser({
        id: privyUser.id,
        username: twitterUsername,
        twitterId: 'subject' in twitterAccount ? (twitterAccount.subject as string) : undefined,
        ethosScore: score,
      }))
    } catch (err) {
      console.error('Auth error:', err)
      dispatch(setError('Failed to complete authentication. Please try again.'))
    }
  }

  // Effect to handle auth state changes
  if (authenticated && privyUser && ready) {
    handleAuthSuccess()
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background opacity-90" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Gradient orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-brand/5 blur-[100px]" />

      <div className="relative text-center space-y-8 p-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <EthosLogoLarge size={100} />
          <h1 className="text-3xl lg:text-4xl font-light tracking-[0.15em] text-foreground">
            ETHOS<span className="text-brand">CHAT</span>
          </h1>
        </div>

        {/* Hero text */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl sm:text-3xl font-light text-muted-foreground">
            Reputation-gated chats
          </h2>
        </div>

        {/* Login button */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Button
            onClick={handleLogin}
            isLoading={isLoading || !ready}
            disabled={isLoading || !ready}
            size="lg"
            className="px-8 py-3 font-mono text-sm tracking-wider"
          >
            <IconBrandX size={18} className="mr-2" />
            {isLoading ? 'CONNECTING...' : 'LOGIN WITH 𝕏'}
          </Button>

          {error && (
            <p className="text-error text-sm font-mono animate-fade-in">{error}</p>
          )}
        </div>

        {/* Footer text */}
        <p className="text-muted text-xs font-mono tracking-wider animate-fade-in pt-4" style={{ animationDelay: '300ms' }}>
          POWERED BY ETHOS NETWORK
        </p>
      </div>
    </div>
  )
}
