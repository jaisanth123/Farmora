import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Login from "./components/firebase/Login";
import Register from "./components/firebase/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Sidebar from "./components/utils/Sidebar";
import Navbar from "./components/utils/Navbar";
import ChatbotDialog from "./components/chatbot/ChatbotDialog";
import { AuthProvider } from './context/AuthContext';
import ForumPage from "./components/forum/ForumPage";
import WeatherForecast from "./components/weather/WeatherForecast";
import FarmerRegistrationForm from "./components/FarmerRegistrationForm";
import CropRecommendationForm from "./components/models/CropRecommendationForm";
import MarketAnalysisPage from "./components/market_Analysis/MarketAnalysisPage";
import PlantDiseaseUploader from "./components/PlantDisease/PlantDiseaseUploader";
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
    <AuthProvider>
    <Router>
      <div className="flex flex-col min-h-screen m-0 p-0 overflow-x-hidden">
        <Navbar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          toggleChat={toggleChat}
          isChatOpen={isChatOpen}
        />

          <div className="hidden">
            <div ref={sidebarRef}></div>
          </div>

          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          {isChatOpen && (
            <div ref={chatbotRef}>
              <ChatbotDialog closeChat={closeChat} />
            </div>
          )}

          <main className="flex-grow  pt-20 px-4">
            <Routes>
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/weather" element={<WeatherForecast />} />
              <Route path="/form" element={<FarmerRegistrationForm />} />
              <Route path="/market-analysis" element={<MarketAnalysisPage />} />\
              <Route path="/crop-recommendation" element={<CropRecommendationForm/>}/>
              <Route
                path="/disease-diagnosis"
                element={<PlantDiseaseUploader />}
              />
            </Routes>
          </main>
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {isChatOpen && (
          <div ref={chatbotRef}>
            <ChatbotDialog closeChat={closeChat} />
          </div>
        )}

        {/* <main className="flex-grow pt-20 px-4">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form" element={<FarmerRegistrationForm />} />
          </Routes>
        </main>
      </div> */}
    </Router>
    </AuthProvider>
  );
}

export default App;
