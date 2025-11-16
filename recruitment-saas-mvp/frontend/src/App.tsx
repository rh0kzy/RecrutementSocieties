import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="max-w-4xl mx-auto flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Recruitment SaaS</h1>
        <nav>
          <Link className="mr-4" to="/">Home</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}
