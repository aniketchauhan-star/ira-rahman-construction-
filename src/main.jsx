import React from 'react'
import { createRoot } from 'react-dom/client'

// Tokens, reset and base typography must load *before* any component
// stylesheet: they share the same specificity, so whichever comes last
// wins, and component-level overrides have to be the ones that win.
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
