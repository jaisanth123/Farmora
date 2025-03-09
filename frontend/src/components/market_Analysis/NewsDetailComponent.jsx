import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCalendarAlt, FaGlobe } from "react-icons/fa";

const NewsDetailComponent = ({ news, onBack }) => {
  // In a real app, this would fetch the full article content
  // For now, we'll simulate a longer article with placeholder text
  const fullContent = `
    ${news.summary}
    
    The agricultural sector has been experiencing significant changes in recent months, with market dynamics shifting due to various factors including weather patterns, policy changes, and global trade developments.
    
    Farmers across the country are closely monitoring these developments as they make critical decisions about planting, harvesting, and marketing their crops. The timing of these changes is particularly significant as we enter a new growing season.
    
    Experts suggest that producers should stay informed about market trends and consider diversifying their crops to mitigate potential risks. Additionally, exploring value-added opportunities and direct-to-consumer channels may provide additional revenue streams in this changing landscape.
    
    The impact of these developments will likely vary by region and commodity, with some areas seeing more pronounced effects than others. Local agricultural extension offices and market advisory services are available to help farmers navigate these complex market conditions.
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-8"
    >
      <button
        onClick={onBack}
        className="flex items-center text-green-600 hover:text-green-700 mb-4"
      >
        <FaArrowLeft className="mr-1" size={14} />
        Back to News
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{news.title}</h1>

      <div className="flex items-center text-sm text-gray-500 mb-6">
        <div className="flex items-center mr-4">
          <FaCalendarAlt className="mr-1" size={12} />
          <span>{news.date}</span>
        </div>
        <div className="flex items-center">
          <FaGlobe className="mr-1" size={12} />
          <span>Source: {news.source}</span>
        </div>
      </div>

      <div
        className={`w-full h-48 mb-6 rounded-lg ${
          news.impact === "positive"
            ? "bg-green-100"
            : news.impact === "negative"
            ? "bg-red-100"
            : "bg-blue-100"
        } flex items-center justify-center`}
      >
        <span className="text-gray-500">Featured Image</span>
      </div>

      <div className="prose max-w-none">
        {fullContent.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="font-medium text-gray-800 mb-2">Impact Analysis</h3>
        <div
          className={`p-3 rounded-md ${
            news.impact === "positive"
              ? "bg-green-50 text-green-800"
              : news.impact === "negative"
              ? "bg-red-50 text-red-800"
              : "bg-blue-50 text-blue-800"
          }`}
        >
          <p className="text-sm">
            {news.impact === "positive"
              ? "This development is expected to have a positive impact on market prices and farm revenues."
              : news.impact === "negative"
              ? "This development may negatively affect market prices and supply chains in the short term."
              : "This development has mixed or neutral implications for agricultural markets."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button className="text-green-600 hover:text-green-700 text-sm">
          Share Article
        </button>
    <button className="text-green-600 hover:text-green-700 text-sm">
          Save for Later
        </button>
      </div>
    </motion.div>
  );
};

export default NewsDetailComponent;
