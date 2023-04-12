import { Playlist } from "./Playlist";


export interface MusicBlock {
  id: number,
  start: Date,
  end: Date,
  playlist: Playlist
}