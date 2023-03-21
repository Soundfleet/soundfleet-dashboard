import axios from "axios";
import { UploadedFile } from "../interfaces/UploadedFile";
import { FILES_ADDED, FILE_REMOVED, FILE_UPDATED, UploadAction, UploadState } from "./types";

export const uploadReducer = (
  state: UploadState = {
    files: {},
    currentFile: null,
    uploading: false,
  },
  action: UploadAction
): UploadState => {
  const files: {[filename: string]: UploadedFile} = state.files || {};

  switch(action.type) {
    case FILES_ADDED:
      action.payload.forEach(file => {
        files[file.name] = {
          file: file,
          track_type: "music",
          artist: "",
          title: "",
          genre: "",
          uploadProgress: 0,
          cancelTokenSource: axios.CancelToken.source()
        }
      })
      return {
        ...state,
        files: {...files}
      }
    case FILE_REMOVED:
      delete files[action.payload];
      return {
        ...state,
        files: {...files}
      }

    case FILE_UPDATED:
      files[action.payload.file.name] = action.payload;
      return {
        ...state,
        files: {...files}
      }

    default:
      return state
  }
}