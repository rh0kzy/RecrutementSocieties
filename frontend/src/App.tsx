import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CompanySignup from './pages/CompanySignup';
import CandidateSignup from './pages/CandidateSignup';
import Signup from './pages/Signup';
import JobApplication from './pages/JobApplication';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/company" element={<CompanySignup />} />
          <Route path="/company/signup" element={<CompanySignup />} />
          <Route path="/signup/candidate" element={<CandidateSignup />} />
          <Route path="/candidate/signup" element={<CandidateSignup />} />
          <Route path="/job/:jobId/apply" element={<JobApplication />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
            <Route path="/candidate/profile" element={<CandidateProfile />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
