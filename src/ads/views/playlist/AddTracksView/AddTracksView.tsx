import { Box, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import React from "react";
import toast from "react-hot-toast";
import { connect } from "react-redux";
import { useMatch } from "react-router-dom";
import { useAuth } from "../../../../auth/providers/AuthProvider"
import Filters, { TextInputFilter } from "../../../../filters/components/Filters";
import PaginationFilter from "../../../../filters/components/Filters/PaginationFilter";
import { SelectFilter } from "../../../../filters/components/Filters/SelectFilter";
import { AudioTrack } from "../../../../media/interfaces/AudioTrack";
import PlayButton from "../../../../player/components/PlayButton";
import { AppState } from "../../../../redux/store";
import ApiClient from "../../../../utils/ApiClient";
import { Playlist } from "../../../interfaces/Playlist";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";


interface AddTracksViewProps {
  filtersKey: string | undefined,
  filters: string | undefined,
}


const AddTracksView: React.FC<AddTracksViewProps> = (
  {
    filtersKey,
    filters
  }
) => {
  const auth = useAuth();
  const match = useMatch("/ads/playlists/:id/add-tracks/");
  const [playlist, setPlaylist] = React.useState<Playlist | undefined | null>(undefined);
  const [audioTracks, setAudioTracks] = React.useState<AudioTrack[]>([]);
  const [count, setCount] = React.useState<number>(0);
  
  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (playlist === undefined) {
      apiClient.get(
        `/ads/playlists/${match?.params.id}/`
      ).then(
        response => {
          setPlaylist(response.data);
        }
      ).catch(
        exception => {
          if (exception.response.status !== 404) {
            toast.error(exception.message)
          }
          setPlaylist(null)
        }
      )
    }
  })

  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (playlist && filters !== undefined && filtersKey === 'addAdTracks') {
      const searchParams = new URLSearchParams(filters);
      apiClient.get(
        `/media/audio-tracks/`,
        {
          ...Object.fromEntries(searchParams.entries()),
          ad_playlist: playlist.id
        }
      ).then(
        response => {
          setAudioTracks(response.data.results);
          setCount(response.data.count);
        }
      ).catch(exception => toast.error(exception.message));
    }
  }, [auth.session?.access, playlist, filtersKey, filters])

  const handleAdd = (playlist: Playlist, audioTrack: AudioTrack) => {
    const apiClient = new ApiClient(auth.session?.access);
    apiClient.post(
      `/ads/playlists/${playlist.id}/tracks/`,
      {track: audioTrack.id}
    ).then(
      () => {
        toast.success('Successfully added track to playlist');
        audioTracks.splice(audioTracks.findIndex((obj: AudioTrack) => obj.id === audioTrack.id), 1)
        setAudioTracks([...audioTracks]);
        setCount((current) => {
          return current - 1;
        });
      }
    ).catch(
      exception => {
        toast.error(exception.message);
      }
    )
  }

  if (playlist === undefined) {
    return <></>
  }
  else if (playlist === null) {
    return <>Playlist not found</>
  }

  return (
    <>
      <Filters
        filtersKey="addAdTracks"
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
          }
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: "flex" }}>
          <Box>
            <Typography variant="h4">Add tracks to {playlist.name}</Typography>
          </Box>
        </Grid>
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
                      <Tooltip title="Add to playlist">
                        <IconButton onClick={() => handleAdd(playlist, audioTrack)}>
                          <AddIcon />
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
    </>
  )
}


const mapStateToProps = (state: AppState) => ({
  filtersKey: state.filters.filtersKey,
  filters: state.filters.filters,
})


export default connect(mapStateToProps)(AddTracksView);