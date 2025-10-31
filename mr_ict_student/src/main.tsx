import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { StudentJourneyProvider } from './context/StudentJourneyContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <StudentJourneyProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StudentJourneyProvider>
    </ThemeProvider>
  </StrictMode>,
)
