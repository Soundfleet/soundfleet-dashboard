import { Autocomplete, Button, CircularProgress, Grid, TextField } from "@mui/material";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { add, format, parse } from "date-fns";
import { FormikErrors, FormikValues, useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import useAuth from "../../../auth/hooks/useAuth";
import NonFieldErrors from "../../../components/NonFieldErrors";
import ApiClient from "../../../utils/ApiClient";
import { MusicBlock } from "../../interfaces/MusicBlock";
import { Playlist } from "../../interfaces/Playlist";
import { Schedule } from "../../interfaces/Schedule";


interface MusicBlockFormProps {
  schedule: Schedule,
  musicBlock?: MusicBlock,
  onSuccess?: (musicBlock: MusicBlock) => void,
  onCancel?: () => void,
  enabled?: boolean
}

const MusicBlockForm: React.FC<MusicBlockFormProps> = (
  {
    schedule,
    musicBlock,
    onSuccess,
    onCancel,
    enabled
  }
) => {
  const auth = useAuth();
  const apiClient = new ApiClient(auth.session?.access);
  const [disabled, setDisabled] = React.useState(!enabled);
  const [playlists, setPlaylists] = React.useState<Playlist[] | undefined>(undefined);
  const [playlistsOpen, setPlaylistsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  
  const fetchPlaylists = (search?: string) => {
      setLoading(true);
      apiClient.get(
        `/music/playlists/`,
        {search: search}
      ).then(
        response => {
          setPlaylists(response.data.results);
          setLoading(false);
        }
      ).catch(
        exception => {
          setPlaylists([]);
          setLoading(false);
          toast.error(exception.message);
        }
      )
  }

  const formik = useFormik({
    initialValues: {
      start: musicBlock?.start || null,
      end: musicBlock?.end || null,
      playlist: musicBlock?.playlist.id || null,
    },
    onSubmit: (values, {setSubmitting, setErrors, setStatus}) => {
      const start = values.start ? format(values.start, 'HH:mm:ss') : "";
      const end = values.end ? format(add(values.end, {seconds: -1}), 'HH:mm:ss') : "";
      handleSubmit({...values, start: start, end: end}, setSubmitting, setErrors, setStatus);
    }
  });

  const handleSubmit = (
    values: FormikValues,
    setSubmitting: (v: boolean) => void,
    setErrors: (e: FormikErrors<FormikValues>) => void,
    setStatus: (status: any) => void,
  ) => {
    setSubmitting(true);
    if (musicBlock) {
      apiClient.patch(
        `/music/schedules/${schedule.id}/music-blocks/${musicBlock.id}/`,
        values,
      ).then(response => {
        setSubmitting(false);
        toast.success("Music block updated successfully.");
        onSuccess && onSuccess({
          id: response.data.id,
          start: parse(response.data.start, "HH:mm:ss", new Date()),
          end: parse(response.data.end, "HH:mm:ss", new Date()),
          playlist: response.data.playlist
        });
        setDisabled(true);
        setSubmitting(false);
      }).catch(exception => {
        if (exception.response.status === 400) {
          setErrors(exception.response.data);
          setStatus(exception.response.data.non_field_errors);
        }
        toast.error(exception.message);
        setSubmitting(false);
      })
    }
    else {
      apiClient.post(
        `/music/schedules/${schedule.id}/music-blocks/`,
        values,
      ).then((response) => {
        setSubmitting(false);
        toast.success("Music block created successfully.");
        onSuccess && onSuccess({
          id: response.data.id,
          start: parse(response.data.start, "HH:mm:ss", new Date()),
          end: parse(response.data.end, "HH:mm:ss", new Date()),
          playlist: response.data.playlist
        });
      }).catch(exception => {
        if (exception.response.status === 400) {
          setErrors(exception.response.data);
          setStatus(exception.response.data.non_field_errors);
        }
        toast.error(exception.message);
        setSubmitting(false);
      })
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <NonFieldErrors errors={formik.status} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <MobileTimePicker
            ampm={false}
            label="Start"
            views={['hours']} 
            onChange={(v) => {formik.setFieldValue('start', v)}}
            slotProps={{
              textField: {
                fullWidth: true,
                name: 'start',
                value: formik.values.start,
                disabled: formik.isSubmitting || disabled,
                error: formik.touched.start && Boolean(formik.errors.start),
                helperText: formik.errors.start
              }
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <MobileTimePicker
            ampm={false}
            label="End"
            views={['hours']} 
            onChange={(v) => {formik.setFieldValue('end', v)}}
            slotProps={{
              textField: {
                fullWidth: true,
                name: 'end',
                value: formik.values.end,
                disabled: formik.isSubmitting || disabled,
                error: formik.touched.end && Boolean(formik.errors.end),
                helperText: formik.errors.end
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete 
            fullWidth
            open={playlistsOpen}
            onOpen={() => {
                setPlaylistsOpen(true);
                fetchPlaylists()
              }
            }
            onClose={() => setPlaylistsOpen(false)}
            disabled={disabled || formik.isSubmitting}
            options={playlists || []}
            getOptionLabel={(playlist: Playlist) => playlist.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e: any, value: any) => formik.setFieldValue('playlist', value.id)}
            renderInput={
              params => {
                return (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    label="Playlist"
                    value={formik.values.playlist}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => fetchPlaylists(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )
              }
            }

          />
        </Grid>
        <Grid item xs={12} sx={{textAlign: "right"}}>
          {
            disabled && musicBlock ? (
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
                    if (musicBlock) setDisabled(true);
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


export default MusicBlockForm;