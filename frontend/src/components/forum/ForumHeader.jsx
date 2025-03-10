import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import ChatbotWrapper from "../dashboard/utils/ChatbotWrapper";

const ForumHeader = ({ view, goBack, handleCreatePost }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const getTitle = () => {
    switch (view) {
      case "topics":
        return "Discussion Forum";
      case "posts":
        return "Topic Posts";
      case "post-detail":
        return "Post Details";
      case "create-post":
        return "Create New Post";
      default:
        return "Discussion Forum";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg mb-6"
    >
      <div className="flex items-center space-x-3">
        {view !== "topics" && (
          <button
            onClick={goBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {view !== "create-post" && (
          <button
            onClick={handleCreatePost}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center shadow-sm transition-colors duration-200"
          >
            <FaPlus className="mr-2" />
            New Post
          </button>
        )}
        <ChatbotWrapper
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          setIsChatOpen={setIsChatOpen}
        />
      </div>
    </motion.div>
  );
};

export default ForumHeader;
