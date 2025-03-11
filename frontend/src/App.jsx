import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserContextProvider } from "./components/Hooks/UserContext";
import Login from "./components/firebase/Login";
import Register from "./components/firebase/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Sidebar from "./components/utils/Sidebar";
import Navbar from "./components/utils/Navbar";
import ChatbotDialog from "./components/chatbot/ChatbotDialog";
import ForumPage from "./components/forum/ForumPage";
import WeatherForecast from "./components/weather/WeatherForecast";
import FarmerRegistrationForm from "./components/utils/FarmerRegistration/FarmerRegistration.jsx";
// D:\KEC HACK 2.0\frontend\src\components\utils\components\FarmerRegistration\FarmerRegistration.jsx
import CropRecommendationForm from "./components/CropRecommend/CropRecommendationForm";
import MarketAnalysisPage from "./components/market_Analysis/MarketAnalysisPage";
import PlantDiseaseUploader from "./components/PlantDisease/PlantDiseaseUploader";
import PlantDiseasePredictor from "./components/PlantDisease/PlantDiseasePredictor";
import FarmerProfile from "./components/utils/FarmerProfile";
import DiagnosisHomePage from "./components/PlantDisease/DiagnosisHomePage.jsx";
import DemandCrop from "./components/CropRecommend/DemandCrop.jsx";
import SeasonalPredict from "./components/CropRecommend/SeasonalPredict.jsx";
import Recommendation from "./components/CropRecommend/Recommendation.jsx";
import { withTranslation } from "react-google-multi-lang";
import GoogleTranslate from "./components/GoogleTranslate.jsx";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sidebarRef = useRef(null);
  const chatbotRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      // Handle sidebar clicks
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-toggle")
      ) {
        closeSidebar();
      }

      // Handle chatbot clicks
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target) &&
        !event.target.closest(".chat-toggle")
      ) {
        closeChat();
      }
    }

    if (isSidebarOpen || isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isChatOpen]);

  return (
    <UserContextProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen m-0 p-0 overflow-x-hidden">
          {/* Navbar with toggle buttons */}
          <Navbar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            toggleChat={toggleChat}
            isChatOpen={isChatOpen}
          />

          {/* Sidebar (Visible on all pages) */}
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          {/* Chatbot (Visible on all pages) */}
          {isChatOpen && (
            <div ref={chatbotRef}>
              <ChatbotDialog closeChat={closeChat} />
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-grow pt-20 px-4">
            <div>
              <GoogleTranslate />
            </div>
          
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/weather" element={<WeatherForecast />} />
              <Route path="/form" element={<FarmerRegistrationForm />} />
              <Route path="/market-analysis" element={<MarketAnalysisPage />} />
              <Route path="/soil-nature" element={<CropRecommendationForm />} />
              <Route path="/profile" element={<FarmerProfile />} />
              <Route path="/seasonal" element={<SeasonalPredict />} />
              <Route path="/demand" element={<DemandCrop />} />
              <Route path="/crop-recommendation" element={<Recommendation />} />

              <Route
                path="/disease-diagnosis"
                element={<PlantDiseasePredictor />}
              />
              <Route path="/disease-pest" element={<PlantDiseaseUploader />} />
              <Route path="/disease" element={<DiagnosisHomePage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </UserContextProvider>
  );
}

export default App;
