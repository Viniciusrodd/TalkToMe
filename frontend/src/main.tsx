import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// providers
import { UserProvider } from './context/UserContext.tsx'
import { LoadingProvider } from './context/LoadingContext.tsx'
import { ConversationProvider } from './context/ConversationContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
        <LoadingProvider>
            <ConversationProvider>
                <App />
            </ConversationProvider>
        </LoadingProvider>
    </UserProvider>
  </StrictMode>,
)
