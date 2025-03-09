import React from "react";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import PerformanceChart from "./ PerformanceChart";
import ChatbotIcon from "../chatbot/ChatbotIcon";
import ChatbotDialog from "../chatbot/ChatbotDialog";
import { useState } from "react";
import { FaChartLine, FaClipboardList, FaUsers, FaCheck } from "react-icons/fa";

const Dashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tests"
          value="24"
          change="+12%"
          icon={<FaClipboardList className="text-blue-500" />}
        />
        <StatCard
          title="Avg. Score"
          value="78%"
          change="+5%"
          icon={<FaChartLine className="text-green-500" />}
        />
        <StatCard
          title="Students"
          value="156"
          change="+23%"
          icon={<FaUsers className="text-purple-500" />}
        />
        <StatCard
          title="Completion"
          value="92%"
          change="+8%"
          icon={<FaCheck className="text-yellow-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>

      {/* Chatbot Components */}
      <ChatbotIcon toggleChat={toggleChat} isOpen={isChatOpen} />
      {isChatOpen && <ChatbotDialog closeChat={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default Dashboard;
