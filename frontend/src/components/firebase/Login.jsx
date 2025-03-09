import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Login successful!");
      navigate("/dashboard", { state: { userId: userCredential.user.uid } });
    } catch (error) {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      toast.success("Google Sign-In successful!");
      navigate("/dashboard", { state: { userId: userCredential.user.uid } });
    } catch (error) {
      toast.error("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer />

      {/* Main card with border */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm border-2 border-gray-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Farmora</h1>
          <p className="text-gray-500 mt-1">Welcome Back</p>
        </div>

        {/* Form section */}
        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="yourname@example.com"
              />
            </div>

            {/* Password input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-medium transition-colors"
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                <span>LOGIN</span>
              </span>
            </button>

            {/* Separator */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 absolute w-full"></div>
              <div className="bg-white px-3 relative text-gray-500">or</div>
            </div>

            {/* Google sign-in button - using the same styling as in register */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center shadow-md group relative overflow-hidden"
            >
              {/* Google rainbow animation on hover */}
              <div className="absolute top-0 left-0 w-full h-1 transition-transform duration-700 transform -translate-x-full group-hover:translate-x-0">
                <div className="h-full w-1/4 bg-blue-600 float-left"></div>
                <div className="h-full w-1/4 bg-red-600 float-left"></div>
                <div className="h-full w-1/4 bg-yellow-500 float-left"></div>
                <div className="h-full w-1/4 bg-green-500 float-left"></div>
              </div>

              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">
                {loading ? "Processing..." : "Sign in with Google"}
              </span>
            </button>
          </form>

          {/* Bottom info section */}
          <div className="mt-6 text-center">
            <p className="text-gray-700 mb-4">
              Don't have an account?
              <a
                href="/register"
                className="text-gray-900 hover:underline font-medium ml-2"
              >
                Create account
              </a>
            </p>

            <p className="text-xs text-gray-400 mt-4">
              <a href="/forgot-password" className="hover:underline">
                Forgot your password?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
