import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google'
import { UserContextProvider } from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="224755675677-o7f28bpec50080ihneb5ghbtjn3dpemh.apps.googleusercontent.com">
    <BrowserRouter>
    <UserContextProvider>
      <App />
    </UserContextProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
