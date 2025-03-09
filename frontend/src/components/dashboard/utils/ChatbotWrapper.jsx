// src/components/dashboard/ChatbotWrapper.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatbotIcon from "../../chatbot/ChatbotIcon";
import ChatbotDialog from "../../chatbot/ChatbotDialog";

const ChatbotWrapper = ({ isChatOpen, toggleChat, setIsChatOpen }) => {
  return (
    <>
      <ChatbotIcon toggleChat={toggleChat} isOpen={isChatOpen} />
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <ChatbotDialog
              closeChat={() => setIsChatOpen(false)}
              title="Ask the Agronomist"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWrapper;
