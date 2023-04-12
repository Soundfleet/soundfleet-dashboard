import { Session } from "../interfaces/Session";
import { SESSION_SET, SetSessionAction } from "./types";

export function setSession(session: Session | undefined): SetSessionAction {
  return {
    type: SESSION_SET,
    payload: session
  }
}