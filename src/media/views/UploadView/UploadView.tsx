import { Grid, Typography } from "@mui/material";
import Upload from "../../components/Upload";


const UploadView: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Upload audio tracks
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Upload />
      </Grid>
    </Grid>
  )
}


export default UploadView;