import { Button, Grid, TextField } from "@mui/material";
import { FormikErrors, FormikValues, useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../auth/providers/AuthProvider";
import ApiClient from "../../../utils/ApiClient";
import { Schedule } from "../../interfaces/Schedule";

interface ScheduleFormProps {
  schedule?: Schedule,
  onSuccess?: (schedule: Schedule) => void,
  onCancel?: () => void,
  enabled?: boolean,
}

const ScheduleForm: React.FC<ScheduleFormProps> = (
  {
    schedule,
    onSuccess,
    onCancel,
    enabled
  }
) => {
  const auth = useAuth();
  const apiClient = new ApiClient(auth.session?.access);
  const [disabled, setDisabled] = React.useState(!enabled);

  const formik = useFormik({
    initialValues: {
      name: schedule?.name || "",
      description: schedule?.description || "",
    },
    onSubmit: (values, {setSubmitting, setErrors}) => {
      handleSubmit(values, setSubmitting, setErrors)
    }
  });

  const handleSubmit = (
    values: FormikValues,
    setSubmitting: (v: boolean) => void,
    setErrors: (e: FormikErrors<FormikValues>) => void
  ) => {
    setSubmitting(true);
    if (schedule) {
      apiClient.patch(
        `/music/schedules/${schedule.id}/`,
        values,
      ).then(response => {
        setSubmitting(false);
        toast.success("Schedule updated successfully.");
        onSuccess && onSuccess(response.data);
        setDisabled(true);
        setSubmitting(false);
      }).catch(exception => {
        if (exception.response.status === 400) {
          setErrors(exception.response.data);
        }
        toast.error(exception.message);
        setSubmitting(false);
      })
    }
    else {
      apiClient.post(
        '/music/schedules/',
        values,
      ).then((response) => {
        setSubmitting(false);
        toast.success("Schedule created successfully.");
        onSuccess && onSuccess(response.data);
      }).catch(exception => {
        if (exception.response.status === 400) {
          setErrors(exception.response.data);
        }
        toast.error(exception.message)
      })
    }
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            variant="outlined"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting || disabled}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.errors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            multiline
            variant="outlined"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting || disabled}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.errors.description}
          />
        </Grid>
        <Grid item xs={12} sx={{textAlign: "right"}}>
          {
            disabled && schedule ? (
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  setDisabled(false);
                }}
                variant="contained"
              >
                Edit
              </Button>
            ): (
              <>
                <Button type="submit" variant="contained">Submit</Button>
                <Button 
                  variant="contained"
                  color="secondary"
                  sx={{marginLeft: 2}}
                  onClick={() => {
                    onCancel && onCancel();
                    if (schedule) setDisabled(true);
                  }}
                >
                  Cancel
                </Button>
              </>
            )
          }
        </Grid>
      </Grid>
    </form>
  )
}


export default ScheduleForm;