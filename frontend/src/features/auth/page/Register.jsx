import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="w-full">
        <AuthForm title="Register" buttonText="Sign Up" showName={true} />
      </div>
    </div>
  );
};

export default Register;
