import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Props {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user, token, isLoading } = useAppSelector(s => s.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
