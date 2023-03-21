import { User } from "./User";

export interface Session {
  user: User,
  access: string,
  refresh: string,
}