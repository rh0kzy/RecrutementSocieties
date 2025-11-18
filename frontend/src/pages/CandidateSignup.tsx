import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CandidateSignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/signup', { 
        email, 
        password, 
        role: 'CANDIDATE',
        firstName, 
        lastName 
      });
      const { token, user } = response.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to profile or dashboard
      navigate('/candidate/profile');

    } catch (err: any) {
      if (err.isAxiosError && err.response) {
        setError(err.response.data.error || 'An unexpected error occurred.');
      } else {
        setError('Signup failed. Please check your connection and try again.');
      }
      console.error('Candidate signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-primary">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-medium">
        <h2 className="text-3xl font-bold text-center text-text-primary mb-6">Create Candidate Account</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-xl relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border border-border rounded-xl w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-primary/10"
              required
              placeholder="John"
            />
          </div>

          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="shadow appearance-none border border-border rounded-xl w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-primary/10"
              required
              placeholder="Doe"
            />
          </div>

          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border border-border rounded-xl w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-primary/10"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border border-border rounded-xl w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-primary/10"
              required
              placeholder="Minimum 8 characters"
            />
          </div>

          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border border-border rounded-xl w-full py-2 px-3 text-text-primary mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary/10"
              required
              placeholder="Re-enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline w-full disabled:bg-gray-300"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-secondary">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateSignupPage;
