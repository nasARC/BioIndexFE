import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HeroUIProvider } from '@heroui/system'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider className='h-full w-full flex flex-row items-center'>
        <App />
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>,
)
