import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If authenticated, render the children (AdminLayout)
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, redirect to the login page
  return <Navigate to="/login" replace />;
};

export default AdminRoute;