import { Button, FormControl, Grid, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { FormikErrors, FormikValues, useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../auth/providers/AuthProvider";
import ApiClient from "../../../utils/ApiClient";
import { Playlist } from "../../interfaces/Playlist";

interface PlaylistFormProps {
  playlist?: Playlist,
  onSuccess?: (playlist: Playlist) => void,
  onCancel?: () => void,
  enabled?: boolean,
}

const PlaylistForm: React.FC<PlaylistFormProps> = (
  {
    playlist,
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
      name: playlist?.name || "",
      description: playlist?.description || "",
      label_color: playlist?.label_color || "#000000",
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
    if (playlist) {
      apiClient.patch(
        `/ads/playlists/${playlist.id}/`,
        values,
      ).then(response => {
        setSubmitting(false);
        toast.success("Playlist updated successfully.");
        onSuccess && onSuccess(response.data);
        setDisabled(true);
      }).catch(exception => {
        if (exception.response.status === 400) {
          setErrors(exception.response.data);
        }
        toast.error(exception.message)
      })
    }
    else {
      apiClient.post(
        '/ads/playlists/',
        values,
      ).then((response) => {
        setSubmitting(false);
        toast.success("Playlist created successfully.");
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
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Label</InputLabel>
            <OutlinedInput
              type="color"
              name="label_color"
              label="Label"
              value={formik.values.label_color}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting || disabled}
              error={formik.touched.label_color && Boolean(formik.errors.label_color)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{textAlign: "right"}}>
          {
            disabled && playlist ? (
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
                    if (playlist) setDisabled(true);
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


export default PlaylistForm;