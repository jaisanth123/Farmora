import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaNewspaper } from "react-icons/fa";

const AgricultureNewsCarousel = ({ onNewsClick }) => {
  const newsArticles = [
    {
      id: 1,
      title:
        "What the 'Free the Beer' case can teach us about interprovincial trade",
      description:
        "In 2017, the Supreme Court of Canada had the chance to change the landscape of Canadian trade through a decision around a man and his carload of booze. Now, those cross-province trade barriers are getting another look.",
      source: "CBC",
      published: "2025-03-02",
    },
    {
      id: 8,
      title: "VIDEO: FG receives first batch of farming equipment from Belarus",
      description:
        "The Federal Government has received the first batch of 2,000 tractors and 9,027 other farming equipment from Belarus as part of its efforts to accelerate food production in the country.",
      source: "Punch News",
      published: "2025-02-25",
    },
    {
      id: 10,
      title: "Wealth in animal waste",
      description: "It is a green source of energy with great potential",
      source: "The Hindu Business Line",
      published: "2025-03-05",
    },
    {
      id: 16,
      title:
        "The role of government policies in promoting solar adoption among farmers",
      description:
        "Government support and financial incentives drive solar energy adoption in agriculture, promoting sustainability and energy security for farmers worldwide.",
      source: "The Hindu Business Line",
      published: "2025-02-22",
    },
    {
      id: 17,
      title:
        "Women-led farming cooperatives: Empowering communities through agriculture",
      description:
        "Women-led cooperatives in the Eastern Himalayan Region empower women in agriculture, address societal biases, and drive economic development.",
      source: "The Hindu Business Line",
      published: "2025-03-08",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  useEffect(() => {
    let interval;
    if (!isPaused) {
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
        <div
          className="transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="absolute flex w-full h-full">
            {newsArticles.map((news, index) => (
              <div
                key={news.id}
                className="w-full flex-shrink-0 h-full cursor-pointer"
                onClick={() => handleNewsClick(news)}
                style={{ left: `${index * 100}%` }}
              >
                <div className="bg-white p-4 rounded-lg border border-gray-200 h-full flex flex-col">
                  <h3 className="font-medium text-xl mb-3 line-clamp-1">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-lg line-clamp-2 mb-2">
                    {news.description}
                  </p>
                  <div className="mt-auto flex justify-between items-center text-lg text-gray-500">
                    <span>{news.source}</span>
                    <span>{formatDate(news.published)}</span>
                  </div>
                </div>
              </div>
            ))}
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
