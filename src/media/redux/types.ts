import { UploadedFile } from "../interfaces/UploadedFile";

export const FILES_ADDED = "FILES_ADDED";
export const FILE_REMOVED = "FILE_REMOVED";
export const FILE_UPDATED = "FILE_UPDATED";
export const UPLOADING_STARTED = "UPLOADING_STARTED";
export const UPLOADING_FINISHED = "UPLOADING_FINISHED";
export const UPLOADING_CANCELED = "UPLOADING_CANCELED";
export const UPLOAD_STARTED = "UPLOAD_STARTED";
export const UPLOAD_FINISHED = "UPLOAD_FINISHED";


export type FilesAddedAction = {
  type: typeof FILES_ADDED,
  payload: File[]
}


export type RemoveFileAction = {
  type: typeof FILE_REMOVED,
  payload: string
}


export type UpdateFileAction = {
  type: typeof FILE_UPDATED,
  payload: UploadedFile
}


export type StartUploadAction = {
  type: typeof UPLOAD_STARTED,
  payload: UploadedFile
}


export type FinishUploadAction = {
  type: typeof UPLOAD_FINISHED,
  payload: UploadedFile
}


export type StartUploadingAction = {
  type: typeof UPLOADING_STARTED,
}


export type FinishUploadingAction = {
  type: typeof UPLOADING_FINISHED,
}


export type CancelUploadingAction = {
  type: typeof UPLOADING_CANCELED,
}


export type UploadState = {
  files: {[filename: string]: UploadedFile},
  currentFile: UploadedFile | null,
  uploading: boolean,
}


export type UploadAction = (
  FilesAddedAction
  | RemoveFileAction
  | UpdateFileAction
  | StartUploadAction
  | FinishUploadAction
  | CancelUploadingAction
  | StartUploadingAction
  | FinishUploadingAction
)