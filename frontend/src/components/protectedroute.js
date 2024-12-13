import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode } from 'jwt-decode';  // Correctly import jwt_decode

// Function to get role from JWT token
function getRoleFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);  // Decode the token
    return decodedToken.role; // Extract role from JWT
  } catch (error) {
    return null;
  }
}

// ProtectedRoute component
const ProtectedRoute = ({ element: Component, allowedRole, ...rest }) => {
  const role = getRoleFromToken(); // Get the role from the token

  // If no token or role mismatch, redirect accordingly
  if (!role) {
    return <Navigate to="/login" state={{ message: 'Please login to access this page' }} replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/login" state={{ message: 'Login as correct role' }} replace />;
  }

  // If the role matches, render the protected component
  return <Component {...rest} />;
};

export default ProtectedRoute;
