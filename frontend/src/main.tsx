import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import AuthInitializer from './components/auth/AuthInitializer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" richColors />  {/* Add the Toaster component to display notifications */}
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </BrowserRouter>
  </StrictMode>,
)
