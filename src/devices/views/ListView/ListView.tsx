import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import React from "react";
import { connect } from "react-redux";
import { useAuth } from "../../../auth/providers/AuthProvider";
import Filters, { TextInputFilter } from "../../../filters/components/Filters";
import { AppState } from "../../../redux/store";
import ApiClient from "../../../utils/ApiClient";
import { Device } from "../../interfaces/Device";
import SearchIcon from '@mui/icons-material/Search';
import PaginationFilter from "../../../filters/components/Filters/PaginationFilter";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeviceForm from "../../components/DeviceForm";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import toast from "react-hot-toast";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PhonelinkIcon from '@mui/icons-material/Phonelink';
import formatDistance from "date-fns/formatDistance";

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
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [count, setCount] = React.useState(0);
  const [editing, setEditing] = React.useState<Device | null>(null);
  const [connecting, setConnecting] = React.useState<Device | null>(null);
  const [connectingErrors, setConnectingErrors] = React.useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Device | null>(null);

  React.useEffect(() => {
    const apiClient = new ApiClient(auth.session?.access);
    if (filters !== undefined && filtersKey === 'deviceList') {
      const searchParams = new URLSearchParams(filters);
      apiClient.get(
        '/devices/',
        {...Object.fromEntries(searchParams.entries())}
      ).then((response) => {
        setDevices(response.data["results"]);
        setCount(response.data["count"]);
      })
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
            <DialogTitle>Edit device</DialogTitle>
            <DialogContent>
                <DeviceForm 
                  enabled
                  device={editing} 
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
        <DialogTitle>Add new device</DialogTitle>
        <DialogContent>
            <DeviceForm 
              enabled
              onSuccess={handleCreate} 
              onCancel={() => setCreateDialogOpen(false)}
            />
        </DialogContent>
      </>
    </Dialog>
  )

  const handleDelete = (device: Device) => {
    const apiClient = new ApiClient(auth.session?.access);
    apiClient.delete(
      `/devices/${device.uuid}/`
    ).then(() => {
      toast.success('Device deleted successfully.');
      devices.splice(devices.findIndex((obj: Device) => obj.uuid === deleting?.uuid), 1)
      setDevices([...devices]);
      setDeleting(null);
    }).catch(exception => {
      toast.error(exception.message)
    })
  }

  const handleConnect = (device: Device) => {
    const apiClient = new ApiClient(auth.session?.access);
    apiClient.post(
      `/devices/${device.uuid}/accept-key/`
    ).then(() => {
      toast.success('Connected deleted successfully.');
      devices.splice(devices.findIndex((obj: Device) => obj.uuid === device?.uuid), 1, {...device, connected: true})
      setDevices([...devices]);
      setConnecting(null);
    }).catch(exception => {
      toast.error(exception.message);
      setConnectingErrors(exception.response.data.toString());
    })
  }
  
  const handleEdit = (device: Device) => {
    devices.splice(devices.findIndex((obj: Device) => obj.uuid === device?.uuid), 1, device)
    setDevices([...devices]);
    setEditing(null);
  }

  const handleCreate = (device: Device) => {
    setCreateDialogOpen(false);
    setDevices([device, ...devices]);
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
        title="Delete device"
        variant="error"
        onConfirm={() => handleDelete(deleting!)}
        onCancel={() => setDeleting(null)}
      >
        Are you sure you want to delete device? This action is irreversible.
      </ConfirmationDialog>
      <ConfirmationDialog 
        open={connecting !== null} 
        title="Connect device"
        variant="info"
        onConfirm={() => handleConnect(connecting!)}
        onCancel={() => {
          setConnecting(null);
          setConnectingErrors("");
        }}
      >
        {
          connectingErrors ? <Alert severity="error">{connectingErrors}</Alert> : <></>
        }
        <Typography>
          You are about to connect device to salt minion service.
          After this action you will be able to deploy player on 
          connected device.
        </Typography>
      </ConfirmationDialog>
      <Filters
        filtersKey="deviceList"
        filtersConf={[
        {
          queryParam: "search",
          filterParam: "search"
        },
        {
          queryParam: "page",
          filterParam: "page",
        }
      ]} />
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{display: "flex"}}>
          <Box>
            <Typography variant="h4">Devices</Typography>
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
                  colSpan={9}
                  sx={{
                    paddingLeft: 0
                  }}
                >
                  <TextInputFilter
                    size="small" 
                    queryParam="search" 
                    placeholder="Search devices"
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
                <TableCell>UUID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Calendar</TableCell>
                <Tooltip title="If set to music then ads will not break playback">
                  <TableCell>
                    Playback priority
                  </TableCell>
                </Tooltip>
                <TableCell>Connection policy</TableCell>
                <TableCell>Timezone</TableCell>
                <TableCell>Last sync</TableCell>
                <Tooltip title="Determines if device is added to inventory by accepting salt minion key">
                  <TableCell>
                    Connected
                  </TableCell>
                </Tooltip>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                devices.map((device: Device) => {
                  return (
                    <TableRow key={device.uuid}>
                      <TableCell>
                        <Link to={`/devices/${device.uuid}/`}>{device.uuid}</Link>
                      </TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.calendar?.name}</TableCell>
                      <TableCell>
                        {device.playback_priority === 'music' ? 'Music over ads' : 'Ads over music'}
                      </TableCell>
                      <TableCell>{device.connection_policy}</TableCell>
                      <TableCell>{device.timezone_name}</TableCell>
                      <TableCell>
                        {
                          device.last_sync ? (
                            formatDistance(new Date(device.last_sync), new Date())
                          ) : null
                        }
                      </TableCell>
                      <TableCell>
                        {
                          device.connected ? <CheckCircleIcon color="success"/> : <RemoveCircleIcon color="error" />
                        }
                      </TableCell>
                      <TableCell
                        sx={{textAlign: "right"
                      }}>
                        {
                          !device.connected ? (
                            <Tooltip title="Connect device">
                              <IconButton onClick={() => setConnecting(device)}>
                                <PhonelinkIcon />
                              </IconButton>
                            </Tooltip>
                          ) : <></>
                        }
                        <Tooltip title="Edit">
                          <IconButton onClick={() => setEditing(device)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => setDeleting(device)}>
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
                <TableCell colSpan={9}>
                  <Box display="inline-block">
                    <PaginationFilter 
                      pageSize={100}
                      count={count}
                    />
                  </Box>
                  {count} device results
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