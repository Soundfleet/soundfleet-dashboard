import { UploadedFile } from "../interfaces/UploadedFile";

export const FILES_ADDED = "FILES_ADDED";
export const FILE_REMOVED = "FILE_REMOVED";
export const FILE_UPDATED = "FILE_UPDATED";
export const UPLOAD_STARTED = "UPLOAD_STARTED";
export const UPLOAD_FINISHED = "UPLOAD_FINISHED";
export const UPLOAD_CANCELED = "UPLOAD_CANCELED";


export type FilesAddedAction = {
  type: typeof FILES_ADDED,
  payload: File[]
}


export type FileRemovedAction = {
  type: typeof FILE_REMOVED,
  payload: string
}


export type FileUpdateAction = {
  type: typeof FILE_UPDATED,
  payload: UploadedFile
}


export type UploadStartedAction = {
  type: typeof UPLOAD_STARTED,
  payload: UploadedFile
}


export type UploadFinishedAction = {
  type: typeof UPLOAD_FINISHED,
  payload: UploadedFile
}


export type UploadCanceledAction = {
  type: typeof UPLOAD_CANCELED,
  payload: UploadedFile
}


export type UploadState = {
  files: {[filename: string]: UploadedFile},
  currentFile: UploadedFile | null,
  uploading: boolean,
}


export type UploadAction = (
  FilesAddedAction
  | FileRemovedAction
  | FileUpdateAction
  | UploadStartedAction
  | UploadFinishedAction
  | UploadCanceledAction
)