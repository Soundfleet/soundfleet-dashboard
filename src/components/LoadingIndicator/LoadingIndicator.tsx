import { LinearProgress } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { AppState } from "../../redux/store";


const LoadingIndicator: React.FC<{loading: number}> = (
  {
    loading
  }
) => {
  return loading > 0 ? (
    <LinearProgress style={{
      position: "fixed",
      top: 0,
      zIndex: 9001,
      width: "100%",
    }}/>
  ) : <></>
}


const mapStateToProps = (state: AppState) => ({
  loading: state.appLoading.loading
})


export default connect(mapStateToProps)(LoadingIndicator);
