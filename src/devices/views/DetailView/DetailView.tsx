import { Box, Button, Grid, Typography } from "@mui/material";
import SyncIcon from '@mui/icons-material/Sync';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DeviceForm from "../../components/DeviceForm";
import { useMatch } from "react-router-dom";
import React from "react";
import { useAuth } from "../../../auth/providers/AuthProvider";
import ApiClient from "../../../utils/ApiClient";
import { Device } from "../../interfaces/Device";
import { toast } from "react-hot-toast";


const DetailView: React.FC = () => {
  const auth = useAuth();
  const apiClient = new ApiClient(auth.session?.access);
  const match = useMatch("/devices/:uuid");
  const [device, setDevice] = React.useState<Device | undefined | null>(undefined);

  React.useEffect(() => {
    if (device === undefined) {
      apiClient.get(
        `/devices/${match?.params.uuid}/`,
        {}
      ).then(
        response => setDevice(response.data)
      ).catch(
        exception => {
          if (exception.response.status !== 404) {
            toast.error(exception.message)
          }
          setDevice(null)
        }
      )
    }
  })

  const handleSync = (device: Device) => {
    apiClient.post(
      `/devices/commands/sync/`,
      {devices: [device.uuid]}
    ).then(
      response => toast.success(`Started sync task: ${response.data.id}`)
    ).catch(exception => toast.error(exception.message));
  }

  const handleDeploy = (device: Device) => {
    apiClient.post(
      `/devices/commands/deploy/`,
      {devices: [device.uuid]}
    ).then(
      response => toast.success(`Started deploy task: ${response.data.id}`)
    ).catch(exception => toast.error(exception.message));
  }

  if (device === undefined) {
    return <></>
  }
  else if (device === null) {
    return <>Device not found</>
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{display: "flex"}}>
        <Box>
          <Typography variant="h4">Device details</Typography>
        </Box>
        <Box flexGrow={1}/>
        <Box>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<SyncIcon />}
            onClick={() => handleSync(device)}
            disabled={!device.connected}
          >
            Sync
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<RocketLaunchIcon />}
            sx={{ml: 2}}
            onClick={() => handleDeploy(device)}
            disabled={!device.connected}
          >
            Deploy
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DeviceForm device={device}/>
      </Grid>
    </Grid>
  )
}


export default DetailView;