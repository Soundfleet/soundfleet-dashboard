import React from 'react';
import { FormikErrors, FormikValues, useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Grid, TextField } from '@mui/material';

interface LoginFormProps {
  onSubmit: (
    username: string,
    password: string,
    setSubmitting: (v: boolean) => void,
    setErrors: (e: FormikErrors<FormikValues>) => void
  ) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {

  const validationSchema = yup.object({
    username: yup
      .string()
      .required('Username is required'),
    password: yup
      .string()
      .required("Password is required")
  });

  const handleSubmit = (
    values: FormikValues,
    setSubmitting: (v: boolean) => void,
    setErrors: (e: FormikErrors<FormikValues>) => void
  ) => {
    onSubmit(values.username, values.password, setSubmitting, setErrors);
  };

  const formik = useFormik({
      initialValues: {
        username: '',
        password: ''
      },
      onSubmit: (values, {setSubmitting, setErrors}) => {
        handleSubmit(values, setSubmitting, setErrors)
      },
      validationSchema: validationSchema
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            variant="outlined"
            name="username" 
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.errors.username}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            variant="outlined"
            type="password"
            name="password" 
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.errors.password}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>Submit</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginForm;