import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface LoginRequiredProps {
  children: JSX.Element
}

const LoginRequired: React.FC<LoginRequiredProps> = (
  {
    children
  }
) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/auth/login/" state={{from: location}} replace />;
  }
  return children;
}


export default LoginRequired;