import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  if (!token || !userString) {
    // User is not logged in
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    const userRole = user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      // User does not have the required role
      // Redirect to a generic "unauthorized" page or home
      return <Navigate to="/" replace />;
    }

    // User is authenticated and has the correct role, render the child components
    return <Outlet />;
  } catch (error) {
    console.error("Failed to parse user data from localStorage", error);
    // If user data is corrupted, clear it and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
