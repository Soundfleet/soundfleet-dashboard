import React from "react";
import useAuth from "../../auth/hooks/useAuth";
import ApiClient from "../../utils/ApiClient";
import { Card, CardContent, Grid, Typography } from "@mui/material";


interface DashboardData {
  devices_count: number,
  uploaded_tracks: number,
  used_disk_space: number
}


const HomePage: React.FC = () => {
  const auth = useAuth();
  const apiClient = new ApiClient(auth.session?.access);

  const [data, setData] = React.useState<DashboardData | undefined>(undefined);

  React.useEffect(() => {
    if (data === undefined) {
      apiClient.get(
        "/"
      ).then(
        response => {
          setData(response.data);
        }
      )
    }
  }, [apiClient])
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">
              {data?.devices_count}
            </Typography>
            <Typography variant="subtitle1">
              Devices
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">
              {data?.uploaded_tracks}
            </Typography>
            <Typography variant="subtitle1">
              Uploaded tracks
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">
              {`${((data?.used_disk_space || 0) / Math.pow(2, 30)).toFixed(2)} GB`}
            </Typography>
            <Typography variant="subtitle1">
              Used disk space
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}


export default HomePage;