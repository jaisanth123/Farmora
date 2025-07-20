import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaNewspaper,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { fetchNewsDetail } from "./NewsApi";

const NewsDetailComponent = ({ news, onBack }) => {
  const [fullContent, setFullContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFullContent = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API
        const apiContent = await fetchNewsDetail(news.id);
        if (apiContent) {
          setFullContent(apiContent);
        } else {
          // If no API content, use the news data itself
          setFullContent({
            fullText:
              news.description ||
              "No detailed content available for this article.",
            author: news.source,
            url: news.url,
          });
        }
      } catch (error) {
        console.error("Error loading news detail:", error);
        // Use the news data itself as fallback
        setFullContent({
          fullText:
            news.description ||
            "No detailed content available for this article.",
          author: news.source,
          url: news.url,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFullContent();
  }, [news.id, news.description, news.source, news.url]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-4 mb-8"
      >
        <div className="mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-green-500 hover:text-green-600 font-medium text-sm"
          >
            <FaArrowLeft className="mr-1" size={14} />
            Back to News
          </button>
        </div>
        <div className="text-center py-8">
          <p>Loading news details...</p>
        </div>
      </motion.div>
    );
  }

  if (!fullContent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-4 mb-8"
      >
        <div className="mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-green-500 hover:text-green-600 font-medium text-sm"
          >
            <FaArrowLeft className="mr-1" size={14} />
            Back to News
          </button>
        </div>
        <div className="text-center py-8 text-red-500">
          <p>Failed to load news details</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-sm p-4 mb-8"
    >
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-green-500 hover:text-green-600 font-medium text-sm"
        >
          <FaArrowLeft className="mr-1" size={14} />
          Back to News
        </button>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{news.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <span className="flex items-center mr-4">
            <FaNewspaper className="mr-1" />
            {news.source}
          </span>
          <span className="flex items-center mr-4">
            <FaCalendarAlt className="mr-1" />
            {formatDate(news.published)}
          </span>
          {fullContent.author && (
            <span className="flex items-center">By: {fullContent.author}</span>
          )}
        </div>
      </div>

      <div className="prose max-w-none">
        {fullContent.fullText.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href={fullContent.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-500 hover:text-blue-600"
        >
          Read original article
          <FaExternalLinkAlt className="ml-1" size={12} />
        </a>
      </div>
    </motion.div>
  );
};

export default NewsDetailComponent;
