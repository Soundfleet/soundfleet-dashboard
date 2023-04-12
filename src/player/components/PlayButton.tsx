import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../redux/store";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { AudioTrack } from "../../media/interfaces/AudioTrack";
import { AudioItem } from "../interfaces/AudioItem";
import { IconButton, IconButtonProps } from "@mui/material";
import { play, stop } from "../redux/actions";


interface PlayButtonProps extends IconButtonProps {
  audioTrack: AudioTrack,
  current?: AudioItem,
  play: (audioItem: AudioItem) => void,
  stop: (audioItem: AudioItem) => void,
}


const PlayButton: React.FC<PlayButtonProps> = (props) => {
  const {audioTrack, current, play, stop, ...rest} = props;

  const handlePlay = () => {
    current && stop(current);
    const audioItem: AudioItem = {
      trackId: audioTrack.id,
      audioElement: new Audio(audioTrack.url)
    };
    play(audioItem)
  };

  const handleStop = () => {
    current && stop(current);
  };

  return current?.trackId === audioTrack.id ? (
    <IconButton onClick={handleStop} {...rest}>
      <StopIcon />
    </IconButton>
  ) : (
    <IconButton onClick={handlePlay} {...rest}>
      <PlayArrowIcon />
    </IconButton>
  )
};


const mapStateToProps = (state: AppState) => ({
  current: state.player.current,
});


const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  play: (audioItem: AudioItem) => dispatch(play(audioItem)),
  stop: (audioItem: AudioItem) => dispatch(stop(audioItem))
});


export default connect(mapStateToProps, mapDispatchToProps)(PlayButton);
