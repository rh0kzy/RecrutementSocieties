import React from 'react';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Join Us</h2>
        <p className="text-gray-600 mb-8">Are you looking for a job or are you hiring?</p>
        
        <div className="space-y-4">
          <Link 
            to="/signup/candidate"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            I'm a Candidate
          </Link>
          
          <Link 
            to="/signup/company"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            I'm a Company
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-500 hover:text-blue-800">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
