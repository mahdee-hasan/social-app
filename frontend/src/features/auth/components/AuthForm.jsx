import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import {
  signInWithGoogle,
  signInWithFacebook,
  signInManually,
  login,
  deleteCurrentUser,
} from "@/firebase";
import { useAuthstore, useUserStore } from "@/app/store";
import { Link, useNavigate } from "react-router";
import validate from "../utils/validate";
import arrangeAuthError from "../utils/arrangeAuthError";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import api from "@/axios";
import createUser from "../services/createUser";

const AuthForm = ({ title, buttonText, showName = false }) => {
  const swapPages = useAuthstore((state) => state.swapPages);
  const setUserUid = useUserStore((state) => state.setUserUid);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    try {
      const validationError = validate(email, password, displayName, showName);
      if (Object.keys(validationError).length > 0) {
        setErrors(validationError);

        return;
      }

      if (showName) {
        const feedback = await signInManually(email, password, displayName);
        if (feedback.code) {
          const authError = arrangeAuthError(feedback);
          setErrors(authError);
        } else {
          const creatingUser = await createUser(feedback);
          if (!creatingUser.success) {
            await deleteCurrentUser();
            throw new Error(creatingUser.message);
          }
          setUserUid(feedback.uid);
          navigate(`/user/${feedback.uid}`);
        }
      } else {
        const feedback = await login(email, password);
        if (feedback.code) {
          const authError = arrangeAuthError(feedback);
          setErrors(authError);
        } else {
          console.log(feedback.uid);
          setUserUid(feedback.uid);
          navigate(`/user/${feedback.uid}`);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      const creatingUser = await createUser(user);

      if (!creatingUser.success) {
        await deleteCurrentUser();
        throw new Error(creatingUser.message);
      }
      setUserUid(user.uid);
      navigate(`/user/${user.uid}`);
      // TODO: Send user info to backend if needed
    } catch (err) {
      console.error("Google login error:", err.message);
    }
  };

  const handleFacebook = async () => {
    try {
      const user = await signInWithFacebook();
      const creatingUser = await createUser(user);
      if (!creatingUser.success) {
        await deleteCurrentUser();
        throw new Error(creatingUser.message);
      }
      setUserUid(user.uid);

      navigate(`/user/${user.uid}`);
      // TODO: Send user info to backend if needed
    } catch (err) {
      console.error("Facebook login error:", err);
    }
  };

  return (
    <div
      className="max-w-md mx-auto mt-36 bg-white/20 backdrop-blur-md
      shadow-md rounded-xl p-6"
    >
      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {showName && (
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
            {errors?.displayName && <p>{errors?.displayName}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          {errors?.email && <p>{errors?.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          <p>
            {" "}
            <input
              type="checkbox"
              name="passwordVisibility"
              checked={showPassword}
              onChange={() => {
                setShowPassword(!showPassword);
              }}
            />{" "}
            show password{" "}
          </p>
          {errors?.password && <p>{errors?.password}</p>}
        </div>
        {errors?.general && <p>{errors?.general}</p>}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isSubmitting ? (
            <>
              <Loader2Icon /> please wait{" "}
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">or continue with</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Social Buttons */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleGoogle}
          className="flex items-center justify-center w-full border rounded-lg py-2 hover:bg-gray-100 transition"
        >
          <FcGoogle className="mr-2 text-xl" />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={handleFacebook}
          className="flex items-center justify-center w-full border rounded-lg py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FaFacebook className="mr-2 text-xl" />
          Continue with Facebook
        </button>
      </div>
      {showName ? (
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            onClick={() => swapPages(true)}
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/auth/register"
            onClick={() => swapPages(false)}
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
