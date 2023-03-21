import { UploadedFile } from "../interfaces/UploadedFile";
import { 
  FILES_ADDED, 
  FILE_REMOVED, 
  FILE_UPDATED, 
  UPLOADING_FINISHED, 
  UPLOADING_STARTED, 
  UPLOADING_CANCELED, 
  UPLOAD_FINISHED, 
  UPLOAD_STARTED 
} from "./types";


export function addFiles(files: File[]) {
  return {
    type: FILES_ADDED,
    payload: files
  }
}


export function removeFile(filename: string) {
  return {
    type: FILE_REMOVED,
    payload: filename
  }
}


export function updateFile(file: UploadedFile) {
  return {
    type: FILE_UPDATED,
    payload: file
  }
}


export function startUpload(file: UploadedFile) {
  return {
    type: UPLOAD_STARTED,
    payload: file
  }
}


export function finishUpload(file: UploadedFile) {
  return {
    type: UPLOAD_FINISHED,
    payload: file
  }
}


export function startUploading() {
  return {
    type: UPLOADING_STARTED,
  }
}


export function finishUploading() {
  return {
    type: UPLOADING_FINISHED,
  }
}


export function cancelUploading() {
  return {
    type: UPLOADING_CANCELED,
  }
}