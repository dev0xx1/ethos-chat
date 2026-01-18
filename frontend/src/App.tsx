import { useAppSelector } from '@/store/hooks'
import { LoginPage } from '@/components/pages/LoginPage'
import { ChatPage } from '@/components/pages/ChatPage'

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <ChatPage />
}

export default App
