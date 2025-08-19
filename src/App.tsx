import { Routes, Route } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { LandingPage, NotFound } from './shared'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
