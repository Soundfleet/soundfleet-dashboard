import { Calendar } from "../../calendars/interfaces/Calendar";

export interface Device {
  uuid: string,
  name: string,
  description: string,
  calendar: Calendar | null,
  volume: number,
  playback_priority: "music" | "ads",
  connection_policy: "allow" | "deny",
  timezone_name: string,
  last_sync: string | null,
  debug: boolean,
  connected: boolean
}