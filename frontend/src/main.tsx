import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-right" richColors />  {/* Add the Toaster component to display notifications */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
