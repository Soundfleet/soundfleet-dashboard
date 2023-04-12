import { Schedule } from "../../music/interfaces/Schedule";

export interface MusicEvent {
  id: number,
  start: Date,
  end: Date,
  schedule: Schedule,
}