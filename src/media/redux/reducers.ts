import { UploadedFile } from "../interfaces/UploadedFile";
import { 
  FILES_ADDED, 
  FILE_REMOVED, 
  FILE_UPDATED, 
  UploadAction, 
  UPLOADING_FINISHED, 
  UPLOADING_STARTED, 
  UploadState, 
  UPLOADING_CANCELED, 
  UPLOAD_FINISHED, 
  UPLOAD_STARTED 
} from "./types";

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

    case UPLOADING_STARTED:
      return {
        ...state,
        uploading: true
      }

    case UPLOADING_FINISHED:
      return {
        ...state,
        uploading: false
      }

    case UPLOAD_STARTED:
      return {
        ...state,
        currentFile: action.payload
      }

    case UPLOAD_FINISHED:
      return {
        ...state,
        currentFile: null
      }

    case UPLOADING_CANCELED:
      return {
        ...state,
        currentFile: null,
        uploading: false
      }

    default:
      return state
  }
}