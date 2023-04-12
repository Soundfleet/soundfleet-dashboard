import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { connect } from "react-redux";
import { useAuth } from "../../../../auth/providers/AuthProvider";
import Filters, { TextInputFilter } from "../../../../filters/components/Filters";
import { AppState } from "../../../../redux/store";
import ApiClient from "../../../../utils/ApiClient";
import { Playlist } from "../../../interfaces/Playlist";
import SearchIcon from '@mui/icons-material/Search';
import PaginationFilter from "../../../../filters/components/Filters/PaginationFilter";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import PlaylistForm from "../../../components/PlaylistForm";


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
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const [count, setCount] = React.useState<number>(0);
  const [editing, setEditing] = React.useState<Playlist | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Playlist | null>(null);

  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (filters !== undefined && filtersKey === 'musicPlaylists') {
      const searchParams = new URLSearchParams(filters);
      apiClient.get(
        "/music/playlists/",
        {...Object.fromEntries(searchParams.entries())}
      ).then((response) => {
        setPlaylists(response.data.results);
        setCount(response.data.count);
      }).catch(exception => toast.error(exception.message));
    }
  }, [auth.session?.access, filtersKey, filters])

  const editDialog = () => (
    <Dialog
      open={editing !== null}
      onClose={() => setEditing(null)}
    >
      {
        editing !== null ? (
          <>
            <DialogTitle>Edit playlist</DialogTitle>
            <DialogContent>
              <PlaylistForm 
                enabled
                playlist={editing} 
                onSuccess={handleEdit} 
                onCancel={() => setEditing(null)}
              />
            </DialogContent>
          </>
        ) : <></>
      }
    </Dialog>
  )

  const createDialog = () => (
    <Dialog
      open={createDialogOpen}
      onClose={() => setCreateDialogOpen(false)}
    >
      <>
        <DialogTitle>Add new playlist</DialogTitle>
        <DialogContent>
            <PlaylistForm 
              enabled
              onSuccess={handleCreate} 
              onCancel={() => setCreateDialogOpen(false)}
            />
        </DialogContent>
      </>
    </Dialog>
  )

  const handleDelete = (playlist: Playlist) => {
    const apiClient = new ApiClient(auth.session?.access);
    apiClient.delete(
      `/music/playlists/${playlist.id}/`
    ).then(() => {
      toast.success('Playlist deleted successfully.');
      playlists.splice(playlists.findIndex((obj: Playlist) => obj.id === deleting?.id), 1)
      setPlaylists([...playlists]);
      setDeleting(null);
    }).catch(exception => {
      toast.error(exception.message)
    })
  }
  
  const handleEdit = (playlist: Playlist) => {
    playlists.splice(playlists.findIndex((obj: Playlist) => obj.id === playlist?.id), 1, playlist)
    setPlaylists([...playlists]);
    setEditing(null);
  }

  const handleCreate = (playlist: Playlist) => {
    setCreateDialogOpen(false);
    setPlaylists([playlist, ...playlists]);
    setCount((current) => {
      return current + 1;
    })
  }
  
  return (
    <>
      {createDialog()}
      {editDialog()}
      <ConfirmationDialog 
        open={deleting !== null} 
        title="Delete playlist"
        variant="error"
        onConfirm={() => handleDelete(deleting!)}
        onCancel={() => setDeleting(null)}
      >
        Are you sure you want to delete playlist? This action is irreversible.
      </ConfirmationDialog>
      <Filters
        filtersKey="musicPlaylists"
        filtersConf={[
          {
            queryParam: "search", 
            filterParam: "search"
          },
          {
            queryParam: "page",
            filterParam: "page"
          },
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h4">Music playlists</Typography>
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  colSpan={4}
                  sx={{
                    paddingLeft: 0
                  }}
                >
                  <TextInputFilter
                    size="small" 
                    queryParam="search" 
                    placeholder="Search playlists"
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
                <TableCell>Name</TableCell>
                <TableCell>Label</TableCell>
                <TableCell># of tracks</TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                playlists.map((playlist: Playlist) => {
                  return (
                    <TableRow key={playlist.id}>
                      <TableCell>
                        <Link to={`/music/playlists/${playlist.id}/`}>{playlist.name}</Link>
                      </TableCell>
                      <TableCell>
                        <Chip
                          sx={{
                            backgroundColor: `${playlist.label_color}`
                          }}
                          label={playlist.label_color}
                        />
                      </TableCell>
                      <TableCell>{playlist.track_count}</TableCell>
                      <TableCell
                        sx={{textAlign: "right"
                      }}>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => setEditing(playlist)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => setDeleting(playlist)}>
                            <DeleteIcon />
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
                <TableCell colSpan={4}>
                  <Box display="inline-block">
                    <PaginationFilter 
                      pageSize={100}
                      count={count}
                    />
                  </Box>
                  {count} playlist results
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