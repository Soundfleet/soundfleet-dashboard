import { Box, Button, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistForm from "../../../components/PlaylistForm";
import { Link, useMatch } from "react-router-dom";
import React from "react";
import useAuth from "../../../../auth/hooks/useAuth";
import ApiClient from "../../../../utils/ApiClient";
import { Playlist } from "../../../interfaces/Playlist";
import { toast } from "react-hot-toast";
import { MusicTrack } from "../../../interfaces/MusicTrack";
import { connect } from "react-redux";
import { AppState } from "../../../../redux/store";
import Filters, { TextInputFilter } from "../../../../filters/components/Filters";
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import PlayButton from "../../../../player/components/PlayButton";
import PaginationFilter from "../../../../filters/components/Filters/PaginationFilter";


interface DetailViewProps {
  filtersKey: string | undefined,
  filters: string | undefined
}

const DetailView: React.FC<DetailViewProps> = (
  {
    filtersKey,
    filters
  }
) => {
  const auth = useAuth();
  const match = useMatch("/music/playlists/:id/");
  const [playlist, setPlaylist] = React.useState<Playlist | undefined | null>(undefined);
  const [musicTracks, setMusicTracks] = React.useState<MusicTrack[]>([]);
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (playlist === undefined) {
      apiClient.get(
        `/music/playlists/${match?.params.id}/`
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
    if (playlist && filtersKey === 'musicTracks' && filters !== undefined) {
      const searchParams = new URLSearchParams(filters);
      apiClient.get(
        `/music/playlists/${playlist.id}/tracks/`,
        {...Object.fromEntries(searchParams.entries())}
      ).then(
        response => {
          setMusicTracks(response.data.results);
          setCount(response.data.count);
        }
      ).catch(
        exception => {
          toast.error(exception.message);
        }
      )
    }
  }, [auth.session?.access, playlist, filtersKey, filters])

  const handleRemove = (musicTrack: MusicTrack) => {
    const apiClient = new ApiClient(auth.session?.access);
    apiClient.delete(
      `/music/playlists/${playlist?.id}/tracks/${musicTrack.id}/`
    ).then(
      () => {
        toast.success('Music track removed successfully.');
        musicTracks.splice(musicTracks.findIndex((obj: MusicTrack) => obj.id === musicTrack.id), 1);
        setMusicTracks([...musicTracks]);
      }
    ).catch(
      exception => toast.error(exception.message)
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
        filtersKey="musicTracks"
        filtersConf={[
          {
            queryParam: "search",
            filterParam: "search"
          },
          {
            queryParam: "page",
            filterParam: "page"
          }
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h4">Playlist detail</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <PlaylistForm 
            playlist={playlist}
            onSuccess={(playlist) => setPlaylist(playlist)}
          />
        </Grid>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h5">Track list</Typography>
          </Box>
          <Box flexGrow={1}/>
          <Box>
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<PlaylistAddIcon />}
              component={Link}
              to={`/music/playlists/${playlist.id}/add-tracks/?track_type=music`}
            >
              Add
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
                musicTracks.map((mt: MusicTrack) => (
                  <TableRow key={mt.id}>
                    <TableCell>
                      <PlayButton audioTrack={mt.track}/>
                    </TableCell>
                    <TableCell>{mt.track.artist}</TableCell>
                    <TableCell>{mt.track.title}</TableCell>
                    <TableCell>{mt.track.genre}</TableCell>
                      <TableCell>{mt.track.track_type}</TableCell>
                      <TableCell>
                        {`${(mt.track.size / 2 ** 20).toFixed(2)} MB`}
                      </TableCell>
                      <TableCell>
                        {`${(mt.track.length / 60).toFixed(0)}:${mt.track.length % 60}`}
                      </TableCell>
                      <TableCell
                        sx={{textAlign: 'right'}}
                      >
                        <Tooltip title={`Remove from ${playlist.name}`}>
                          <IconButton onClick={() => handleRemove(mt)}>
                            <RemoveIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                  </TableRow>
                ))
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
                  {count} music track results
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


export default connect(mapStateToProps)(DetailView);