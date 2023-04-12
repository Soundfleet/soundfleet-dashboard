import { Autocomplete, Button, CircularProgress, Grid, TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { parse, format } from "date-fns";
import { FormikErrors, FormikValues, useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import useAuth from "../../../auth/hooks/useAuth";
import NonFieldErrors from "../../../components/NonFieldErrors";
import { Schedule } from "../../../music/interfaces/Schedule";
import ApiClient from "../../../utils/ApiClient";
import { Calendar } from "../../interfaces/Calendar";
import { MusicEvent } from "../../interfaces/MusicEvent";


interface MusicEventFormProps {
  calendar: Calendar,
  musicEvent?: MusicEvent,
  enabled?: boolean,
  onSuccess?: (musicEvent: MusicEvent) => void,
  onDelete?: (musicEvent: MusicEvent) => void,
  onCancel?: () => void,
}


const MusicEventForm: React.FC<MusicEventFormProps> = (
  {
    calendar,
    musicEvent,
    enabled,
    onSuccess,
    onDelete,
    onCancel
  }
) => {
  const auth = useAuth();
  const apiClient = new ApiClient(auth.session?.access);
  const [disabled, setDisabled] = React.useState(!enabled);
  const [schedules, setSchedules] = React.useState<Schedule[] | undefined>(undefined);
  const [schedulesOpen, setSchedulesOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (schedules === undefined) {
      fetchSchedules();
    }
  })

  const fetchSchedules = (search?: string) => {
      setLoading(true);
      return apiClient.get(
        `/music/schedules/`,
        {search: search}
      ).then(
        response => {
          setSchedules(response.data.results);
          setLoading(false);
        }
      ).catch(
        exception => {
          setSchedules([]);
          setLoading(false);
          toast.error(exception.message);
        }
      )
  }

  const handleScheduleChange = useDebouncedCallback((value: string) => {
    fetchSchedules(value);
  }, 500)

  const formik = useFormik({
    initialValues: {
      start: musicEvent?.start || null,
      end: musicEvent?.end || null,
      schedule: musicEvent?.schedule || null,
    },
    onSubmit: (values, {setSubmitting, setErrors, setStatus}) => {
      handleSubmit(values, setSubmitting, setErrors, setStatus)
    }
  })

  const handleSubmit = (
    values: FormikValues,
    setSubmitting: (v: boolean) => void,
    setErrors: (e: FormikErrors<FormikValues>) => void,
    setStatus: (status: any) => void,
  ) => {
    setSubmitting(true);
    if (musicEvent) {
      apiClient.patch(
        `/calendars/${calendar.id}/music-schedules/${musicEvent.id}/`,
        {
          ...values,
          schedule: values.schedule.id,
          start: format(values.start, 'yyyy-MM-dd'), 
          end: format(values.end, 'yyyy-MM-dd')
        },
      ).then(response => {
        setSubmitting(false);
        toast.success("Schedule updated successfully.");
        onSuccess && onSuccess({
          ...response.data,
          start: parse(response.data.start, "yyyy-MM-dd", new Date()),
          end: parse(response.data.end, "yyyy-MM-dd", new Date()),
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
        `/calendars/${calendar.id}/music-schedules/`,
        {
          ...values,
          schedule: values.schedule.id,
          start: format(values.start, 'yyyy-MM-dd'), 
          end: format(values.end, 'yyyy-MM-dd')
        },
      ).then((response) => {
        setSubmitting(false);
        toast.success("Schedule created successfully.");
        onSuccess && onSuccess({
          ...response.data,
          start: parse(response.data.start, "yyyy-MM-dd", new Date()),
          end: parse(response.data.end, "yyyy-MM-dd", new Date()),
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
  }

  const handleDelete = () => {
    if (musicEvent) {
      apiClient.delete(
        `/calendars/${calendar.id}/music-schedules/${musicEvent.id}/`,
      ).then(
        () => {
          toast.success("Schedule deleted successfully.");
          onDelete && onDelete(musicEvent);
        }
      ).catch(
        exception => {
          toast.error(exception.message);
        }
      )
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <NonFieldErrors errors={formik.status} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <MobileDatePicker
              label="Start"
              format="yyyy-MM-dd"
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
          <MobileDatePicker
              label="End"
              format="yyyy-MM-dd"
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
            open={schedulesOpen}
            onOpen={() => {
                setSchedulesOpen(true);
                fetchSchedules()
              }
            }
            onClose={() => setSchedulesOpen(false)}
            disabled={disabled || formik.isSubmitting}
            options={schedules || []}
            getOptionLabel={(schedule: Schedule) => schedule.name}
            value={formik.values.schedule}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e: any, value: any) => formik.setFieldValue('schedule', value)}
            renderInput={
              params => {
                return (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    label="Schedule"
                    value={formik.values.schedule || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScheduleChange(e.target.value)}
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
            disabled && musicEvent ? (
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
                    if (musicEvent) setDisabled(true);
                  }}
                >
                  Cancel
                </Button>
                {
                  musicEvent ? (
                    <Button 
                      variant="contained"
                      color="error"
                      sx={{marginLeft: 2}}
                      onClick={() => handleDelete()}
                    >
                      Delete
                    </Button>
                  ) : <></>
                }
              </>
            )
          }
        </Grid>
      </Grid>
    </form>
  )

}


export default MusicEventForm;