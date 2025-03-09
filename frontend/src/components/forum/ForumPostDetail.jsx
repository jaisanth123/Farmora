import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart, FaPaperPlane } from "react-icons/fa";
import { format, parseISO } from "date-fns";

const ForumPostDetail = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([
    {
      id: "r1",
      author: "Vikram Patel",
      authorAvatar: "/assets/avatars/farmer6.jpg",
      date: "2025-03-08",
      content:
        "I've had good results with wheat and barley in clay soils. Make sure you add organic matter to improve drainage.",
      likes: 3,
    },
    {
      id: "r2",
      author: "Meena Kumari",
      authorAvatar: "/assets/avatars/farmer7.jpg",
      date: "2025-03-09",
      content:
        "Have you considered mustard? It can do well in clay soils and is good for the local market right now.",
      likes: 2,
    },
  ]);

  const handleAddReply = () => {
    if (!replyText.trim()) return;

    const newReply = {
      id: `reply-${Date.now()}`,
      author: "You",
      authorAvatar: "/assets/avatars/you.jpg",
      date: new Date().toISOString().split("T")[0],
      content: replyText,
      likes: 0,
    };

    setReplies([...replies, newReply]);
    setReplyText("");
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Post Detail */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start">
          <img
            src={post.authorAvatar || `/api/placeholder/48/48`}
            alt={post.author}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-xl">{post.title}</h2>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <span>{post.author}</span>
              <span className="mx-2">•</span>
              <span>{format(parseISO(post.date), "MMM d, yyyy")}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-line mb-4">
              {post.content}
            </p>

            {post.images && post.images.length > 0 && (
              <div className="my-4">
                {post.images.map((img, index) => (
                  <img
                    key={index}
                    src={img || `/api/placeholder/400/300`}
                    alt={`Post attachment ${index + 1}`}
                    className="max-h-80 rounded-lg object-cover mb-2"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <button
                className="flex items-center text-gray-500 hover:text-red-500"
                onClick={toggleLike}
              >
                {liked ? (
                  <FaHeart className="mr-1 text-red-500" />
                ) : (
                  <FaRegHeart className="mr-1" />
                )}
                <span>{liked ? post.likes + 1 : post.likes}</span>
              </button>
              <div className="text-sm text-gray-500">
                {post.replies} replies
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold mb-3">Add Reply</h3>
        <div className="flex">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mr-2"
            placeholder="Share your thoughts..."
            rows={3}
          />
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
            onClick={handleAddReply}
            disabled={!replyText.trim()}
          >
            <FaPaperPlane className="mr-2" />
            Reply
          </button>
        </div>
      </div>

      {/* Replies List */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold mb-3">Replies</h3>
        <div className="space-y-4">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex items-start">
                <img
                  src={reply.authorAvatar || `/api/placeholder/40/40`}
                  alt={reply.author}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="font-medium">{reply.author}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {format(parseISO(reply.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-red-500">
                      <FaRegHeart />
                    </button>
                  </div>
                  <p className="text-gray-700">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ForumPostDetail;
