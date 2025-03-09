import React from "react";
import { motion } from "framer-motion";
import {
  FaSeedling,
  FaDisease,
  FaChartLine,
  FaComments,
  FaCloudSun,
} from "react-icons/fa";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "recommendation",
      name: "Wheat Crop Recommendation",
      date: "2 hours ago",
      status: "new",
      icon: <FaSeedling className="text-green-500" />,
    },
    {
      id: 2,
      type: "diagnosis",
      name: "Rice Blast Disease Alert",
      date: "Yesterday",
      status: "urgent",
      icon: <FaDisease className="text-red-500" />,
    },
    {
      id: 3,
      type: "market",
      name: "Cotton Price Update",
      date: "2 days ago",
      status: "positive",
      icon: <FaChartLine className="text-blue-500" />,
    },
    {
      id: 4,
      type: "forum",
      name: "Reply to your query on organic pesticides",
      date: "3 days ago",
      status: "new",
      icon: <FaComments className="text-purple-500" />,
    },
    {
      id: 5,
      type: "weather",
      name: "Heavy Rain Alert for Your Area",
      date: "1 week ago",
      status: "warning",
      icon: <FaCloudSun className="text-yellow-500" />,
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      case "positive":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-black">Recent Activity</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All
        </motion.button>
      </div>
      <div className="overflow-x-auto">
        <motion.table
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="min-w-full divide-y divide-gray-200"
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((activity) => (
              <motion.tr
                key={activity.id}
                variants={rowVariants}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="flex-shrink-0 h-10 w-10 flex items-center justify-center"
                    >
                      {activity.icon}
                    </motion.div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {activity.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activity.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default RecentActivity;
