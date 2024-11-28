import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import Home from './Home.tsx'

WebApp.ready()

WebApp.expand()
WebApp.requestFullscreen();





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
