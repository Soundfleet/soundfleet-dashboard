import { store } from "../../redux/store";
import { AudioItem } from "../interfaces/AudioItem";
import {
  PLAYBACK_ENDED,
  PLAYBACK_PAUSED,
  PLAYBACK_RESUMED, PLAYBACK_SEEKED,
  PLAYBACK_STARTED, PLAYBACK_TIME_UPDATED, VOLUME_SET
} from "./types";


const dispatchEndAudioEvent = (audioItem: AudioItem) => {
  return function () {
    store.dispatch({
      type: PLAYBACK_ENDED,
      payload: audioItem
    })
  }
};


const dispatchTimeUpdate = (audioItem: AudioItem) => {
  return function () {
    store.dispatch({
      type: PLAYBACK_TIME_UPDATED,
      payload: audioItem.audioElement.currentTime
    })
  }
};


export const play = (audioItem: AudioItem) => {
  audioItem.audioElement.addEventListener(
    "ended",
    dispatchEndAudioEvent(audioItem)
  );
  audioItem.audioElement.addEventListener(
    "timeupdate",
    dispatchTimeUpdate(audioItem)
  );
  audioItem.audioElement.play();
  return {
    type: PLAYBACK_STARTED,
    payload: audioItem
  }
};


export const stop = (audioItem: AudioItem) => {
  audioItem.audioElement.removeEventListener(
    "ended",
    dispatchEndAudioEvent(audioItem)
  );
  audioItem.audioElement.removeEventListener(
    "timeupdate",
    dispatchTimeUpdate(audioItem)
  );
  audioItem.audioElement.pause();
  audioItem.audioElement.remove();
  return {
    type: PLAYBACK_ENDED,
    payload: audioItem
  }
};


export const pause = (audioItem: AudioItem) => {
  audioItem.audioElement.pause();
  return {
    type: PLAYBACK_PAUSED,
  }
};


export const resume = (audioItem: AudioItem) => {
  audioItem.audioElement.play();
  return {
    type: PLAYBACK_RESUMED,
  }
};


export const seek = (audioItem: AudioItem, position: number) => {
  audioItem.audioElement.currentTime = position;
  return {
    type: PLAYBACK_SEEKED,
    payload: position
  }
};


export const setVolume = (audioItem: AudioItem, volume: number) => {
  audioItem.audioElement.volume = volume;
  return {
    type: VOLUME_SET,
    payload: volume
  }
};
