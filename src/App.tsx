import { Routes, Route } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { NotFound } from './shared'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Default route - Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Legacy auth routes for compatibility */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
