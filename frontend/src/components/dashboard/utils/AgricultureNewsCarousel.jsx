import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaNewspaper } from "react-icons/fa";
import { fetchAgricultureNews } from "./NewsApi";

const AgricultureNewsCarousel = () => {
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
            // your fallback data
          ]);
        }
      } catch (err) {
        console.error("Failed to load news:", err);
        setError("Failed to load agricultural news. Please try again later.");
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="flex flex-col items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
          <p className="text-green-600 mb-2">
            Fetching latest agriculture news...
          </p>
          <p className="text-sm text-gray-500">
            Searching for farming, crops, agricultural schemes, and farmer
            welfare
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="flex flex-col items-center py-8">
          <FaNewspaper className="text-4xl text-red-300 mb-4" />
          <p className="text-red-600 mb-2">Unable to fetch agriculture news</p>
          <p className="text-sm text-gray-500">
            Please check your internet connection and try again later
          </p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(newsArticles) || newsArticles.length === 0) {
    return (
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm text-center">
        <div className="flex flex-col items-center py-8">
          <FaNewspaper className="text-4xl text-gray-300 mb-4" />
          <p className="text-gray-600 mb-2">
            No agriculture news available at this time.
          </p>
          <p className="text-sm text-gray-500">
            Please check back later for the latest updates on farming, crops,
            agricultural schemes, and farmer welfare.
          </p>
        </div>
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
        className="relative overflow-hidden h-56"
        onMouseEnter={() => setShowLeftArrow(true)}
        onMouseLeave={() => setShowLeftArrow(false)}
      >
        {/* Display only the current news item */}
        <div
          className="bg-white p-4 rounded-lg border border-gray-200 h-full flex cursor-pointer hover:shadow-md transition-shadow"
          onClick={() =>
            window.open(currentArticle.url, "_blank", "noopener,noreferrer")
          }
        >
          {/* Image Section */}
          <div className="flex-shrink-0 mr-4">
            {currentArticle.image ? (
              <img
                src={currentArticle.image}
                alt={currentArticle.title}
                className="w-32 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center"
              style={{ display: currentArticle.image ? "none" : "flex" }}
            >
              <FaNewspaper className="text-gray-400" size={24} />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-medium text-xl mb-3 line-clamp-1">
              {currentArticle.title}
            </h3>
            <p className="text-gray-600 text-lg line-clamp-2 mb-2 flex-1">
              {currentArticle.description}
            </p>
            <div className="flex justify-between items-center">
              <div className="text-lg text-gray-500">
                <span>{currentArticle.source}</span>
                <span className="ml-2">
                  {formatDate(currentArticle.published)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    currentArticle.url,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                View Details
              </button>
            </div>
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
