import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlus } from "react-icons/fa";

const ForumHeader = ({ view, goBack, handleCreatePost }) => {
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
      className="flex items-center justify-between mb-4"
    >
      <div className="flex items-center">
        {view !== "topics" && (
          <button
            onClick={goBack}
            className="mr-2 p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft />
          </button>
        )}
        <h1 className="text-2xl font-bold">{getTitle()}</h1>
      </div>
      {view !== "create-post" && (
        <button
          onClick={handleCreatePost}
          className="px-3 py-2 bg-green-500 text-white rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          New Post
        </button>
      )}
    </motion.div>
  );
};

export default ForumHeader;
