import { ThemeProvider } from '@emotion/react';
import AppRoutes from './AppRoutes';
import AuthProvider from './auth/providers/AuthProvider';
import { theme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'


function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <AppRoutes/>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
