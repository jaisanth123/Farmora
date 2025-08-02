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
  FaTimes,
  FaLocationArrow,
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
  const [userLocation, setUserLocation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAssistant, setNewAssistant] = useState({
    name: "",
    age: "",
    skills: [],
    experience: "",
    dailyRate: "",
    phoneNumber: "",
    availability: "available",
    latitude: "",
    longitude: "",
    description: "",
    languages: [],
    certifications: [],
  });

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

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Extract user location from farmerLocation prop
  useEffect(() => {
    if (farmerLocation) {
      // Try to extract coordinates from the location string
      const locationMatch = farmerLocation.match(/\(([^,]+),\s*([^)]+)\)/);
      if (locationMatch) {
        const lat = parseFloat(locationMatch[1]);
        const lng = parseFloat(locationMatch[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          setUserLocation({ lat, lng });
          console.log("User location set:", { lat, lng });
        }
      } else {
        // If no coordinates found, try to use the location name directly
        console.log("No coordinates found in:", farmerLocation);
      }
    }
  }, [farmerLocation]);

  // Mock data for demonstration with different coordinates across Tamil Nadu
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
        rating: 4.6,
        reviews: 25,
        coordinates: [77.7274, 11.341], // Erode
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
        location: "Coimbatore, Tamil Nadu",
        rating: 4.8,
        reviews: 18,
        coordinates: [76.9558, 11.0168], // Coimbatore
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
        location: "Madurai, Tamil Nadu",
        rating: 4.4,
        reviews: 12,
        coordinates: [78.1198, 9.9252], // Madurai
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
        location: "Salem, Tamil Nadu",
        rating: 4.7,
        reviews: 20,
        coordinates: [78.146, 11.6643], // Salem
        description: "Hardworking farm assistant with excellent track record",
        languages: ["Tamil", "Hindi"],
        certifications: ["Basic Farm Safety"],
      },
      {
        id: 5,
        name: "Kumar Singh",
        age: 45,
        skills: ["Livestock Care", "General Farm Work", "Equipment Operation"],
        experience: "15 years",
        dailyRate: 1200,
        phoneNumber: "+91 54321 09876",
        availability: "available",
        location: "Tiruchirappalli, Tamil Nadu",
        rating: 4.9,
        reviews: 30,
        coordinates: [78.7047, 10.7905], // Tiruchirappalli
        description: "Expert in livestock management and dairy farming",
        languages: ["Tamil", "Hindi", "English"],
        certifications: ["Livestock Management", "Dairy Farming"],
      },
      {
        id: 6,
        name: "Priya Devi",
        age: 32,
        skills: ["Organic Farming", "Pest Control", "Irrigation"],
        experience: "7 years",
        dailyRate: 850,
        phoneNumber: "+91 43210 98765",
        availability: "part-time",
        location: "Chennai, Tamil Nadu",
        rating: 4.3,
        reviews: 15,
        coordinates: [80.2707, 13.0827], // Chennai
        description: "Specialized in organic farming and sustainable practices",
        languages: ["Tamil", "English"],
        certifications: ["Organic Farming", "Sustainable Agriculture"],
      },
      {
        id: 7,
        name: "Anand Kumar",
        age: 40,
        skills: ["Harvesting", "Planting", "Equipment Operation"],
        experience: "11 years",
        dailyRate: 950,
        phoneNumber: "+91 32109 87654",
        availability: "available",
        location: "Vellore, Tamil Nadu",
        rating: 4.5,
        reviews: 22,
        coordinates: [79.1596, 12.9716], // Vellore
        description: "Versatile farm worker with expertise in multiple crops",
        languages: ["Tamil", "Hindi"],
        certifications: ["Crop Management", "Safety Training"],
      },
      {
        id: 8,
        name: "Sita Rani",
        age: 36,
        skills: ["General Farm Work", "Harvesting", "Planting"],
        experience: "9 years",
        dailyRate: 700,
        phoneNumber: "+91 21098 76543",
        availability: "available",
        location: "Thanjavur, Tamil Nadu",
        rating: 4.6,
        reviews: 19,
        coordinates: [79.1378, 10.7905], // Thanjavur
        description: "Dedicated farm worker with strong work ethic",
        languages: ["Tamil", "Hindi"],
        certifications: ["Basic Farm Safety"],
      },
    ];

    // Calculate distances and sort by distance if user location is available
    let assistantsWithDistance = mockAssistants;
    if (userLocation) {
      console.log("Calculating distances from user location:", userLocation);
      assistantsWithDistance = mockAssistants
        .map((item) => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            item.coordinates[1], // latitude
            item.coordinates[0] // longitude
          );
          console.log(
            `${item.name} (${item.location}): ${distance.toFixed(1)} km`
          );
          return {
            ...item,
            distance: distance.toFixed(1),
            distanceValue: distance,
          };
        })
        .sort((a, b) => a.distanceValue - b.distanceValue); // Sort by distance
      console.log("Sorted assistants by distance");
    } else {
      console.log("No user location available, showing default order");
      // If no user location, add default distances
      assistantsWithDistance = mockAssistants.map((item) => ({
        ...item,
        distance: "N/A",
        distanceValue: 999999,
      }));
    }

    setAssistants(assistantsWithDistance);
    setFilteredAssistants(assistantsWithDistance);
    setLoading(false);
  }, [userLocation]);

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

  // Get current location and fill coordinates
  const getCurrentLocationForForm = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setNewAssistant((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));
        toast.success("Current location detected and coordinates filled!");
      },
      (error) => {
        console.error("Error getting current location:", error);
        let errorMessage = "Unable to get current location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "Unable to get current location.";
        }

        toast.error(errorMessage);
      },
      options
    );
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

  const handleAddAssistant = () => {
    if (
      !newAssistant.name ||
      !newAssistant.age ||
      !newAssistant.dailyRate ||
      !newAssistant.experience
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Use coordinates from form or default coordinates
    const lat = parseFloat(newAssistant.latitude) || 11.341;
    const lng = parseFloat(newAssistant.longitude) || 77.7274;

    const assistantToAdd = {
      id: Date.now(),
      ...newAssistant,
      age: parseInt(newAssistant.age),
      dailyRate: parseInt(newAssistant.dailyRate),
      location: farmerLocation || "Your Location",
      distance: "0 km",
      rating: 0,
      reviews: 0,
      coordinates: [lng, lat], // [longitude, latitude] format
    };

    setAssistants([assistantToAdd, ...assistants]);
    setNewAssistant({
      name: "",
      age: "",
      skills: [],
      experience: "",
      dailyRate: "",
      phoneNumber: "",
      availability: "available",
      latitude: "",
      longitude: "",
      description: "",
      languages: [],
      certifications: [],
    });
    setShowAddForm(false);
    toast.success("Farm assistant added successfully!");
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          {showAddForm ? (
            <>
              <FaTimes />
              Close
            </>
          ) : (
            <>
              <FaPlus />
              Add Farm Assistant
            </>
          )}
        </motion.button>
      </div>

      {/* Add Farm Assistant Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-4">
              Add Your Farm Assistant Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newAssistant.name}
                onChange={(e) =>
                  setNewAssistant({ ...newAssistant, name: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Age"
                value={newAssistant.age}
                onChange={(e) =>
                  setNewAssistant({ ...newAssistant, age: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Daily Rate (₹)"
                value={newAssistant.dailyRate}
                onChange={(e) =>
                  setNewAssistant({
                    ...newAssistant,
                    dailyRate: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newAssistant.phoneNumber}
                onChange={(e) =>
                  setNewAssistant({
                    ...newAssistant,
                    phoneNumber: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={newAssistant.latitude}
                onChange={(e) =>
                  setNewAssistant({
                    ...newAssistant,
                    latitude: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={newAssistant.longitude}
                onChange={(e) =>
                  setNewAssistant({
                    ...newAssistant,
                    longitude: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={getCurrentLocationForForm}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaLocationArrow />
                Use Current Location
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="Experience (e.g., 5 years)"
                value={newAssistant.experience}
                onChange={(e) =>
                  setNewAssistant({
                    ...newAssistant,
                    experience: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select
                value={newAssistant.availability}
                onChange={(e) =>
                  setNewAssistant({
                    ...newAssistant,
                    availability: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="part-time">Part-time</option>
                <option value="busy">Busy</option>
              </select>
            </div>

            <div className="mt-4">
              <textarea
                placeholder="Description about your skills and experience"
                value={newAssistant.description}
                onChange={(e) =>
                  setNewAssistant({
                    ...newAssistant,
                    description: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddAssistant}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Farm Assistant
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <FaUserFriends className="text-gray-400 text-4xl mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">{assistant.name}</p>
                  <p className="text-gray-400 text-xs">Photo coming soon</p>
                </div>
              </div>
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
                  {assistant.location} •{" "}
                  <span className="font-medium text-green-600">
                    {assistant.distance} km
                  </span>
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
