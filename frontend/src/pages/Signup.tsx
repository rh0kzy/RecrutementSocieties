import React from 'react';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-primary">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-medium border border-border text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-6">Join Us</h2>
        <p className="text-text-secondary mb-8">Are you looking for a job or are you hiring?</p>

        <div className="space-y-4">
          <Link
            to="/signup/candidate"
            className="block w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5"
          >
            I'm a Candidate
          </Link>

          <Link
            to="/signup/company"
            className="block w-full bg-success hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5"
          >
            I'm a Company
          </Link>
        </div>

        <div className="mt-8 text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-secondary transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
