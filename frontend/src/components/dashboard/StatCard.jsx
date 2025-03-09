import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const StatCard = ({ title, value, change, icon, theme = "light", onClick }) => {
  // Parse numeric values from strings like "4.5 acres" or "₹2,450/q"
  const parseValue = (val) => {
    const numericMatch = val.match(/([0-9.,]+)/);
    return numericMatch ? parseFloat(numericMatch[0].replace(/,/g, "")) : 0;
  };

  const numericValue = parseValue(value);
  const prefix = value.match(/^[^0-9]*/)[0]; // Get any prefix like "₹"
  const suffix = value.replace(/^[^0-9]*[0-9.,]+/, ""); // Get any suffix like "acres" or "/q"

  // Determine if the change is positive, negative, or neutral
  const getChangeColor = () => {
    if (!change) return "text-gray-500";
    return change.startsWith("+") ? "text-green-500" : "text-red-500";
  };

  return (
    <motion.div
      className={`p-4 rounded-lg cursor-pointer ${
        theme === "light" ? "bg-white shadow-sm" : "bg-gray-800"
      }`}
      onClick={onClick}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`text-sm font-medium mb-1 ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-2xl font-bold ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            {prefix}
            <CountUp
              end={numericValue}
              decimals={numericValue % 1 !== 0 ? 1 : 0}
              duration={2}
              separator=","
            />
            {suffix}
          </p>
        </div>
        <div
          className={`p-2 rounded-full ${
            theme === "light" ? "bg-gray-100" : "bg-gray-700"
          }`}
        >
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-2">
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </span>
          <span
            className={`text-sm ml-1 ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            from last month
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
