import { UploadedFile } from "../interfaces/UploadedFile";
import { FILES_ADDED, FILE_REMOVED, FILE_UPDATED } from "./types";


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