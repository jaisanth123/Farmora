import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
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
      toast.success("Signed in with Google successfully!");
      navigate("/dashboard", { state: { userId: userCredential.user.uid } });
    } catch (error) {
      toast.error("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <ToastContainer />

      <motion.div
        className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-2xl p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Farmora</h1>
          <p className="text-gray-600 mt-2">Sign In to Your Account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"} // Toggle between text and password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-black text-xl"
              >
                {showPassword ? "👀" : "🙈"}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md font-medium disabled:opacity-50 flex items-center justify-center"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : null}
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        {/* Separator */}
        <div className="relative my-6">
          <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
          <span className="bg-white px-4 text-gray-500 relative block text-center">
            or
          </span>
        </div>

        {/* Google Button with Rainbow Animation */}
        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-black py-3 rounded-md font-medium flex items-center justify-center shadow-sm group relative overflow-hidden disabled:opacity-50"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {/* Rainbow animation bar */}
          <div className="absolute top-0 left-0 w-full h-1 transition-transform duration-700 transform -translate-x-full group-hover:translate-x-0">
            <div className="h-full w-1/4 bg-blue-600 float-left"></div>
            <div className="h-full w-1/4 bg-red-600 float-left"></div>
            <div className="h-full w-1/4 bg-yellow-500 float-left"></div>
            <div className="h-full w-1/4 bg-green-500 float-left"></div>
          </div>

          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
          {loading ? "Processing..." : "Continue with Google"}
        </motion.button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-black font-medium hover:underline"
            >
              Create Account
            </a>
          </p>
          <p className="text-sm text-black mt-2">
            <a href="/forgot-password" className="hover:underline">
              Forgot your password?
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-black hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-black hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
