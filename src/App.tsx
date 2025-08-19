import { Routes, Route } from 'react-router-dom'
import { HomePage } from './features/home'
import { AboutPage } from './features/about'
import { ContactPage } from './features/contact'
import { LoginPage, RegisterPage } from './features/auth'
import { NotFound } from './shared'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

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
