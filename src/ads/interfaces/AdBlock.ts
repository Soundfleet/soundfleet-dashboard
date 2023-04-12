import { Playlist } from "./Playlist";


export interface AdBlock {
  id: number,
  start: Date,
  end: Date,
  playlist: Playlist,
  playback_interval: number,
  ads_count_per_block: number,
  play_all_ads: boolean
}