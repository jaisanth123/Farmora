import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaUserFriends,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaSearch,
  FaFilter,
  FaPlus,
  FaTools,
  FaSeedling,
  FaHandshake,
  FaMoneyBillWave,
} from "react-icons/fa";
import { toast } from "react-toastify";

const FarmAssistants = ({ farmerLocation }) => {
  const [assistants, setAssistants] = useState([]);
  const [filteredAssistants, setFilteredAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [showHireForm, setShowHireForm] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);

  const skills = [
    "Harvesting",
    "Planting",
    "Irrigation",
    "Pest Control",
    "Equipment Operation",
    "General Farm Work",
    "Organic Farming",
    "Livestock Care",
  ];

  const availabilityStatuses = ["available", "busy", "part-time"];

  // Mock data for demonstration
  useEffect(() => {
    const mockAssistants = [
      {
        id: 1,
        name: "Ramesh Kumar",
        age: 35,
        skills: ["Harvesting", "Planting", "General Farm Work"],
        experience: "8 years",
        dailyRate: 800,
        phoneNumber: "+91 98765 43210",
        availability: "available",
        location: "Erode, Tamil Nadu",
        distance: "1.2 km",
        rating: 4.6,
        reviews: 25,
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        coordinates: [77.7274, 11.341],
        description:
          "Experienced farm worker with expertise in rice and wheat cultivation",
        languages: ["Tamil", "Hindi", "English"],
        certifications: ["Organic Farming", "Pest Management"],
      },
      {
        id: 2,
        name: "Lakshmi Devi",
        age: 42,
        skills: ["Irrigation", "Pest Control", "Organic Farming"],
        experience: "12 years",
        dailyRate: 1000,
        phoneNumber: "+91 87654 32109",
        availability: "part-time",
        location: "Erode, Tamil Nadu",
        distance: "2.8 km",
        rating: 4.8,
        reviews: 18,
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
        coordinates: [77.73, 11.345],
        description:
          "Specialist in organic farming and sustainable agriculture practices",
        languages: ["Tamil", "English"],
        certifications: ["Organic Farming", "Sustainable Agriculture"],
      },
      {
        id: 3,
        name: "Suresh Patel",
        age: 28,
        skills: ["Equipment Operation", "Harvesting", "Livestock Care"],
        experience: "5 years",
        dailyRate: 900,
        phoneNumber: "+91 76543 21098",
        availability: "available",
        location: "Erode, Tamil Nadu",
        distance: "3.5 km",
        rating: 4.4,
        reviews: 12,
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        coordinates: [77.725, 11.338],
        description: "Skilled in operating modern farm equipment and machinery",
        languages: ["Tamil", "Hindi"],
        certifications: ["Equipment Operation", "Safety Training"],
      },
      {
        id: 4,
        name: "Meena Rani",
        age: 38,
        skills: ["Planting", "Harvesting", "General Farm Work"],
        experience: "10 years",
        dailyRate: 750,
        phoneNumber: "+91 65432 10987",
        availability: "busy",
        location: "Erode, Tamil Nadu",
        distance: "1.8 km",
        rating: 4.7,
        reviews: 20,
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
        coordinates: [77.728, 11.342],
        description: "Hardworking farm assistant with excellent track record",
        languages: ["Tamil", "Hindi"],
        certifications: ["Basic Farm Safety"],
      },
    ];

    setAssistants(mockAssistants);
    setFilteredAssistants(mockAssistants);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = assistants;

    if (searchTerm) {
      filtered = filtered.filter(
        (assistant) =>
          assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assistant.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assistant.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedSkill !== "all") {
      filtered = filtered.filter((assistant) =>
        assistant.skills.includes(selectedSkill)
      );
    }

    if (selectedAvailability !== "all") {
      filtered = filtered.filter(
        (assistant) => assistant.availability === selectedAvailability
      );
    }

    setFilteredAssistants(filtered);
  }, [searchTerm, selectedSkill, selectedAvailability, assistants]);

  const handleHireAssistant = (assistant) => {
    setSelectedAssistant(assistant);
    setShowHireForm(true);
  };

  const confirmHire = () => {
    toast.success(`Successfully hired ${selectedAssistant.name}!`);
    setShowHireForm(false);
    setSelectedAssistant(null);
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-yellow-100 text-yellow-800";
      case "busy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUserFriends className="mr-2 text-green-600" />
            Farm Assistants
          </h2>
          <p className="text-gray-600">
            Find skilled farm workers in your area
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assistants by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Skills</option>
            {skills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Availability</option>
            {availabilityStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assistants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssistants.map((assistant) => (
          <motion.div
            key={assistant.id}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Assistant Image and Status */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={assistant.image}
                alt={assistant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(
                    assistant.availability
                  )}`}
                >
                  {assistant.availability.charAt(0).toUpperCase() +
                    assistant.availability.slice(1)}
                </span>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {assistant.age} years
                </span>
              </div>
            </div>

            {/* Assistant Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">
                  {assistant.name}
                </h3>
                <span className="text-lg font-bold text-green-600">
                  ₹{assistant.dailyRate}/day
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {assistant.description}
              </p>

              {/* Experience and Location */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  {assistant.location} • {assistant.distance}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-3">
                <span className="font-medium">Experience:</span>{" "}
                {assistant.experience}
              </div>

              {/* Skills */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {assistant.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {assistant.skills.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{assistant.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.floor(assistant.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      } text-sm`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  ({assistant.reviews} reviews)
                </span>
              </div>

              {/* Contact and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <FaPhone className="mr-1" />
                  <span>{assistant.phoneNumber}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleHireAssistant(assistant)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <FaHandshake className="mr-1" />
                  Hire Now
                </button>
                <button className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAssistants.length === 0 && (
        <div className="text-center py-8">
          <FaUserFriends className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-500">
            No assistants found matching your criteria
          </p>
        </div>
      )}

      {/* Hire Confirmation Modal */}
      <AnimatePresence>
        {showHireForm && selectedAssistant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Hiring</h3>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  You're about to hire <strong>{selectedAssistant.name}</strong>
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Daily Rate:</span>
                    <span className="font-semibold">
                      ₹{selectedAssistant.dailyRate}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Experience:</span>
                    <span>{selectedAssistant.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills:</span>
                    <span>
                      {selectedAssistant.skills.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={confirmHire}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Hire
                </button>
                <button
                  onClick={() => setShowHireForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FarmAssistants;
