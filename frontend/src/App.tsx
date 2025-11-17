import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
