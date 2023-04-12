import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import React from "react";
import { connect } from "react-redux";
import { useAuth } from "../../../auth/providers/AuthProvider";
import Filters, { TextInputFilter } from "../../../filters/components/Filters";
import { AppState } from "../../../redux/store";
import ApiClient from "../../../utils/ApiClient";
import { AudioTrack } from "../../interfaces/AudioTrack";
import SearchIcon from '@mui/icons-material/Search';
import PaginationFilter from "../../../filters/components/Filters/PaginationFilter";
import { toast } from "react-hot-toast";
import { SelectFilter } from "../../../filters/components/Filters/SelectFilter";
import PlayButton from "../../../player/components/PlayButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AudioTrackForm from "../../components/AudioTrackForm";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link } from "react-router-dom";

interface ListViewProps {
  filtersKey: string | undefined,
  filters: string | undefined
}

const ListView: React.FC<ListViewProps> = (
  {
    filtersKey,
    filters
  }
) => {
  const auth = useAuth();
  const [audioTracks, setAudioTracks] = React.useState<AudioTrack[]>([]);
  const [count, setCount] = React.useState(0);
  const [editing, setEditing] = React.useState<AudioTrack | null>(null);
  const [deleting, setDeleting] = React.useState<AudioTrack | null>(null);

  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (filters !== undefined && filtersKey === 'audioTrackList') {
      const searchParams = new URLSearchParams(filters);
      apiClient.get(
        "/media/audio-tracks/",
        {...Object.fromEntries(searchParams.entries())}
      ).then((response) => {
        setAudioTracks(response.data.results);
        setCount(response.data.count);
      }).catch(exception => toast.error(exception.message));
    }
  }, [auth.session?.access, filtersKey, filters]);

  const editDialog = () => (
    <Dialog
      open={editing !== null}
      onClose={() => setEditing(null)}
    >
      {
        editing !== null ? (
          <>
            <DialogTitle>Edit audio track</DialogTitle>
            <DialogContent>
                <AudioTrackForm 
                  audioTrack={editing} 
                  onSuccess={handleEdit} 
                  onCancel={() => setEditing(null)}
                />
            </DialogContent>
          </>
        ) : <></>
      }
    </Dialog>
  )

  const handleEdit = (audioTrack: AudioTrack) => {
      audioTracks.splice(audioTracks.findIndex((obj: AudioTrack) => obj.id === audioTrack?.id), 1, audioTrack)
      setAudioTracks([...audioTracks]);
      setEditing(null);
  }

  const handleDelete = (audioTrack: AudioTrack) => {
    const apiClient = new ApiClient(auth.session?.access);
    apiClient.delete(
      `/media/audio-tracks/${audioTrack.id}/`
    ).then(() => {
      toast.success('Audio track deleted successfully.');
      audioTracks.splice(audioTracks.findIndex((obj: AudioTrack) => obj.id === deleting?.id), 1)
      setAudioTracks([...audioTracks]);
      setDeleting(null);
    }).catch(exception => {
      toast.error(exception)
    })
  }

  return (
    <>
      {editDialog()}
      <ConfirmationDialog 
        open={deleting !== null} 
        title="Delete audio track"
        variant="error"
        onConfirm={() => handleDelete(deleting!)}
        onCancel={() => setDeleting(null)}
      >
        Are you sure you want to delete audio track? This action is irreversible.
      </ConfirmationDialog>
      <Filters 
        filtersKey="audioTrackList"
        filtersConf={[
          {
            queryParam: "search", 
            filterParam: "search"
          },
          {
            queryParam: "track_type",
            filterParam: "track_type"
          },
          {
            queryParam: "page",
            filterParam: "page"
          },
          {
            queryParam: "track_type",
            filterParam: "track_type"
          }
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h4">Audio tracks</Typography>
          </Box>
          <Box flexGrow={1}/>
          <Box>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<CloudUploadIcon />}
            component={Link}
            to="/media/upload/"
          >
            Upload
          </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  colSpan={6}
                  sx={{
                    paddingLeft: 0
                  }}
                >
                  <TextInputFilter
                    size="small" 
                    queryParam="search" 
                    placeholder="Search audio tracks"
                    sx={{
                      minWidth: "300px",
                      mr: 3
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                  <FormControl>
                    <InputLabel sx={{
                      mt: "-8px",
                      "&.Mui-focused": {
                        mt: 0
                      }
                    }}>
                      Track type
                    </InputLabel>
                    <SelectFilter
                      queryParam="track_type"
                      size="small"
                      label="Track type"
                      sx={{
                        minWidth: "120px"
                      }}
                      placeholder={"Track type"}
                    >
                      <MenuItem value={""}>All</MenuItem>
                      <MenuItem value={"music"}>Music</MenuItem>
                      <MenuItem value={"ad"}>Ad</MenuItem>
                    </SelectFilter>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Artist</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Track type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {
                audioTracks.map((audioTrack: AudioTrack) => {
                  return (
                    <TableRow key={audioTrack.id}>
                      <TableCell>
                        <PlayButton audioTrack={audioTrack}/>
                      </TableCell>
                      <TableCell>{audioTrack.artist}</TableCell>
                      <TableCell>{audioTrack.title}</TableCell>
                      <TableCell>{audioTrack.genre}</TableCell>
                      <TableCell>{audioTrack.track_type}</TableCell>
                      <TableCell>
                        {`${(audioTrack.size / 2 ** 20).toFixed(2)} MB`}
                      </TableCell>
                      <TableCell>
                        {`${(audioTrack.length / 60).toFixed(0)}:${audioTrack.length % 60}`}
                      </TableCell>
                      <TableCell
                        sx={{textAlign: 'right'}}
                      >
                        <Tooltip title="Edit">
                        <IconButton onClick={() => setEditing(audioTrack)}>
                          <EditIcon fontSize="small"/>
                        </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => setDeleting(audioTrack)}>
                            <DeleteIcon fontSize="small"/>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <Box display="inline-block">
                    <PaginationFilter 
                      pageSize={100}
                      count={count}
                    />
                  </Box>
                  {count} audio track results
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Grid>
      </Grid>
    </>
  )
}


const mapStateToProps = (state: AppState) => ({
  filtersKey: state.filters.filtersKey,
  filters: state.filters.filters
})


export default connect(mapStateToProps)(ListView);