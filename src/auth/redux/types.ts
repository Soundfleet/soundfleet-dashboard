import { Session } from "../interfaces/Session";

export const SESSION_SET = "SESSION_SET";


export type SetSessionAction = {
  type: typeof SESSION_SET,
  payload: Session | undefined
}


export type AuthState = {
  session: Session | undefined
}


export type AuthAction = (
  SetSessionAction
)