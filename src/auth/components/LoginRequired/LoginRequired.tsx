import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiClient from "../../../utils/ApiClient";
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
  const apiClient = new ApiClient();
  const [tokenVerified, setTokenVerified] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (auth.session && !loading) {
      setLoading(true);
      apiClient.post(
        "/auth/verify-token/", {"token": auth.session.access}
      ).then(
        () => {
          setTokenVerified(true);
          setLoading(false);
        }
      ).catch(() => {
        auth.logout();
        setLoading(false);
      });
    }
  }, [auth, apiClient, tokenVerified, loading])

  if (!auth.isAuthenticated()) {
    return <Navigate to="/auth/login/" state={{from: location}} replace />;
  }
  return tokenVerified ? children : <></>
}


export default LoginRequired;