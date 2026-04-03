import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize theme before render to prevent flash
const theme = localStorage.getItem('souqii_theme');
if (theme) {
  try {
    const parsed = JSON.parse(theme);
    const resolvedTheme = parsed.state?.theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : parsed.state?.theme || 'light';
    document.documentElement.classList.add(resolvedTheme);
  } catch (e) {
    document.documentElement.classList.add('light');
  }
} else {
  document.documentElement.classList.add('light');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
