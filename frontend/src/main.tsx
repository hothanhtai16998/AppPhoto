
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
      <AuthInitializer>
        <Toaster position="top-right" richColors />  {/* Add the Toaster component to display notifications */}
        <App />
      </AuthInitializer>
    </BrowserRouter>
  </StrictMode>,
)
