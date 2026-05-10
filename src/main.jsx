import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';

// Import CSS của bạn vào đây
import './assets/css/reset.css'
import './assets/css/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
  </AuthProvider>
  </StrictMode>,
)

