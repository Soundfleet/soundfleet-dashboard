import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import { toast } from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import ApiClient from "../../../utils/ApiClient";
import LoginForm from "../../components/LoginForm"
import { useAuth } from "../../providers/AuthProvider";


const LoginView: React.FC = () => {
  const auth = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function login(
    username: string,
    password: string,
    setSubmitting: (v: boolean) => void,
    setErrors: (e: any) => void
  ) {
    const apiClient = new ApiClient();
    try {
      const response = await apiClient.post(
        "/auth/get-token/",
        {username: username, password: password}
      )
      setSubmitting(false);
      auth.login(response.data);
    }
    catch (exception: any) {
      setSubmitting(false);
      if (exception.response) {
        setErrors(exception.response.data);
      }
      toast.error(exception.toString());
    }
  }

  if (auth.isAuthenticated()) return <Navigate to={from} />

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 8
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Login to Soundfleet Dashboard
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LoginForm
            onSubmit={(
              username,
              password,
              setSubmitting,
              setErrors
            ) => login(username, password, setSubmitting, setErrors)
          } />
        </Grid>
      </Grid>
    </Container>
  )
}


export default LoginView;