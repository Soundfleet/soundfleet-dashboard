import { AuthAction, AuthState, SESSION_SET } from "./types";

export const authReducer = (
  state: AuthState = {session: undefined},
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case SESSION_SET:
      return {
        ...state,
        session: action.payload
      }
    default:
      return state;
  }
}