import React from "react";
import { Box, CircularProgress, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, useTheme } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/store";
import { addFiles, removeFile, updateFile } from "../../redux/actions";
import { connect } from "react-redux";
import { UploadedFile } from "../../interfaces/UploadedFile";
import DeleteIcon from '@mui/icons-material/Delete';
import ApiClient from "../../../utils/ApiClient";


interface UploadProps {
  files: {[filename: string]: UploadedFile},
  uploading: boolean,
  currentFile: UploadedFile | null,
  addFiles: (files: File[]) => void,
  removeFile: (filename: string) => void,
  updateFile: (file: UploadedFile) => void,
}

const Upload: React.FC<UploadProps> = (
  {
    files,
    uploading,
    currentFile,
    addFiles,
    removeFile,
    updateFile,
  }
) => {
  const theme = useTheme();
  const apiClient = new ApiClient();
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
      file.cancelTokenSource.token,
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

  React.useEffect(() => {
    if (uploading && currentFile === null) {
      
    }
  }, [uploading, currentFile])

  return (
    <>
      <Box
        textAlign="center"
        border={`dashed 2px ${theme.palette.divider}`}
        padding={theme.spacing(3)}
        {...getRootProps({className: "dropzone"})}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only '*.aac', '*.mp3', '*.ogg', '*.wav', '*.flac' and '*.mpeg' files will be accepted)</em>
      </Box>
      {
        files ? (
          <Table>
            <TableBody>
              {
                Object.values(files).map((file: UploadedFile) => {
                  return (
                    <TableRow key={file.file.name}>
                      <TableCell>{file.file.name}</TableCell>
                      <TableCell>
                        <Select
                          variant="outlined"
                          value={file.track_type}
                          disabled={uploading}
                        >
                          <MenuItem value="music">Music</MenuItem>
                          <MenuItem value="ad">Ad</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField 
                          value={file.artist}
                          label="Artist"
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
                          value={file.title}
                          label="Title"
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
                          value={file.genre}
                          label="Genre"
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
                              value={currentFile?.uploadProgress} 
                            />
                          ) : (
                            <IconButton onClick={() => removeFile(file.file.name)}>
                              <DeleteIcon />
                            </IconButton>
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
});


export default connect(mapStateToProps, mapDispatchToProps)(Upload);