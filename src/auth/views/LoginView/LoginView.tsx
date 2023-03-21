import { useLocalStorage } from "../../../hooks/useLocalStorage";
import ApiClient from "../../../utils/ApiClient";
import LoginForm from "../../components/LoginForm"


const LoginView: React.FC = () => {
  const [session, setSession] = useLocalStorage("SESSION", undefined);

  async function login(username: string, password: string) {
    const apiClient = new ApiClient();
    try {
      const response = await apiClient.post(
        "/auth/login/",
        {username: username, password: password}
      )
      setSession(response.data);
    }
    catch (exception) {
      console.log(exception)
    }
  }

  return (
    <LoginForm onSubmit={(username, password) => login(username, password)} />
  )
}


export default LoginView;