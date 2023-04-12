import { Schedule } from "../../ads/interfaces/Schedule";

export interface AdEvent {
  id: number,
  start: Date,
  end: Date,
  schedule: Schedule
}