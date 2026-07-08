import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'seller' | 'customer'>;
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    // Redirect to home if they don't have the right role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
