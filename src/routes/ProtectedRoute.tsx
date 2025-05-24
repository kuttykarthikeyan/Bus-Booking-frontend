import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const isTokenValid = (token: string | null): boolean => {
  return !!token && token.length > 0;
};

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { userToken, isAuthenticated } = useSelector((state: RootState) => state.user);

  if (!isAuthenticated || !isTokenValid(userToken)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
