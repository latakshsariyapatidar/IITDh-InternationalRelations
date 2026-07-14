import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { StudentAuthProvider } from './contexts/StudentAuthContext.jsx'
import { SiteContentProvider } from './contexts/SiteContentContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StudentAuthProvider>
          <SiteContentProvider>
            <App />
          </SiteContentProvider>
        </StudentAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

