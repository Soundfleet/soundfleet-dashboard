import { Session } from "./Session";


export interface AuthContextType {
  session: Session | undefined,
  login: (session: Session) => void,
  logout: () => void,
  isAuthenticated: () => boolean,
}
