import AppRoutes from './AppRoutes';
import AuthProvider from './auth/providers/AuthProvider';


function App() {
  return (
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
  );
}

export default App;
