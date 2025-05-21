import React from 'react';
import { Navigate } from 'react-router-dom';

const isTokenValid = (): boolean => {
  const authTokenString = localStorage.getItem('authToken');
  if (!authTokenString) return false;

  try {
    const { token, expiry } = JSON.parse(authTokenString);
    if (typeof token !== 'string' || typeof expiry !== 'number') return false;

    return token.length > 0 && Date.now() < expiry;
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
