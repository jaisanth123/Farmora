// src/components/forum/CreatePostForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaCamera, FaSmile, FaTimes } from "react-icons/fa";
import Picker from "emoji-picker-react";

const CreatePostForm = ({ onCancel, onSubmit, topics, initialTopic }) => {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTopic, setNewPostTopic] = useState(initialTopic);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Handle file change for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle emoji selection
  const onEmojiClick = (event, emojiObject) => {
    setNewPostContent(newPostContent + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Submit new post
  const handleSubmitPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: `${newPostTopic}-${Date.now()}`,
      title: newPostTitle,
      author: "You", // Would be replaced by actual user name
      date: new Date().toISOString().split("T")[0],
      content: newPostContent,
      likes: 0,
      replies: 0,
      authorAvatar: "/assets/avatars/you.jpg", // Placeholder
      images: imagePreview ? [imagePreview] : [],
    };

    onSubmit(newPost, newPostTopic);

    // Reset form
    setNewPostTitle("");
    setNewPostContent("");
    setImagePreview(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-3">
        Create New Post
      </h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Topic
        </label>
        <div className="relative">
          <select
            value={newPostTopic}
            onChange={(e) => setNewPostTopic(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white appearance-none pr-10"
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.icon} {topic.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Post Title
        </label>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter a descriptive title"
        />
      </div>

      <div className="mb-5 relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Post Content
        </label>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[180px] text-base"
          placeholder="Share your thoughts, questions, or insights..."
        />
        <div className="absolute bottom-3 right-3 flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
          <label className="cursor-pointer p-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-gray-100 transition-colors">
            <FaCamera size={20} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <button
            className="p-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile size={20} />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute right-0 z-10 mt-2">
            <div className="relative">
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-20"
                onClick={() => setShowEmojiPicker(false)}
              >
                <FaTimes size={12} />
              </button>
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          </div>
        )}
      </div>

      {imagePreview && (
        <div className="mb-5">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Upload preview"
              className="max-h-48 rounded-lg object-cover shadow-md"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              onClick={() => setImagePreview(null)}
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
        <button
          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg mr-3 hover:bg-gray-300 transition-colors font-medium"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className={`px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors
            ${
              !newPostTitle.trim() || !newPostContent.trim()
                ? "bg-green-300 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          onClick={handleSubmitPost}
          disabled={!newPostTitle.trim() || !newPostContent.trim()}
        >
          <FaPaperPlane className="mr-2" />
          Post
        </button>
      </div>
    </motion.div>
  );
};

export default CreatePostForm;
