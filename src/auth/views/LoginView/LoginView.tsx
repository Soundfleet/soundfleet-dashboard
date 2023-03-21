import { toast } from "react-hot-toast";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import ApiClient from "../../../utils/ApiClient";
import LoginForm from "../../components/LoginForm"


const LoginView: React.FC = () => {
  const [session, setSession] = useLocalStorage("SESSION", undefined);

  async function login(
    username: string,
    password: string,
    setSubmitting: (v: boolean) => void,
    setErrors: (e: any) => void
  ) {
    const apiClient = new ApiClient();
    try {
      const response = await apiClient.post(
        "/auth/get-token/",
        {username: username, password: password}
      )
      setSubmitting(false);
      setSession(response.data);
    }
    catch (exception: any) {
      setSubmitting(false);
      if (exception.response) {
        setErrors(exception.response.data);
      }
      toast.error(exception.toString());
    }
  }

  return (
    <LoginForm
      onSubmit={(
        username,
        password,
        setSubmitting,
        setErrors
      ) => login(username, password, setSubmitting, setErrors)
    } />
  )
}


export default LoginView;