import { ThemeProvider } from '@emotion/react';
import AppRoutes from './AppRoutes';
import AuthProvider from './auth/providers/AuthProvider';
import { theme } from './theme';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
