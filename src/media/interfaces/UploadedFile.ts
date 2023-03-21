import { CancelTokenSource } from "axios";

export interface UploadedFile {
  file: File,
  track_type: "music" | "ad",
  artist: string,
  title: string,
  genre: string,
  cancelTokenSource: CancelTokenSource,
  uploadProgress: number,
  error?: string
}