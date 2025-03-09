import React from "react";
import { motion } from "framer-motion";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { format, parseISO } from "date-fns";

const ForumPostsList = ({ topic, posts, onSelectPost }) => {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${topic.color} p-4 rounded-lg flex items-center`}
      >
        <span className="text-2xl mr-2">{topic.icon}</span>
        <div>
          <h2 className="font-semibold text-lg">{topic.name}</h2>
          <p className="text-sm">{topic.description}</p>
        </div>
      </motion.div>

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm p-8 text-center"
        >
          <p className="text-gray-500">
            No posts yet in this topic. Be the first to start a discussion!
          </p>
        </motion.div>
      ) : (
        posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectPost(post.id)}
          >
            <div className="flex items-start">
              <img
                src={post.authorAvatar || `/api/placeholder/40/40`}
                alt={post.author}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{format(parseISO(post.date), "MMM d, yyyy")}</span>
                </div>
                <p className="text-gray-600 line-clamp-2">{post.content}</p>

                {post.images && post.images.length > 0 && (
                  <div className="mt-2">
                    <img
                      src={post.images[0] || `/api/placeholder/100/80`}
                      alt="Post attachment"
                      className="h-16 rounded-md object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <FaRegHeart className="mr-1" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRegComment className="mr-1" />
                    <span>{post.replies}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ForumPostsList;
