import { AudioItem } from "../interfaces/AudioItem";

export const PLAYBACK_STARTED = "PLAYBACK_STARTED";
export const PLAYBACK_ENDED = "PLAYBACK_ENDED";
export const PLAYBACK_PAUSED = "PLAYBACK_PAUSED";
export const PLAYBACK_RESUMED = "PLAYBACK_RESUMED";
export const PLAYBACK_STOPPED = "PLAYBACK_STOPPED";
export const PLAYBACK_TIME_UPDATED = "PLAYBACK_TIME_UPDATED";
export const PLAYBACK_SEEKED = "PLAYBACK_SEEKED";
export const VOLUME_SET = "VOLUME_SET"


export type PlaybackStartedAction = {
  type: typeof PLAYBACK_STARTED,
  payload: AudioItem
}


export type PlaybackEndedAction = {
  type: typeof PLAYBACK_ENDED,
  payload: AudioItem
}


export type PlaybackPausedAction = {
  type: typeof PLAYBACK_PAUSED,
}


export type PlaybackResumedAction = {
  type: typeof PLAYBACK_RESUMED,
}


export type PlaybackStoppedAction = {
  type: typeof PLAYBACK_STOPPED,
}


export type PlaybackTimeUpdatedAction = {
  type: typeof PLAYBACK_TIME_UPDATED,
  payload: number
}


export type PlaybackSeekedAction = {
  type: typeof PLAYBACK_SEEKED,
  payload: number
}


export type SetVolumeAction = {
  type: typeof VOLUME_SET,
  payload: number
}


export type PlayerState = {
  current?: AudioItem,
  position?: number,
  volume?: number,
  paused?: boolean
}


export type PlayerAction = (
  PlaybackStartedAction
  | PlaybackEndedAction
  | PlaybackPausedAction
  | PlaybackResumedAction
  | PlaybackStoppedAction
  | PlaybackTimeUpdatedAction
  | PlaybackSeekedAction
  | SetVolumeAction
)
