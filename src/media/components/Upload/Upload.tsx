import React from "react";
import { 
  Box, 
  Button, 
  CircularProgress, 
  IconButton, 
  MenuItem, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TextField, 
  useTheme 
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/store";
import {
  addFiles, 
  cancelUploading, 
  finishUpload, 
  finishUploading, 
  removeFile, 
  startUpload, 
  startUploading, 
  updateFile 
} from "../../redux/actions";
import { connect } from "react-redux";
import { UploadedFile } from "../../interfaces/UploadedFile";
import DeleteIcon from '@mui/icons-material/Delete';
import ApiClient from "../../../utils/ApiClient";
import { useAuth } from "../../../auth/providers/AuthProvider";
import { toast } from "react-hot-toast";
import axios from "axios";


interface UploadProps {
  files: {[filename: string]: UploadedFile},
  uploading: boolean,
  currentFile: UploadedFile | null,
  addFiles: (files: File[]) => void,
  removeFile: (filename: string) => void,
  updateFile: (file: UploadedFile) => void,
  startUpload: (file: UploadedFile) => void,
  finishUpload: (file: UploadedFile) => void,
  startUploading: () => void,
  finishUploading: () => void,
  cancelUploading: () => void,
}

const Upload: React.FC<UploadProps> = (
  {
    files,
    uploading,
    currentFile,
    addFiles,
    removeFile,
    updateFile,
    startUpload,
    finishUpload,
    startUploading,
    finishUploading,
    cancelUploading
  }
) => {
  const theme = useTheme();
  const auth = useAuth();
  const apiClient = new ApiClient(auth.session?.access);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      "audio/aac": [".aac"],
      "audio/mp3": [".mp3"],
      "audio/ogg": [".ogg"],
      "audio/wav": [".wav"],
      "audio/flac": [".flac"],
      "audio/mpeg": [".mpeg", ".mp3"],
    },
    onDropAccepted: (files, event) => {
      addFiles(files);
    }
  });

  const fileList = Object.values(files);

  function upload(file: UploadedFile) {
    const payload = new FormData();
    payload.set("file", file.file);
    payload.set("track_type", file.track_type);
    if (file.artist) {
      payload.set("artist", file.artist);
    }
    if (file.title) {
      payload.set("title", file.title);
    }
    if (file.genre) {
      payload.set("genre", file.genre);
    }

    return apiClient.post(
      "/media/upload/",
      payload,
      {},
      file.cancelTokenSource?.token,
      {
        onUploadProgress: (e: ProgressEvent) => {
          updateFile({
            ...file,
            uploadProgress: Math.floor(e.loaded / e.total * 100)
          })
        }
      }
    )
  }

  function handleCancel() {
    if (currentFile) {
      currentFile.cancelTokenSource?.cancel();
    }
    cancelUploading();
  }

  React.useEffect(() => {
    if (uploading && currentFile === null) {
      const [first, ...rest] = fileList;
      first.cancelTokenSource = axios.CancelToken.source();
      if (first) {
        startUpload(first);
        upload(first).then(() => {
          toast.success(`File ${first.file.name} uploaded successfully.`)
          removeFile(first.file.name);
          finishUpload(first);
          if (rest.length === 0) {
            finishUploading();
          }
        }).catch((exception) => {
          toast.error(exception.message);
          finishUpload(first);
          finishUploading();
        });
      }
      else {
        finishUploading();
      }
    }
  })

  return (
    <>
      <Box
        textAlign="center"
        border={`dashed 2px ${theme.palette.divider}`}
        padding={theme.spacing(3)}
        marginBottom={theme.spacing(3)}
        {...getRootProps({className: "dropzone"})}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only '*.aac', '*.mp3', '*.ogg', '*.wav', '*.flac' and '*.mpeg' files will be accepted)</em>
      </Box>
      {
        fileList.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{
                    textAlign: "right",
                    paddingRight: 0
                  }}
                >
                  {
                    uploading ? (
                      <Button 
                        variant="contained"
                        color="secondary"
                        onClick={() => handleCancel()}
                      >
                        Cancel uploading
                      </Button>
                    ) : (
                      <Button 
                        variant="contained"
                        onClick={() => startUploading()}
                      >
                        Upload
                      </Button>
                    )
                  }
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                fileList.map((file: UploadedFile) => {
                  return (
                    <TableRow key={file.file.name}>
                      <TableCell>{file.file.name}</TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={file.track_type}
                          disabled={uploading}
                          onChange={(e) => {
                            updateFile({
                              ...file,
                              track_type: e.target.value as "music" | "ad"
                            })
                          }}
                        >
                          <MenuItem value="music">Music</MenuItem>
                          <MenuItem value="ad">Ad</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField 
                          fullWidth
                          value={file.artist}
                          label="Artist"
                          size="small"
                          disabled={uploading}
                          onChange={(e) => {
                            updateFile({
                              ...file,
                              artist: e.target.value
                            })
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          fullWidth
                          value={file.title}
                          label="Title"
                          size="small"
                          disabled={uploading}
                          onChange={(e) => {
                            updateFile({
                              ...file,
                              title: e.target.value
                            })
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          fullWidth
                          value={file.genre}
                          label="Genre"
                          size="small"
                          disabled={uploading}
                          onChange={(e) => {
                            updateFile({
                              ...file,
                              genre: e.target.value
                            })
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {`${(file.file.size / 2 ** 20).toFixed(2)} MB`}
                      </TableCell>
                      <TableCell>
                        {
                          uploading ? (
                            <CircularProgress
                              variant="determinate"
                              value={file.uploadProgress} 
                            />
                          ) : (
                            <>
                              <IconButton onClick={() => removeFile(file.file.name)}>
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )
                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        ) : <></>
      }
    </>

  )
}


const mapStateToProps = (state: AppState) => ({
  files: state.upload.files,
  uploading: state.upload.uploading,
  currentFile: state.upload.currentFile,
});


const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  addFiles: (files: File[]) => dispatch(addFiles(files)),
  removeFile: (filename: string) => dispatch(removeFile(filename)),
  updateFile: (file: UploadedFile) => dispatch(updateFile(file)),
  startUpload: (file: UploadedFile) => dispatch(startUpload(file)),
  finishUpload: (file: UploadedFile) => dispatch(finishUpload(file)),
  startUploading: () => dispatch(startUploading()),
  finishUploading: () => dispatch(finishUploading()),
  cancelUploading: () => dispatch(cancelUploading()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Upload);