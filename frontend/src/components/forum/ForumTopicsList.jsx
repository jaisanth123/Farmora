import React from "react";
import { motion } from "framer-motion";

const ForumTopicsList = ({ topics, onSelectTopic }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {topics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectTopic(topic.id)}
        >
          <div className="flex items-start">
            <div
              className={`${topic.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4`}
            >
              {topic.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{topic.name}</h3>
              <p className="text-gray-600 text-sm">{topic.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {topic.postCount} posts
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ForumTopicsList;
