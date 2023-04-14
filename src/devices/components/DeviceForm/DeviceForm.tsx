import { Autocomplete, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FormikErrors, FormikValues, useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import { useAuth } from "../../../auth/providers/AuthProvider";
import { Calendar } from "../../../calendars/interfaces/Calendar";
import ApiClient from "../../../utils/ApiClient";
import { timezones } from "../../../utils/timezone";
import { Device } from "../../interfaces/Device";

interface DeviceFormProps {
  device?: Device,
  onSuccess?: (device: Device) => void,
  onCancel?: () => void,
  enabled?: boolean,
}


const DeviceForm: React.FC<DeviceFormProps> = (
  {
    device,
    onSuccess,
    onCancel,
    enabled
  }
) => {
  const auth = useAuth();
  const apiClient = new ApiClient(auth.session?.access);
  const [calendars, setCalendars] = React.useState<Calendar[] | undefined>(undefined);
  const [calendarsOpen, setCalendarsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(!enabled);

  React.useEffect(() => {
    if (calendars === undefined) {
      fetchCalendars();
    }
  })

  const fetchCalendars = (search?: string) => {
    setLoading(true);
    apiClient.get(
      '/calendars/',
      {search: search}
    ).then(
      response => {
        setCalendars(response.data.results);
        setLoading(false);
      }
    ).catch(
      exception => {
        setCalendars([]);
        setLoading(false);
        toast.error(exception.message);
      }
    )
  }

  const handleCalendarChange = useDebouncedCallback((value: string) => {
    fetchCalendars(value);
  }, 500)

  const formik = useFormik({
    initialValues: {
      name: device?.name || "",
      description: device?.description || "",
      calendar: device?.calendar || null,
      playback_priority: device?.playback_priority || "music",
      connection_policy: device?.connection_policy || "allow",
      timezone_name: device?.timezone_name || "UTC",
      debug: device?.debug || 0
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
    if (device) {
      apiClient.patch(
        `/devices/${device.uuid}/`,
        {
          ...values,
          calendar: values.calendar.id
        },
      ).then(response => {
        setSubmitting(false);
        toast.success("Device updated successfully.");
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
        '/devices/',
        {
          ...values,
          calendar: values.calendar.id
        },
      ).then((response) => {
        setSubmitting(false);
        toast.success("Device created successfully.");
        onSuccess && onSuccess(response.data);
      }).catch(exception => {
        if (exception.response.status === 400) {
          setErrors(exception.response.data);
        }
        toast.error(exception.message);
        setSubmitting(false);
      })
    }
  };
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
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
          <Autocomplete 
            fullWidth
            open={calendarsOpen}
            onOpen={() => {
                setCalendarsOpen(true);
                fetchCalendars()
              }
            }
            onClose={() => setCalendarsOpen(false)}
            disabled={disabled || formik.isSubmitting}
            options={calendars || []}
            getOptionLabel={(calendar: Calendar) => calendar.name}
            value={formik.values.calendar}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e: any, value: any) => formik.setFieldValue('calendar', value)}
            renderInput={
              params => {
                return (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    label="Calendar"
                    value={formik.values.calendar || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCalendarChange(e.target.value)}
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
          <FormControl fullWidth>
            <InputLabel>Playback priority</InputLabel>
            <Select
              label="Playback priority"
              name="playback_priority"
              value={formik.values.playback_priority}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting || disabled}
              error={formik.touched.playback_priority && Boolean(formik.errors.playback_priority)}
            >
              <MenuItem value="music">Music over ads</MenuItem>
              <MenuItem value="ads">Ads over music</MenuItem>
            </Select>
            <FormHelperText>{formik.errors.playback_priority}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Connection policy</InputLabel>
            <Select
              label="Connection policy"
              name="connection_policy"
              value={formik.values.connection_policy}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting || disabled}
              error={formik.touched.connection_policy && Boolean(formik.errors.connection_policy)}
            >
              <MenuItem value="allow">Allow</MenuItem>
              <MenuItem value="deny">Deny</MenuItem>
            </Select>
            <FormHelperText>{formik.errors.connection_policy}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Timezone</InputLabel>
            <Select
              label="Timezone"
              name="timezone_name"
              value={formik.values.timezone_name}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting || disabled}
              error={formik.touched.timezone_name && Boolean(formik.errors.timezone_name)}
            >
              {
                timezones.map(tz => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)
              }
            </Select>
            <FormHelperText>{formik.errors.timezone_name}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{textAlign: "right"}}>
          {
            disabled && device ? (
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
                    if (device) setDisabled(true);
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


export default DeviceForm;
