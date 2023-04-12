import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { AppState } from "../../redux/store";
import { AuthContextType } from "../interfaces/AuthContextType";
import { Session } from "../interfaces/Session";
import { setSession } from "../redux/actions";


interface AuthProviderProps {
  children: React.ReactNode,
  session: Session | undefined,
  setSession: (session: Session | undefined) => void
}


export function useAuth() {
  return React.useContext(AuthContext);
}


export const AuthContext = React.createContext<AuthContextType>(null!);


const AuthProvider: React.FC<AuthProviderProps> = (
  {
    children,
    session,
    setSession
  }
) => {
  const [storedSession, setStoredSession] = useLocalStorage("SESSION", undefined);

  React.useEffect(() => {
    if (session === undefined && storedSession !== undefined) {
      setSession(storedSession);
    }
  })

  const login = (newSession: Session) => {
    // after refresh there is only new access token
    setStoredSession({...session, ...newSession});
    setSession({...session, ...newSession})
  }

  const logout = () => {
    setStoredSession(undefined);
    setSession(undefined);
  }

  const isAuthenticated = () => {
    return session !== undefined;
  }

  let value = {session, login, logout, isAuthenticated};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


const mapStateToProps = (state: AppState) => ({
  session: state.auth.session
});


const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  setSession: (session: Session | undefined) => dispatch(setSession(session))
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthProvider);
