import {
  Box,
  IconButton,
  Slider,
  Toolbar, useTheme
} from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../redux/store";
import { pause, resume, seek, setVolume, stop } from "../redux/actions";
import { AudioItem } from "../interfaces/AudioItem";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ExpandIcon from '@mui/icons-material/Fullscreen';
import ShrinkIcon from '@mui/icons-material/FullscreenExit';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import VolumeMute from '@mui/icons-material/VolumeMute';
import StopIcon from "@mui/icons-material/Stop";


type PlayerProps = {
  current?: AudioItem,
  position?: number,
  volume?: number,
  paused?: boolean,
  pause: (audioItem: AudioItem) => void,
  resume: (audioItem: AudioItem) => void,
  seek: (audioItem: AudioItem, position: number) => void,
  setVolume: (audioItem: AudioItem, position: number) => void,
  stop: (audioItem: AudioItem) => void,
}


const formatTime = (seconds: number) => {
  const m = Math.trunc(seconds / 60);
  const s = Math.trunc(seconds - m * 60);
  return `${m}:${("0" + s).slice(-2)}`
};


const Player: React.FC<PlayerProps> = (
  {
    current,
    position,
    volume,
    paused,
    pause,
    resume,
    seek,
    setVolume,
    stop
  }
) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const [width, setWidth] = React.useState<number>(160);
  const ref = React.useRef(null);

  const handleResume = () => {
    current !== undefined && resume(current);
  };

  const handlePause = () => {
    current !== undefined && pause(current);
  };

  const handleSeek = (position: number) => {
    current !== undefined && seek(current, position);
  };

  const handleStop = () => {
    current !== undefined && stop(current);
  };

  const handleVolumeChange = (volume: number) => {
    current !== undefined && setVolume(current, volume);
  };

  React.useEffect(() => {
    const el: any = ref.current;
    el && setWidth(Math.max(el.getBoundingClientRect().width, 160));
  }, [expanded, current])

  return (
    <Box
      ref={ref}
      position="fixed"
      bottom={0}
      left={`calc(50% - ${width / 2}px)`}
      padding={0}
      sx={{
        background: theme.palette.primary.main,
        borderRadius: "8px 8px 0 0"
      }}
    >
      {
        current && <Toolbar variant={"dense"}>
          {
            paused ? (
              <IconButton
                aria-label={"play"}
                onClick={handleResume}
                sx={{color: theme.palette.grey[100]}}
              >
                <PlayArrowIcon/>
              </IconButton>
            ) : (
              <IconButton
                aria-label={"pause"}
                onClick={handlePause}
                sx={{color: theme.palette.grey[100]}}
              >
                <PauseIcon/>
              </IconButton>
            )
          }
          <IconButton
            aria-label={"stop"}
            onClick={handleStop}
            sx={{color: theme.palette.grey[100]}}
          >
            <StopIcon/>
          </IconButton>
          {
            expanded ? (
              <>
                <Box width={30} marginRight="16px" padding="4px" color={theme.palette.grey[100]}>
                  {formatTime(current?.audioElement.currentTime || 0)}
                </Box>
                <Box width="150px">
                  <Slider
                    defaultValue={0}
                    value={position}
                    min={0}
                    max={(current && current.audioElement.duration) || 0}
                    onChange={(e, value) => handleSeek(value as number)}
                    sx={{
                      color: theme.palette.grey[100],
                      mt: "4px"
                    }}
                  />
                </Box>
                <Box width={30} marginLeft="16px" padding="4px" color={theme.palette.grey[100]}>
                  {formatTime(current?.audioElement.duration || 0)}
                </Box>
                <Box width={30} marginLeft={4} color={theme.palette.grey[100]}>
                  {
                    volume && volume > 0.6 ? (
                      <VolumeUp
                        fontSize={"small"}
                        sx={{
                          color: theme.palette.grey[100]
                        }}
                      />
                    ) : (volume && volume < 0.6) && (volume && volume > 0) ? (
                      <VolumeDown 
                        fontSize={"small"}
                        sx={{
                          color: theme.palette.grey[100]
                        }}
                      />
                    ) : (
                      <VolumeMute 
                        fontSize={"small"}
                        sx={{
                          color: theme.palette.grey[100]
                        }}
                      />
                    )
                  }
                </Box>
                <Box width={150}>
                  <Slider
                    defaultValue={1}
                    value={volume}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(e, value) => handleVolumeChange(value as number)}
                    sx={{
                      color: theme.palette.grey[100],
                      mt: "4px"
                    }}
                  />
                </Box>
              </>
            ) : null
          }
          {
            expanded ? (
              <IconButton
                aria-label={"shrink"}
                onClick={() => setExpanded(false)}
                sx={{
                  color: theme.palette.grey[100],
                  marginLeft: "16px"
                }}
              >
                <ShrinkIcon/>
              </IconButton>
            ) : (
              <IconButton
                aria-label={"expand"}
                onClick={() => setExpanded(true)}
                sx={{
                  color: theme.palette.grey[100],
                  marginLeft: "16px"
                }}
              >
                <ExpandIcon/>
              </IconButton>
            )
          }
        </Toolbar>
      }
    </Box>
  )
};


const mapStateToProps = (state: AppState) => ({
  current: state.player.current,
  position: state.player.position,
  volume: state.player.volume,
  paused: state.player.paused
});


const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  pause: (audioItem: AudioItem) => dispatch(pause(audioItem)),
  resume: (audioItem: AudioItem) => dispatch(resume(audioItem)),
  seek: (audioItm: AudioItem, position: number) => dispatch(seek(audioItm, position)),
  setVolume: (audioItem: AudioItem, volume: number) => dispatch(setVolume(audioItem, volume)),
  stop: (audioItem: AudioItem) => dispatch(stop(audioItem))
});



export default connect(mapStateToProps, mapDispatchToProps)(Player);
