import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// providers
import { UserProvider } from './context/UserContext.tsx'
import { LoadingProvider } from './context/LoadingContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
        <LoadingProvider>
            <App />
        </LoadingProvider>
    </UserProvider>
  </StrictMode>,
)
