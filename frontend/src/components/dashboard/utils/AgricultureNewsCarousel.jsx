import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaNewspaper } from "react-icons/fa";
import { fetchAgricultureNews } from "./NewsApi";

const AgricultureNewsCarousel = ({ onNewsClick }) => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news data when component mounts
  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        console.log("Attempting to fetch news...");
        const articles = await fetchAgricultureNews();
        console.log("API response:", articles);

        // Ensure articles is an array before setting state
        if (Array.isArray(articles) && articles.length > 0) {
          setNewsArticles(articles);
        } else {
          // Fallback to mock data if API returns empty or non-array
          setNewsArticles([
            {
              id: 1,
              title:
                "What the 'Free the Beer' case can teach us about interprovincial trade",
              description:
                "In 2017, the Supreme Court of Canada had the chance to change the landscape of Canadian trade through a decision around a man and his carload of booze.",
              source: "CBC",
              published: "2025-03-02",
            },
            {
              id: 2,
              title: "New agricultural subsidies announced for organic farmers",
              description:
                "Government introduces new financial incentives for farmers transitioning to organic methods.",
              source: "AgriNews",
              published: "2025-03-01",
            },
            {
              id: 3,
              title: "Climate change impacts on crop yields in 2025",
              description:
                "Researchers predict significant changes to agricultural output due to shifting weather patterns.",
              source: "Climate Report",
              published: "2025-02-28",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load news:", err);
        setError("Failed to load agricultural news. Please try again later.");
        // Initialize with empty array to prevent mapping errors
        setNewsArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    let interval;
    if (!isPaused && newsArticles.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsArticles.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPaused, newsArticles.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? newsArticles.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsArticles.length);
  };

  const handleNewsClick = (news) => {
    if (onNewsClick) {
      onNewsClick(news);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm text-center">
        <p>Loading agriculture news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!Array.isArray(newsArticles) || newsArticles.length === 0) {
    return (
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm text-center">
        <p>No agriculture news available at this time.</p>
      </div>
    );
  }

  // Only display the current article
  const currentArticle = newsArticles[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-8 bg-white p-4 rounded-lg shadow-sm relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="text-lg font-medium flex items-center mb-4">
        <FaNewspaper className="mr-2 text-green-500" />
        Agriculture News
      </h2>

      <div
        className="relative overflow-hidden h-48"
        onMouseEnter={() => setShowLeftArrow(true)}
        onMouseLeave={() => setShowLeftArrow(false)}
      >
        {/* Display only the current news item */}
        <div
          className="bg-white p-4 rounded-lg border border-gray-200 h-full flex flex-col cursor-pointer"
          onClick={() => handleNewsClick(currentArticle)}
        >
          <h3 className="font-medium text-xl mb-3 line-clamp-1">
            {currentArticle.title}
          </h3>
          <p className="text-gray-600 text-lg line-clamp-2 mb-2">
            {currentArticle.description}
          </p>
          <div className="mt-auto flex justify-between items-center text-lg text-gray-500">
            <span>{currentArticle.source}</span>
            <span>{formatDate(currentArticle.published)}</span>
          </div>
        </div>

        {showLeftArrow && (
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
            aria-label="Previous news"
          >
            <FaArrowLeft size={20} />
          </button>
        )}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
          aria-label="Next news"
        >
          <FaArrowRight size={20} />
        </button>
      </div>

      <div className="flex justify-center mt-4">
        {newsArticles.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${
              index === currentIndex ? "bg-green-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AgricultureNewsCarousel;
