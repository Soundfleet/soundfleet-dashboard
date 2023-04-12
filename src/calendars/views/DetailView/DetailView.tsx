import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { useMatch } from "react-router-dom";
import React from "react";
import useAuth from "../../../auth/hooks/useAuth";
import ApiClient from "../../../utils/ApiClient";
import { Calendar } from "../../interfaces/Calendar";
import { toast } from "react-hot-toast";
import CalendarForm from "../../components/CalendarForm";
import { Calendar as BigCalendar } from "react-big-calendar";
import { localizer } from "../../../utils/localizer";
import { AdEvent } from "../../interfaces/AdEvent";
import { MusicEvent } from "../../interfaces/MusicEvent";
import { theme } from "../../../theme";
import MusicEventForm from "../../components/MusicEventForm";
import { format, parse } from "date-fns";
import AdEventForm from "../../components/AdEventForm";


const DetailView: React.FC = () => {
  const auth = useAuth();
  const match = useMatch("/calendars/:id/");
  const [calendar, setCalendar] = React.useState<Calendar | undefined | null>(undefined);
  const [musicEvents, setMusicEvents] = React.useState<MusicEvent[]>([]);
  const [adEvents, setAdEvents] = React.useState<AdEvent[]>([]);
  const [date, setDate] = React.useState<Date>(new Date());
  const [musicEventEditing, setMusicEventEditing] = React.useState<MusicEvent | null>(null);
  const [musicEventCreateDialogOpen, setMusicEventCreateDialogOpen] = React.useState(false);
  const [adEventEditing, setAdEventEditing] = React.useState<MusicEvent | null>(null);
  const [adEventCreateDialogOpen, setAdEventCreateDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (calendar === undefined) {
      apiClient.get(
        `/calendars/${match?.params.id}/`
      ).then(
        response => {
          setCalendar(response.data);
        }
      ).catch(
        exception => {
          if (exception.response.status !== 404) {
            toast.error(exception.message)
          }
          setCalendar(null)
        }
      )
    }
  });

  React.useEffect(() => {
    if (calendar) {
      const apiClient = new ApiClient(auth.session?.access);
      apiClient.get(
        `/calendars/${calendar.id}/music-schedules/`,
        {date: format(date, 'yyyy-MM-dd')}
      ).then(
        response => {
          setMusicEvents(response.data.map((obj: any) => {
            return {
              ...obj,
              start: parse(obj.start, 'yyyy-MM-dd', new Date()),
              end: parse(obj.end, 'yyyy-MM-dd', new Date()),
            }
          }));
        }
      ).catch(
        exception => {
          if (exception.response.status !== 404) {
            toast.error(exception.message)
          }
          setMusicEvents([]);
        }
      )
      apiClient.get(
        `/calendars/${calendar.id}/ad-schedules/`,
        {date: format(date, 'yyyy-MM-dd')}
      ).then(
        response => {
          setAdEvents(response.data.map((obj: any) => {
            return {
              ...obj,
              start: parse(obj.start, 'yyyy-MM-dd', new Date()),
              end: parse(obj.end, 'yyyy-MM-dd', new Date()),
            }
          }));
        }
      ).catch(
        exception => {
          if (exception.response.status !== 404) {
            toast.error(exception.message)
          }
          setAdEvents([]);
        }
      )
    }
  }, [date, calendar, auth.session?.access])

  const handleMusicEventCreate = (event: MusicEvent) => {
    setMusicEvents([...musicEvents, event]);
    setMusicEventCreateDialogOpen(false);
  }

  const handleMusicEventEdit = (event: MusicEvent) => {
    musicEvents.splice(musicEvents.findIndex((obj: MusicEvent) => obj.id === event.id), 1, event);
    setMusicEvents([...musicEvents]);
    setMusicEventEditing(null);
  }

  const handleMusicEventDelete = (event: MusicEvent) => {
    musicEvents.splice(musicEvents.findIndex((obj: MusicEvent) => obj.id === event.id), 1)
    setMusicEvents([...musicEvents]);
    setMusicEventEditing(null);
  }

  const musicEventEditDialog = () => {
    return (
      <Dialog
        open={musicEventEditing !== null}
        onClose={() => setMusicEventEditing(null)}
      >
        {
          musicEventEditing !== null ? (
            <>
              <DialogTitle>Edit music schedule</DialogTitle>
              <DialogContent>
                <MusicEventForm 
                  enabled
                  calendar={calendar!}
                  musicEvent={musicEventEditing} 
                  onSuccess={handleMusicEventEdit} 
                  onCancel={() => setMusicEventEditing(null)}
                  onDelete={handleMusicEventDelete}
                />
              </DialogContent>
            </>
          ) : <></>
        }
      </Dialog>
    )
  }

  const musicEventCreateDialog = () => (
    <Dialog
      open={musicEventCreateDialogOpen}
      onClose={() => setMusicEventCreateDialogOpen(false)}
    >
      <>
        <DialogTitle>Add new schedule</DialogTitle>
        <DialogContent>
          <MusicEventForm 
            enabled
            calendar={calendar!}
            onSuccess={handleMusicEventCreate} 
            onCancel={() => setMusicEventCreateDialogOpen(false)}
          />
        </DialogContent>
      </>
    </Dialog>
  )

  const handleAdEventCreate = (event: AdEvent) => {
    setAdEvents([...adEvents, event]);
    setAdEventCreateDialogOpen(false);
  }

  const handleAdEventEdit = (event: AdEvent) => {
    adEvents.splice(adEvents.findIndex((obj: AdEvent) => obj.id === event.id), 1, event);
    setAdEvents([...adEvents]);
    setAdEventEditing(null);
  }

  const handleAdEventDelete = (event: AdEvent) => {
    adEvents.splice(adEvents.findIndex((obj: AdEvent) => obj.id === event.id), 1)
    setAdEvents([...adEvents]);
    setAdEventEditing(null);
  }

  const adEventEditDialog = () => {
    return (
      <Dialog
        open={adEventEditing !== null}
        onClose={() => setAdEventEditing(null)}
      >
        {
          adEventEditing !== null ? (
            <>
              <DialogTitle>Edit ad schedule</DialogTitle>
              <DialogContent>
                <AdEventForm 
                  enabled
                  calendar={calendar!}
                  adEvent={adEventEditing} 
                  onSuccess={handleAdEventEdit} 
                  onCancel={() => setAdEventEditing(null)}
                  onDelete={handleAdEventDelete}
                />
              </DialogContent>
            </>
          ) : <></>
        }
      </Dialog>
    )
  }

  const adEventCreateDialog = () => (
    <Dialog
      open={adEventCreateDialogOpen}
      onClose={() => setAdEventCreateDialogOpen(false)}
    >
      <>
        <DialogTitle>Add new schedule</DialogTitle>
        <DialogContent>
          <AdEventForm 
            enabled
            calendar={calendar!}
            onSuccess={handleAdEventCreate} 
            onCancel={() => setAdEventCreateDialogOpen(false)}
          />
        </DialogContent>
      </>
    </Dialog>
  )

  if (calendar === undefined) {
    return <></>
  }
  else if (calendar === null) {
    return <>Calendar not found</>
  }

  return (
    <>
      {musicEventCreateDialog()}
      {musicEventEditDialog()}
      {adEventCreateDialog()}
      {adEventEditDialog()}
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h4">Calendar detail</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <CalendarForm 
            calendar={calendar}
            onSuccess={(calendar: Calendar) => setCalendar(calendar)}
          />
        </Grid>
        <Grid item xs={12} sx={{display: 'flex'}}>
          <Box>
            <Typography variant="h4">Schedule</Typography>
          </Box>
          <Box flexGrow={1} />
          <Button 
            variant="contained"
            onClick={() => setMusicEventCreateDialogOpen(true)}
          >
            Schedule music
          </Button>
          <Button 
            variant="contained"
            sx={{ml: 2}}
            onClick={() => setAdEventCreateDialogOpen(true)}
          >
            Schedule ads
          </Button>
        </Grid>
        <Grid item xs={12}>
          <BigCalendar 
            style={{minHeight: '800px'}}
            localizer={localizer}
            views={['month']}
            onNavigate={(date) => setDate(date)}
            startAccessor={'start'}
            endAccessor={'end'}
            resourceIdAccessor={'id'}
            events={[
              ...musicEvents.map(obj => {
                return {
                  id: obj.id,
                  event: obj,
                  title: obj.schedule.name,
                  start: obj.start, // parse(obj.start, 'yyyy-MM-dd', new Date()),
                  end: obj.end,
                  allDay: true,
                  isSelected: false,
                  type: 'music'
                }
              }),
              ...adEvents.map(obj => {
                return {
                  id: obj.id,
                  title: obj.schedule.name,
                  event: obj,
                  start: obj.start,
                  end: obj.end,
                  allDay: true,
                  isSelected: false,
                  type: 'ads',
                }
              }),
            ]}
            eventPropGetter={(event) => {
              return {
                style: {
                  background: event.type === 'music' ? theme.palette.primary.main : theme.palette.error.main,
                  color: '#fff',
                  border: 'none',
                  padding: '8px'
                }
              }
            }}
            onSelectEvent={(event) => {
              if (event.type === 'music') {
                setMusicEventEditing(event.event);
              }
              else {
                setAdEventEditing(event.event);
              }
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}


export default DetailView;