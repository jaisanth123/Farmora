// main.jsx
import "regenerator-runtime/runtime";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TranslationProvider } from "react-google-multi-lang";
import App from "./App.jsx";
import "./index.css";

// Your existing Google API key
const apiKey = "AIzaSyBgOpw_pLL_d3f4OHtknZxL1JwTIFt6-B0";

if (apiKey) {
  console.log("API key is defined.");
} else {
  console.error("API key is undefined. Please check your .env file.");
}

const AppWrapper = () => {
  useEffect(() => {
    // ✅ Updated Content Security Policy (CSP)
    const cspMetaTag = document.createElement("meta");
    cspMetaTag.httpEquiv = "Content-Security-Policy";
    cspMetaTag.content = `
      default-src 'self';
      connect-src 'self' https://accounts.google.com https://translation.googleapis.com https://api.weatherapi.com;
      img-src 'self' data: https: blob: *;
      frame-src 'self' https://accounts.google.com;
      script-src 'self' https://accounts.google.com https://translation.googleapis.com;
    `;
    document.head.appendChild(cspMetaTag);

    // ✅ Set Referrer Policy
    const referrerMetaTag = document.createElement("meta");
    referrerMetaTag.name = "referrer";
    referrerMetaTag.content = "no-referrer-when-downgrade";
    document.head.appendChild(referrerMetaTag);

    // Clean up meta tags on unmount
    return () => {
      document.head.removeChild(cspMetaTag);
      document.head.removeChild(referrerMetaTag);
    };
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <TranslationProvider apiKey={apiKey}>
          <App />
        </TranslationProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

// Render the app
createRoot(document.getElementById("root")).render(<AppWrapper />);
