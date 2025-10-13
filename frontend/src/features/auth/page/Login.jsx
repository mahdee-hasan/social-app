import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Login = () => {
  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-transparent">
      <div className="w-full">
        <AuthForm title="Login" buttonText="login" />
      </div>
    </div>
  );
};

export default Login;
