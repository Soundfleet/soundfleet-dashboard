import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import React from "react";
import { toast } from "react-hot-toast";
import { useMatch } from "react-router-dom";
import useAuth from "../../../../auth/hooks/useAuth";
import ApiClient from "../../../../utils/ApiClient";
import { Schedule } from "../../../interfaces/Schedule";
import AddIcon from "@mui/icons-material/Add";
import ScheduleForm from "../../../components/ScheduleForm";
import { MusicBlock } from "../../../interfaces/MusicBlock";
import MusicBlockForm from "../../../components/MusicBlockForm";
import { parse, format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import { Calendar, EventProps } from "react-big-calendar";
import { localizer } from "../../../../utils/localizer";
import 'react-big-calendar/lib/css/react-big-calendar.css';


const DetailView: React.FC = () => {
  const auth = useAuth();
  const match = useMatch(`/music/schedules/:id/`);
  const apiClient = new ApiClient(auth.session?.access);
  const [schedule, setSchedule] = React.useState<Schedule | undefined | null>(undefined);
  const [musicBlocks, setMusicBlocks] = React.useState<MusicBlock[] | undefined>(undefined);
  const [editing, setEditing] = React.useState<MusicBlock | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<MusicBlock | null>(null);

  React.useEffect(() => {
    if (schedule === undefined) {
      apiClient.get(
        `/music/schedules/${match?.params.id}/`
      ).then(
        response => {
          setSchedule(response.data)
        }
      ).catch(
        exception => {
          if (exception.response.status !== 404) {
            toast.error(exception.message)
          }
          setSchedule(null)
        }
      )
    }
    if (musicBlocks === undefined) {
      apiClient.get(
        `/music/schedules/${match?.params.id}/music-blocks/`
      ).then(
        response => {
          setMusicBlocks(response.data.map((obj: any) => {
            return {
              id: obj.id,
              start: parse(obj.start, 'HH:mm:ss', new Date()),
              end: parse(obj.end, 'HH:mm:ss', new Date()),
              playlist: obj.playlist
            }
          }))
        }
      ).catch(
        exception => {
          if (exception.response.status !== 404) {
            toast.error(exception.message)
          }
          setSchedule(null)
        }
      )
    }
  });

  const createDialog = (schedule: Schedule) => (
    <Dialog
      open={createDialogOpen}
      onClose={() => setCreateDialogOpen(false)}
    >
      <>
        <DialogTitle>Add new music block</DialogTitle>
        <DialogContent>
          <MusicBlockForm 
            enabled
            schedule={schedule}
            onSuccess={handleCreate} 
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </>
    </Dialog>
  )

  const handleCreate = (musicBlock: MusicBlock) => {
    setCreateDialogOpen(false);
    setMusicBlocks([musicBlock, ...musicBlocks || []]);
  }

  const handleDelete = (schedule: Schedule, musicBlock: MusicBlock) => {
    apiClient.delete(
      `/music/schedules/${schedule.id}/music-blocks/${musicBlock.id}/`
    ).then(() => {
      toast.success('Music block deleted successfully.');
      musicBlocks!.splice(musicBlocks!.findIndex((obj: MusicBlock) => obj.id === deleting?.id), 1)
      setMusicBlocks([...musicBlocks!]);
      setDeleting(null);
    }).catch(exception => {
      toast.error(exception.message)
    })
  }

  if (schedule === undefined) {
    return <></>
  }
  else if (schedule === null) {
    return <>Schedule not found</>
  }
  
  return (
    <>
      {createDialog(schedule)}
      <ConfirmationDialog 
        open={deleting !== null} 
        title="Delete music block"
        variant="error"
        onConfirm={() => handleDelete(schedule!, deleting!)}
        onCancel={() => setDeleting(null)}
      >
        Are you sure you want to delete music block? This action is irreversible.
      </ConfirmationDialog>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h4">Music schedule details</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ScheduleForm
            schedule={schedule}
          />
        </Grid>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h5">Music blocks</Typography>
          </Box>
          <Box flexGrow={1}/>
          <Box>
            <Button 
              variant="contained" 
              size="small" 
              onClick={() => setCreateDialogOpen(true)}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Calendar
            localizer={localizer}
            defaultView="day"
            views={["day"]}
            components={{
              toolbar: () => <></>,
              event: (event: EventProps<MusicBlock>) => {
                return (
                  <Box>
                    {event.event.playlist.name}
                    <IconButton
                      onClick={() => setDeleting(event.event)}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 2,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )
              }
            }}
            events={musicBlocks}
            eventPropGetter={
              (musicBlock, start, end, isSelected) => {
                return {
                  style: {
                    backgroundColor: `${musicBlock.playlist.label_color}80`,
                    border: "none",
                  },
                }
              }
            }
          />
        </Grid>
      </Grid>
    </>
  )
}


export default DetailView;