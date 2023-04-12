import { Autocomplete, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { add, format, parse } from "date-fns";
import { FormikErrors, FormikValues, setNestedObjectValues, useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import useAuth from "../../../auth/hooks/useAuth";
import NonFieldErrors from "../../../components/NonFieldErrors";
import ApiClient from "../../../utils/ApiClient";
import { AdBlock } from "../../interfaces/AdBlock";
import { Playlist } from "../../interfaces/Playlist";
import { Schedule } from "../../interfaces/Schedule";


interface AdBlockFormProps {
  schedule: Schedule,
  adBlock?: AdBlock,
  onSuccess?: (adBlock: AdBlock) => void,
  onCancel?: () => void,
  enabled?: boolean
}

const AdBlockForm: React.FC<AdBlockFormProps> = (
  {
    schedule,
    adBlock,
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
        `/ads/playlists/`,
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
      start: adBlock?.start || null,
      end: adBlock?.end || null,
      playlist: adBlock?.playlist.id || null,
      playback_interval: adBlock?.playback_interval || 10,
      play_all_ads: adBlock?.play_all_ads || true,
      ads_count_per_block: adBlock?.ads_count_per_block || 1,
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
    if (adBlock) {
      apiClient.patch(
        `/ads/schedules/${schedule.id}/ad-blocks/${adBlock.id}/`,
        values,
      ).then(response => {
        setSubmitting(false);
        toast.success("Ad block updated successfully.");
        onSuccess && onSuccess({
          id: response.data.id,
          start: parse(response.data.start, "HH:mm:ss", new Date()),
          end: parse(response.data.end, "HH:mm:ss", new Date()),
          playlist: response.data.playlist,
          playback_interval: response.data.playback_interval,
          ads_count_per_block: response.data.ads_count_per_block,
          play_all_ads: response.data.play_all_ads
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
        `/ads/schedules/${schedule.id}/ad-blocks/`,
        values,
      ).then((response) => {
        setSubmitting(false);
        toast.success("Ad block created successfully.");
        onSuccess && onSuccess({
          id: response.data.id,
          start: parse(response.data.start, "HH:mm:ss", new Date()),
          end: parse(response.data.end, "HH:mm:ss", new Date()),
          playlist: response.data.playlist,
          playback_interval: response.data.playback_interval,
          ads_count_per_block: response.data.ads_count_per_block,
          play_all_ads: response.data.play_all_ads
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
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Playback interval</InputLabel>
            <Select
              label="Playback interval"
              name="playback_interval"
              value={formik.values.playback_interval}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting || disabled}
              error={formik.touched.playback_interval && Boolean(formik.errors.playback_interval)}
            >
              <MenuItem value={0}>Loop ads without music</MenuItem>
              <MenuItem value={5}>Every 5 minutes</MenuItem>
              <MenuItem value={10}>Every 10 minutes</MenuItem>
              <MenuItem value={15}>Every 15 minutes</MenuItem>
              <MenuItem value={30}>Every 30 minutes</MenuItem>
              <MenuItem value={60}>Every hour</MenuItem>
            </Select>
            <FormHelperText>{formik.errors.playback_interval}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox 
                disabled={formik.isSubmitting || disabled}
                checked={formik.values.play_all_ads}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => formik.setFieldValue('play_all_ads', e.target.checked)}
              />
            } 
            label={"Play all ads"} 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ads count per block"
            name="ads_count_per_block"
            value={formik.values.ads_count_per_block}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting || disabled || formik.values.play_all_ads}
            error={formik.touched.ads_count_per_block && Boolean(formik.errors.ads_count_per_block)}
            helperText={formik.errors.ads_count_per_block || "Determine how many ads will be drawn to ad block."}
          />
        </Grid>
        <Grid item xs={12} sx={{textAlign: "right"}}>
          {
            disabled && adBlock ? (
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
                    if (adBlock) setDisabled(true);
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


export default AdBlockForm;