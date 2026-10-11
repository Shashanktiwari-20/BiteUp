import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { account, role } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!account) {
    const redirectPath = allowedRole === 'foodPartner' ? '/foodpartner/login' : '/user/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;