import {
  PLAYBACK_ENDED,
  PLAYBACK_PAUSED,
  PLAYBACK_RESUMED,
  PLAYBACK_SEEKED,
  PLAYBACK_STARTED,
  PLAYBACK_STOPPED,
  PLAYBACK_TIME_UPDATED,
  PlayerAction,
  PlayerState,
  VOLUME_SET
} from "./types";


export const playerReducer = (
  state: PlayerState = {},
  action: PlayerAction
): PlayerState => {
  switch (action.type) {
    case PLAYBACK_STARTED:
      return {
        ...state,
        current: action.payload,
        position: 0,
        paused: false,
        volume: action.payload.audioElement.volume
      };

    case PLAYBACK_PAUSED:
      return {
        ...state,
        paused: true,
      };

    case PLAYBACK_RESUMED:
      return {
        ...state,
        paused: false,
      };

    case PLAYBACK_STOPPED:
      return {
        ...state,
        current: undefined,
        position: undefined,
        paused: undefined
      };

    case PLAYBACK_ENDED:
      return {
        ...state,
        current: undefined,
        position: undefined,
        paused: undefined
      };

    case PLAYBACK_TIME_UPDATED:
      return {
        ...state,
        position: action.payload
      };

    case PLAYBACK_SEEKED:
      return {
        ...state,
        position: action.payload
      };

    case VOLUME_SET:
      return {
        ...state,
        volume: action.payload
      };

    default:
      return state;
  }

};
