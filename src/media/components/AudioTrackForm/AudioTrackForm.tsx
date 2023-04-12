import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FormikErrors, FormikValues, useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../auth/providers/AuthProvider";
import ApiClient from "../../../utils/ApiClient";
import { AudioTrack } from "../../interfaces/AudioTrack";


interface AudioTrackFormProps {
  audioTrack: AudioTrack,
  onSuccess: (audioTrack: AudioTrack) => void,
  onCancel: () => void
}


const AudioTrackForm: React.FC<AudioTrackFormProps> = (
  {
    audioTrack,
    onSuccess,
    onCancel
  }
) => {
  const auth = useAuth();
  const apiClient = new ApiClient(auth.session?.access);

  const formik = useFormik({
    initialValues: {
      artist: audioTrack.artist,
      title: audioTrack.title,
      genre: audioTrack.genre,
      track_type: audioTrack.track_type,
    },
    onSubmit: (values, {setSubmitting, setErrors}) => {
      handleSubmit(values, setSubmitting, setErrors)
    },
  });

  const handleSubmit = (
    values: FormikValues,
    setSubmitting: (v: boolean) => void,
    setErrors: (e: FormikErrors<FormikValues>) => void
  ) => {
    setSubmitting(true);
    apiClient.patch(
      `/media/audio-tracks/${audioTrack.id}/`,
      values,
    ).then(response => {
      setSubmitting(false);
      toast.success("Audio track updated successfully.");
      onSuccess(response.data);
    }).catch(exception => {
      if (exception.response.status === 400) {
        setErrors(exception.response.data);
      }
      toast.error(exception.message);
      setSubmitting(false);
    })
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            variant="outlined"
            name="artist"
            label="Artist"
            value={formik.values.artist}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            error={formik.touched.artist && Boolean(formik.errors.artist)}
            helperText={formik.errors.artist}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            variant="outlined"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.errors.title}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            variant="outlined"
            name="genre"
            label="Genre"
            value={formik.values.genre}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            error={formik.touched.genre && Boolean(formik.errors.genre)}
            helperText={formik.errors.genre}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Track type</InputLabel>
            <Select 
              variant="outlined"
              name="track_type"
              label="Track type"
              value={formik.values.track_type}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              error={formik.touched.track_type && Boolean(formik.errors.track_type)}
            >
              <MenuItem value="music">Music</MenuItem>
              <MenuItem value="ad">Ad</MenuItem>
            </Select>
            <FormHelperText>{formik.errors.track_type}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{textAlign: "right"}}>
          <Button type="submit" variant="contained">Submit</Button>
          <Button 
            variant="contained"
            color="secondary"
            sx={{marginLeft: 2}}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}


export default AudioTrackForm;