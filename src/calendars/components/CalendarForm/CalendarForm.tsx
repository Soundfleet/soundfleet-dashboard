import { Button, Grid, OutlinedInput, TextField } from "@mui/material";
import { FormikErrors, FormikValues, useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../auth/providers/AuthProvider";
import ApiClient from "../../../utils/ApiClient";
import { Calendar } from "../../interfaces/Calendar";

interface CalendarFormProps {
  calendar?: Calendar,
  onSuccess?: (calendar: Calendar) => void,
  onCancel?: () => void,
  enabled?: boolean,
}

const CalendarForm: React.FC<CalendarFormProps> = (
  {
    calendar,
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
      name: calendar?.name || "",
      description: calendar?.description || "",
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
    if (calendar) {
      apiClient.patch(
        `/calendars/${calendar.id}/`,
        values,
      ).then(response => {
        setSubmitting(false);
        toast.success("Calendar updated successfully.");
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
        '/calendars/',
        values,
      ).then((response) => {
        setSubmitting(false);
        toast.success("Calendar created successfully.");
        onSuccess && onSuccess(response.data);
      }).catch(exception => {
        if (exception.response.status === 400) {
          setErrors(exception.response.data);
        }
        toast.error(exception.message)
        setSubmitting(false);
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
            disabled && calendar ? (
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
                    if (calendar) setDisabled(true);
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


export default CalendarForm;