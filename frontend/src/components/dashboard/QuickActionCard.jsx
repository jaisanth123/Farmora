import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const QuickActionCard = ({ title, icon, path, color, delay, description }) => {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: (custom) => ({
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            delay: custom,
          },
        }),
      }}
      whileHover={{
        scale: 1.05,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className={`bg-white border-l-4 ${color} rounded-lg shadow-sm transition-all duration-200 cursor-pointer h-full`}
    >
      <Link to={path} className="block p-4 h-full">
        <div className="flex flex-col items-center text-center h-full">
          <motion.div
            className="mb-2 text-black"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
          <h3 className="font-medium text-sm text-black mb-1">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default QuickActionCard;
