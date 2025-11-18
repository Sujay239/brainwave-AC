import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LoginForm from './components/Authentication/LoginForm.tsx'
import RegisterForm from './components/Authentication/Register.tsx'
import NotFound from './components/NotFound.tsx'
import ProfileSection from './components/ProfileSection.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path='/profile' element = {<ProfileSection />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  </StrictMode>,
)
  