import React from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { AuthContextType } from "../interfaces/AuthContextType";
import { Session } from "../interfaces/Session";


interface AuthProviderProps {
  children: React.ReactNode
}


export function useAuth() {
  return React.useContext(AuthContext);
}


export const AuthContext = React.createContext<AuthContextType>(null!);


const AuthProvider: React.FC<AuthProviderProps> = (
  {
    children
  }
) => {
  const [storedSession, setStoredSession] = useLocalStorage("SESSION", undefined);
  const [session, setSession] = React.useState<Session | undefined>(storedSession);

  React.useEffect(() => {
    setStoredSession(session);
  }, [session])

  const login = (newSession: Session) => {
    // after refresh there is only new access token
    setSession({...session, ...newSession});
  }

  const logout = () => {
    setSession(undefined);
  }

  const isAuthenticated = () => {
    return session !== undefined;
  }

  let value = {session, login, logout, isAuthenticated};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


export default AuthProvider;
