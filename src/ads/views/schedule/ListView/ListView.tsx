import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import useAuth from "../../../../auth/hooks/useAuth";
import Filters, { TextInputFilter } from "../../../../filters/components/Filters";
import PaginationFilter from "../../../../filters/components/Filters/PaginationFilter";
import { AppState } from "../../../../redux/store";
import { Schedule } from "../../../interfaces/Schedule";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiClient from "../../../../utils/ApiClient";
import toast from "react-hot-toast";
import ScheduleForm from "../../../components/ScheduleForm";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";

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
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [count, setCount] = React.useState<number>(0);
  const [editing, setEditing] = React.useState<Schedule | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Schedule | null>(null);

  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (filters !== undefined && filtersKey === 'adSchedules') {
      const searchParams = new URLSearchParams(filters);
      apiClient.get(
        "/ads/schedules/",
        {...Object.fromEntries(searchParams.entries())}
      ).then(
        response => {
          setSchedules(response.data.results);
          setCount(response.data.count);
        }
      ).catch(exception => toast.error(exception.message));
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
            <DialogTitle>Edit ad schedule</DialogTitle>
            <DialogContent>
              <ScheduleForm 
                enabled
                schedule={editing} 
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
        <DialogTitle>Add new ad schedule</DialogTitle>
        <DialogContent>
            <ScheduleForm 
              enabled
              onSuccess={handleCreate} 
              onCancel={() => setCreateDialogOpen(false)}
            />
        </DialogContent>
      </>
    </Dialog>
  )

  const handleDelete = (schedule: Schedule) => {
    const apiClient = new ApiClient(auth.session?.access);
    apiClient.delete(
      `/ads/schedules/${schedule.id}/`
    ).then(() => {
      toast.success('Schedule deleted successfully.');
      schedules.splice(schedules.findIndex((obj: Schedule) => obj.id === deleting?.id), 1)
      setSchedules([...schedules]);
      setDeleting(null);
      setCount(current => {
        return current - 1;
      })
    }).catch(exception => {
      toast.error(exception.message)
    })
  }
  
  const handleEdit = (schedule: Schedule) => {
    schedules.splice(schedules.findIndex((obj: Schedule) => obj.id === schedule.id), 1, schedule)
    setSchedules([...schedules]);
    setEditing(null);
  }

  const handleCreate = (schedule: Schedule) => {
    setCreateDialogOpen(false);
    setSchedules([schedule, ...schedules]);
    setCount(current => {
      return current + 1;
    })
  }
  
  return (
    <>
      {editDialog()}
      {createDialog()}
      <ConfirmationDialog 
        open={deleting !== null} 
        title="Delete ad schedule"
        variant="error"
        onConfirm={() => handleDelete(deleting!)}
        onCancel={() => setDeleting(null)}
      >
        Are you sure you want to delete ad schedule? This action is irreversible.
      </ConfirmationDialog>
      <Filters
        filtersKey="adSchedules"
        filtersConf={[
          {
            queryParam: "search",
            filterParam: "search",
          },
          {
            queryParam: "page",
            filterParam: "page",
          },
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h4">Ad schedules</Typography>
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
                  colSpan={2}
                  sx={{
                    paddingLeft: 0
                  }}
                >
                  <TextInputFilter
                    size="small" 
                    queryParam="search" 
                    placeholder="Search schedules"
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
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                schedules.map((schedule: Schedule) => {
                  return (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <Link to={`/ads/schedules/${schedule.id}/`}>{schedule.name}</Link>
                      </TableCell>
                      <TableCell
                        sx={{textAlign: "right"
                      }}>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => setEditing(schedule)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => setDeleting(schedule)}>
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
                  {count} schedule results
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