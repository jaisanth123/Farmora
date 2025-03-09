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
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <ToastContainer />
//       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Create Account
//         </h2>
//         <form onSubmit={handleRegister} className="space-y-6">
//           <div>
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <div>
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
//           >
//             Register
//           </button>
//           <button
//             type="button"
//             onClick={handleGoogleSignIn}
//             className="w-full bg-white text-gray-700 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-300"
//           >
//             Sign in with Google
//           </button>
//         </form>
//       </div>
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in
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
      
      {/* Main card with more prominent border */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm border-2 border-gray-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Farm Connect</h1>
          <p className="text-gray-500 mt-1">Join Our Growing Community</p>
        </div>
        
        {/* Form section */}
        <div className="p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Minimum 6 characters"
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
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                )}
                <span>CREATE FARMER ACCOUNT</span>
              </span>
            </button>
            
            {/* Separator */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 absolute w-full"></div>
              <div className="bg-white px-3 relative text-gray-500">or</div>
            </div>
            
            {/* Google sign-in button - keeping original styling untouched */}
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
              <span className="font-medium">{loading ? "Processing..." : "Sign up with Google"}</span>
            </button>
          </form>
          
          {/* Bottom info section */}
          <div className="mt-6 text-center">
            <p className="text-gray-700 mb-4">
              Already have an account? 
              <a href="/login" className="text-gray-900 hover:underline font-medium ml-2">
                Sign in
              </a>
            </p>
            
            {/* Features list - simplified */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Manage crop cycles</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Monitor fields</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Track market prices</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Connect with buyers</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
// import React, { useState, useEffect } from "react";
// import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "./firebase";
// import { ToastContainer, toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [activeField, setActiveField] = useState(null);
//   const navigate = useNavigate();

//   // Handle form submission
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
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
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Google sign-in
//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       const userCredential = await signInWithPopup(auth, googleProvider);
//       toast.success("Google Sign-In successful!");
//       navigate("/dashboard", { state: { userId: userCredential.user.uid } });
//     } catch (error) {
//       toast.error("Google Sign-In failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Animated background patterns */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-full opacity-10">
//           <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
//             <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
//               <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
//             </pattern>
//             <rect width="100%" height="100%" fill="url(#grid)" />
//           </svg>
//         </div>
        
//         {/* Circular decorative elements */}
//         <div className="absolute top-1/4 -left-24 w-64 h-64 bg-green-500 rounded-full opacity-10 animate-pulse"></div>
//         <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-green-300 rounded-full opacity-10 animate-pulse"></div>
//       </div>

//       <ToastContainer />
      
//       {/* Main card */}
//       <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative z-10 overflow-hidden">
//         {/* Header with farm imagery */}
//         <div className="h-40 bg-gradient-to-r from-green-600 to-green-400 relative overflow-hidden">
//           <div className="absolute inset-0 opacity-30">
//           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
//             <defs>
//               <pattern id="farmPattern" patternUnits="userSpaceOnUse" width="100" height="100">
//                 <path d="M30,10 L35,35 L10,35 Z" fill="#fff" />
//                 <path d="M70,20 L90,30 L80,50 Z" fill="#fff" />
//                 <path d="M20,60 L40,70 L30,90 Z" fill="#fff" />
//                 <path d="M60,50 L90,70 L70,90 Z" fill="#fff" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#farmPattern)" />
//           </svg>

//           </div>
//           <div className="absolute bottom-0 left-0 w-full">
//             <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
//               <path d="M0,0 L1200,0 L1200,120 L0,120 Z" fill="white"></path>
//               <path d="M0,30 Q300,100 600,50 T1200,80 L1200,120 L0,120 Z" fill="white"></path>
//             </svg>
//           </div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-10">
//             <h1 className="text-4xl font-bold drop-shadow-lg">Farm Connect</h1>
//             <p className="text-lg opacity-90 mt-1">Join Our Growing Community</p>
//           </div>
//         </div>
        
//         {/* Form section */}
//         <div className="p-8 pt-6">
//           <div className="relative mb-8 bg-green-50 p-4 rounded-xl border border-green-200 overflow-hidden">
//             <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-green-600"></div>
//             <p className="text-green-800 font-medium">
//               Create your farm profile and gain access to powerful tools for managing crops, 
//               tracking yields, and connecting with local markets.
//             </p>
//           </div>
          
//           <form onSubmit={handleRegister} className="space-y-6">
//             {/* Email input with farm icon */}
//             <div 
//               className={`group relative transition-all duration-300 ${
//                 activeField === 'email' ? 'scale-105' : ''
//               }`}
//             >
//               <div className={`absolute left-0 -top-3 bg-white px-2 text-sm font-medium ${
//                 activeField === 'email' ? 'text-green-600' : 'text-gray-600'
//               } transition-colors duration-300`}>
//                 Email Address
//               </div>
//               <div className="flex items-center border-2 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-md" 
//                 style={{ borderColor: activeField === 'email' ? '#10b981' : '#e5e7eb' }}
//               >
//                 <div className={`px-3 py-4 ${
//                   activeField === 'email' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
//                 } transition-all duration-300`}>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
//                   </svg>
//                 </div>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onFocus={() => setActiveField('email')}
//                   onBlur={() => setActiveField(null)}
//                   required
//                   className="flex-1 px-4 py-3 focus:outline-none"
//                   placeholder="yourname@example.com"
//                 />
//               </div>
//             </div>
            
//             {/* Password input with farm icon */}
//             <div 
//               className={`group relative transition-all duration-300 ${
//                 activeField === 'password' ? 'scale-105' : ''
//               }`}
//             >
//               <div className={`absolute left-0 -top-3 bg-white px-2 text-sm font-medium ${
//                 activeField === 'password' ? 'text-green-600' : 'text-gray-600'
//               } transition-colors duration-300`}>
//                 Password
//               </div>
//               <div className="flex items-center border-2 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-md" 
//                 style={{ borderColor: activeField === 'password' ? '#10b981' : '#e5e7eb' }}
//               >
//                 <div className={`px-3 py-4 ${
//                   activeField === 'password' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
//                 } transition-all duration-300`}>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//                   </svg>
//                 </div>
//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onFocus={() => setActiveField('password')}
//                   onBlur={() => setActiveField(null)}
//                   required
//                   className="flex-1 px-4 py-3 focus:outline-none"
//                   placeholder="Minimum 6 characters"
//                 />
//               </div>
//             </div>
                        
//             {/* Submit button with gradient and animated effect */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="group w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white py-4 rounded-lg font-medium shadow-lg overflow-hidden relative transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
//             >
//               <span className="relative z-10 flex items-center justify-center">
//                 {loading ? (
//                   <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                 ) : (
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//                   </svg>
//                 )}
//                 <span className="tracking-wide">CREATE FARMER ACCOUNT</span>
//               </span>
//               <span className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//             </button>
            
//             {/* Separator */}
//             <div className="relative flex items-center justify-center my-6">
//               <div className="border-t border-gray-300 absolute w-full"></div>
//               <div className="bg-white px-6 relative text-gray-500 font-medium">or</div>
//             </div>
            
//             {/* Google sign-in button */}
//             <button
//               type="button"
//               onClick={handleGoogleSignIn}
//               disabled={loading}
//               className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center shadow-md group relative overflow-hidden"
//             >
//               {/* Google rainbow animation on hover */}
//               <div className="absolute top-0 left-0 w-full h-1 transition-transform duration-700 transform -translate-x-full group-hover:translate-x-0">
//                 <div className="h-full w-1/4 bg-blue-600 float-left"></div>
//                 <div className="h-full w-1/4 bg-red-600 float-left"></div>
//                 <div className="h-full w-1/4 bg-yellow-500 float-left"></div>
//                 <div className="h-full w-1/4 bg-green-500 float-left"></div>
//               </div>
              
//               <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
//                 <path
//                   fill="#4285F4"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
//                 />
//                 <path
//                   fill="#EA4335"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//               <span className="font-medium">{loading ? "Processing..." : "Sign in with Google"}</span>
//             </button>
//           </form>
          
//           {/* Bottom info section */}
//           <div className="mt-8 text-center">
//             <p className="text-gray-600 mb-4">
//               Already have an account? 
//               <a href="/login" className="text-green-600 hover:text-green-800 font-medium ml-2 relative group">
//                 Sign in
//                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//               </a>
//             </p>
            
//             {/* Benefits carousel */}
//             <div className="relative overflow-hidden h-20 border-t border-b border-gray-100 py-4 mt-4">
//               <div className="absolute inset-0 flex animate-marquee">
//                 <div className="flex items-center mx-4">
//                   <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
//                   <span className="text-sm">Manage crop cycles</span>
//                 </div>
//                 <div className="flex items-center mx-4">
//                   <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
//                   <span className="text-sm">Monitor field conditions</span>
//                 </div>
//                 <div className="flex items-center mx-4">
//                   <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
//                   <span className="text-sm">Track market prices</span>
//                 </div>
//                 <div className="flex items-center mx-4">
//                   <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
//                   <span className="text-sm">Connect with buyers</span>
//                 </div>
//                 <div className="flex items-center mx-4">
//                   <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
//                   <span className="text-sm">Weather forecasting</span>
//                 </div>
//               </div>
//             </div>
            
//             <p className="text-xs text-gray-400 mt-4">
//               By creating an account, you agree to our Terms of Service and Privacy Policy
//             </p>
//           </div>
//         </div>
//       </div>
      
//       {/* Farm silhouette at bottom */}
//       <div className="absolute bottom-0 left-0 w-full h-20 bg-black opacity-20">
//         <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
//           <path d="M0,120 L1200,120 L1200,0 L0,0 Z" fill="#000"></path>
//           <path d="M0,100 L200,100 L240,60 L280,100 L350,30 L380,70 L450,40 L480,80 L520,60 L560,90 L600,50 L640,90 L680,70 L720,90 L760,60 L800,100 L880,30 L920,80 L960,60 L1000,90 L1040,70 L1080,90 L1120,60 L1160,80 L1200,60 L1200,120 L0,120 Z" fill="#000"></path>
//         </svg>
//       </div>
      
//       {/* Add custom styles */}
//       <style jsx>{`
//         @keyframes marquee {
//           0% { transform: translateX(100%); }
//           100% { transform: translateX(-100%); }
//         }
        
//         .animate-marquee {
//           animation: marquee 20s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Register;