import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PrivyProvider } from '@privy-io/react-auth'
import { store } from '@/store'
import App from './App.tsx'
import './index.css'

const PRIVY_APP_ID = 'cmkhjyr3s00ffjr0ckr1pfalq'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          loginMethods: ['twitter'],
          appearance: {
            theme: 'dark',
            accentColor: '#b5b5a5',
            showWalletLoginFirst: false,
          },
        }}
      >
        <App />
      </PrivyProvider>
    </Provider>
  </StrictMode>
)
