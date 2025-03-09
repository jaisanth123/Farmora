// import React, { useState } from "react";
// import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "./firebase";
// import { ToastContainer, toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       toast.success("Registration successful!");
//       navigate("/dashboard", { state: { userId: userCredential.user.uid } });
//     } catch (error) {
//       toast.error("Error creating account.");
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const userCredential = await signInWithPopup(auth, googleProvider);
//       toast.success("Google Sign-In successful!");
//       navigate("/dashboard", { state: { userId: userCredential.user.uid } });
//     } catch (error) {
//       toast.error("Google Sign-In failed.");
//     }
//   };

//   return (
//     <div className="container">
//       <ToastContainer />
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Register</button>
//         <button type="button" onClick={handleGoogleSignIn}>
//           Sign in with Google
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Registration successful!");
      navigate("/dashboard", { state: { userId: userCredential.user.uid } });
    } catch (error) {
      toast.error("Error creating account.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      toast.success("Google Sign-In successful!");
      navigate("/dashboard", { state: { userId: userCredential.user.uid } });
    } catch (error) {
      toast.error("Google Sign-In failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-700 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-300"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
