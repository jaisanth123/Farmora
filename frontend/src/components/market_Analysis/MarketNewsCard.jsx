import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const MarketNewsCard = ({ news }) => {
  return (
    <div
      className={`p-3 border-l-4 rounded-md shadow-sm ${
        news.impact === "positive"
          ? "border-green-500 bg-green-50"
          : news.impact === "negative"
          ? "border-red-500 bg-red-50"
          : "border-blue-500 bg-blue-50"
      }`}
    >
      <h3 className="font-medium text-gray-800 mb-1">{news.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{news.source}</span>
        <span>{news.date}</span>
      </div>
      <div className="mt-2 text-right">
        <a
          href={news.url}
          className="inline-flex items-center text-xs text-green-600 hover:underline"
        >
          Read More <FaExternalLinkAlt className="ml-1" size={10} />
        </a>
      </div>
    </div>
  );
};

export default MarketNewsCard;
