import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';

// Define the roles
type Role = 'ADMIN' | 'COMPANY' | 'CANDIDATE';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('CANDIDATE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password, role });
      const { token, user } = response.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'COMPANY':
          navigate('/company/dashboard');
          break;
        case 'CANDIDATE':
          navigate('/candidate/profile');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'An unexpected error occurred.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0052CC] to-[#0747A6] p-12 flex-col justify-between text-white">
        <div>
          <h1 className="text-4xl font-bold mb-4">💼 Recruitment SaaS</h1>
          <p className="text-blue-100 text-lg">Your all-in-one platform for talent acquisition</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Smart Matching</h3>
              <p className="text-blue-100">AI-powered candidate recommendations</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Lightning Fast</h3>
              <p className="text-blue-100">Streamlined hiring process</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Secure & Compliant</h3>
              <p className="text-blue-100">Enterprise-grade security</p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-blue-100">
          © 2025 Recruitment SaaS. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#172B4D] mb-2">Welcome Back</h2>
              <p className="text-[#5E6C84]">Sign in to your account to continue</p>
            </div>
            
            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-[#DE350B] p-4 rounded-r-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-[#DE350B] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#DE350B] text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#172B4D] mb-3">
                  I am a...
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'CANDIDATE', label: 'Candidate', icon: '👤' },
                    { value: 'COMPANY', label: 'Company', icon: '🏢' },
                    { value: 'ADMIN', label: 'Admin', icon: '⚙️' }
                  ] as const).map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        role === r.value
                          ? 'border-[#0052CC] bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{r.icon}</div>
                      <div className={`text-xs font-semibold ${
                        role === r.value ? 'text-[#0052CC]' : 'text-[#5E6C84]'
                      }`}>
                        {r.label}
                      </div>
                      {role === r.value && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-4 h-4 text-[#0052CC]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#172B4D] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-[#172B4D]"
                    placeholder="you@example.com"
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5E6C84]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#172B4D] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-[#172B4D]"
                    placeholder="Enter your password"
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5E6C84]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-[#0052CC] hover:text-[#0747A6] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0052CC] hover:bg-[#0747A6] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0052CC] transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-[#5E6C84]">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-[#0052CC] hover:text-[#0747A6] transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile branding */}
          <div className="lg:hidden text-center mt-6 text-sm text-[#5E6C84]">
            © 2025 Recruitment SaaS. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
