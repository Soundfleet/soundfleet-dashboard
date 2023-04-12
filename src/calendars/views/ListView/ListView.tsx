import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import useAuth from "../../../auth/hooks/useAuth";
import Filters, { TextInputFilter } from "../../../filters/components/Filters";
import ApiClient from "../../../utils/ApiClient";
import { Calendar } from "../../interfaces/Calendar";
import AddIcon from "@mui/icons-material/Add";
import CalendarForm from "../../components/CalendarForm";
import PaginationFilter from "../../../filters/components/Filters/PaginationFilter";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import { AppState } from "../../../redux/store";
import { connect } from "react-redux";
import ConfirmationDialog from "../../../components/ConfirmationDialog";


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
  const [calendars, setCalendars] = React.useState<Calendar[]>([]);
  const [count, setCount] = React.useState<number>(0);
  const [editing, setEditing] = React.useState<Calendar | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Calendar | null>(null);

  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (filters !== undefined && filtersKey === 'calendars') {
      const searchParams = new URLSearchParams(filters);
      apiClient.get(
        "/calendars/",
        {...Object.fromEntries(searchParams.entries())}
      ).then((response) => {
        setCalendars(response.data.results);
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
            <DialogTitle>Edit calendar</DialogTitle>
            <DialogContent>
              <CalendarForm 
                enabled
                calendar={editing} 
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
        <DialogTitle>Add new calendar</DialogTitle>
        <DialogContent>
            <CalendarForm 
              enabled
              onSuccess={handleCreate} 
              onCancel={() => setCreateDialogOpen(false)}
            />
        </DialogContent>
      </>
    </Dialog>
  )

  const handleDelete = (calendar: Calendar) => {
    const apiClient = new ApiClient(auth.session?.access);
    apiClient.delete(
      `/calendars/${calendar.id}/`
    ).then(() => {
      toast.success('Calendar deleted successfully.');
      calendars.splice(calendars.findIndex((obj: Calendar) => obj.id === deleting?.id), 1)
      setCalendars([...calendars]);
      setDeleting(null);
    }).catch(exception => {
      toast.error(exception.message)
    })
  }
  
  const handleEdit = (calendar: Calendar) => {
    calendars.splice(calendars.findIndex((obj: Calendar) => obj.id === calendar?.id), 1, calendar)
    setCalendars([...calendars]);
    setEditing(null);
  }

  const handleCreate = (calendar: Calendar) => {
    setCreateDialogOpen(false);
    setCalendars([calendar, ...calendars]);
    setCount((current) => {
      return current + 1;
    })
  }

  return (
    <>
      {editDialog()}
      {createDialog()}
      <ConfirmationDialog 
        open={deleting !== null} 
        title="Delete calendar"
        variant="error"
        onConfirm={() => handleDelete(deleting!)}
        onCancel={() => setDeleting(null)}
      >
        Are you sure you want to delete calendar? This action is irreversible.
      </ConfirmationDialog>
      <Filters
        filtersKey="calendars"
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
            <Typography variant="h4">Calendars</Typography>
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
                    placeholder="Search calendars"
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
                calendars.map((calendar: Calendar) => {
                  return (
                    <TableRow key={calendar.id}>
                      <TableCell>
                        <Link to={`/calendars/${calendar.id}/`}>{calendar.name}</Link>
                      </TableCell>
                      <TableCell
                        sx={{textAlign: "right"
                      }}>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => setEditing(calendar)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => setDeleting(calendar)}>
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
                  {count} calendar results
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