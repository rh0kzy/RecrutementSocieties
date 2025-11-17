import React from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateProfile: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Candidate Profile</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <p className="mt-4">Welcome! Manage your profile and job applications here.</p>
    </div>
  );
};

export default CandidateProfile;
