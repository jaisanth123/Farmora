import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaTractor,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaSearch,
  FaFilter,
  FaPlus,
  FaUpload,
  FaPen,
  FaLocationArrow,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

const EquipmentRental = ({ farmerLocation }) => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    category: "",
    description: "",
    dailyRate: "",
    images: [],
    phoneNumber: "",
    status: "available",
    latitude: "",
    longitude: "",
  });

  const categories = [
    "Tractors",
    "Harvesters",
    "Irrigation Systems",
    "Plows",
    "Seeders",
    "Sprayers",
    "Other",
  ];

  const statuses = ["available", "booked", "maintenance"];

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
        }
      }
    }
  }, [farmerLocation]);

  // Mock data for demonstration with different coordinates across Tamil Nadu
  useEffect(() => {
    const mockEquipment = [
      {
        id: 1,
        name: "John Deere Tractor",
        category: "Tractors",
        description: "Powerful 50HP tractor with modern features",
        dailyRate: 2500,
        images: [],
        phoneNumber: "+91 98765 43210",
        status: "available",
        owner: "Rajesh Kumar",
        location: "Erode, Tamil Nadu",
        rating: 4.5,
        reviews: 12,
        coordinates: [77.7274, 11.341], // Erode
      },
      {
        id: 2,
        name: "Drip Irrigation System",
        category: "Irrigation Systems",
        description: "Complete drip irrigation setup for 2 acres",
        dailyRate: 800,
        images: [],
        phoneNumber: "+91 87654 32109",
        status: "booked",
        owner: "Suresh Patel",
        location: "Coimbatore, Tamil Nadu",
        rating: 4.2,
        reviews: 8,
        coordinates: [76.9558, 11.0168], // Coimbatore
      },
      {
        id: 3,
        name: "Combine Harvester",
        category: "Harvesters",
        description: "Efficient harvesting machine for wheat and rice",
        dailyRate: 5000,
        images: [],
        phoneNumber: "+91 76543 21098",
        status: "available",
        owner: "Mohan Singh",
        location: "Madurai, Tamil Nadu",
        rating: 4.8,
        reviews: 15,
        coordinates: [78.1198, 9.9252], // Madurai
      },
      {
        id: 4,
        name: "Rotavator",
        category: "Plows",
        description: "Heavy-duty rotavator for soil preparation",
        dailyRate: 1200,
        images: [],
        phoneNumber: "+91 65432 10987",
        status: "available",
        owner: "Kumar Singh",
        location: "Salem, Tamil Nadu",
        rating: 4.3,
        reviews: 9,
        coordinates: [78.146, 11.6643], // Salem
      },
      {
        id: 5,
        name: "Seed Drill",
        category: "Seeders",
        description: "Precision seed drill for row planting",
        dailyRate: 600,
        images: [],
        phoneNumber: "+91 54321 09876",
        status: "available",
        owner: "Lakshmi Devi",
        location: "Tiruchirappalli, Tamil Nadu",
        rating: 4.6,
        reviews: 11,
        coordinates: [78.7047, 10.7905], // Tiruchirappalli
      },
      {
        id: 6,
        name: "Pesticide Sprayer",
        category: "Sprayers",
        description: "Backpack sprayer for pest control",
        dailyRate: 300,
        images: [],
        phoneNumber: "+91 43210 98765",
        status: "maintenance",
        owner: "Ramesh Kumar",
        location: "Chennai, Tamil Nadu",
        rating: 4.1,
        reviews: 7,
        coordinates: [80.2707, 13.0827], // Chennai
      },
      {
        id: 7,
        name: "Mini Tractor",
        category: "Tractors",
        description: "Compact tractor for small farms",
        dailyRate: 1500,
        images: [],
        phoneNumber: "+91 32109 87654",
        status: "available",
        owner: "Anand Kumar",
        location: "Vellore, Tamil Nadu",
        rating: 4.4,
        reviews: 10,
        coordinates: [79.1596, 12.9716], // Vellore
      },
      {
        id: 8,
        name: "Sprinkler System",
        category: "Irrigation Systems",
        description: "Automated sprinkler system for 3 acres",
        dailyRate: 900,
        images: [],
        phoneNumber: "+91 21098 76543",
        status: "available",
        owner: "Priya Devi",
        location: "Thanjavur, Tamil Nadu",
        rating: 4.7,
        reviews: 13,
        coordinates: [79.1378, 10.7905], // Thanjavur
      },
    ];

    // Calculate distances and sort by distance if user location is available
    let equipmentWithDistance = mockEquipment;
    if (userLocation) {
      equipmentWithDistance = mockEquipment
        .map((item) => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            item.coordinates[1], // latitude
            item.coordinates[0] // longitude
          );
          return {
            ...item,
            distance: distance.toFixed(1),
            distanceValue: distance,
          };
        })
        .sort((a, b) => a.distanceValue - b.distanceValue); // Sort by distance
    } else {
      // If no user location, add default distances
      equipmentWithDistance = mockEquipment.map((item) => ({
        ...item,
        distance: "N/A",
        distanceValue: 999999,
      }));
    }

    setEquipment(equipmentWithDistance);
    setFilteredEquipment(equipmentWithDistance);
    setLoading(false);
  }, [userLocation]);

  useEffect(() => {
    let filtered = equipment;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredEquipment(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, equipment]);

  const handleAddEquipment = () => {
    if (
      !newEquipment.name ||
      !newEquipment.category ||
      !newEquipment.dailyRate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Use coordinates from form or default coordinates
    const lat = parseFloat(newEquipment.latitude) || 11.341;
    const lng = parseFloat(newEquipment.longitude) || 77.7274;

    const equipmentToAdd = {
      id: Date.now(),
      ...newEquipment,
      owner: "You",
      location: farmerLocation || "Your Location",
      distance: "0 km",
      rating: 0,
      reviews: 0,
      coordinates: [lng, lat], // [longitude, latitude] format
    };

    setEquipment([equipmentToAdd, ...equipment]);
    setNewEquipment({
      name: "",
      category: "",
      description: "",
      dailyRate: "",
      images: [],
      phoneNumber: "",
      status: "available",
      latitude: "",
      longitude: "",
    });
    setShowAddForm(false);
    toast.success("Equipment added successfully!");
  };

  const handleStatusChange = (equipmentId, newStatus) => {
    setEquipment(
      equipment.map((item) =>
        item.id === equipmentId ? { ...item, status: newStatus } : item
      )
    );
    toast.success(`Equipment status updated to ${newStatus}`);
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
        setNewEquipment((prev) => ({
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

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "booked":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
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
            <FaTractor className="mr-2 text-green-600" />
            Equipment Rental
          </h2>
          <p className="text-gray-600">
            Rent equipment from nearby farmers or list your own
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
              Add Equipment
            </>
          )}
        </motion.button>
      </div>

      {/* Add Equipment Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-4">Add Your Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Equipment Name"
                value={newEquipment.name}
                onChange={(e) =>
                  setNewEquipment({ ...newEquipment, name: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select
                value={newEquipment.category}
                onChange={(e) =>
                  setNewEquipment({ ...newEquipment, category: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Daily Rate (₹)"
                value={newEquipment.dailyRate}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
                    dailyRate: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newEquipment.phoneNumber}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
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
                value={newEquipment.latitude}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
                    latitude: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={newEquipment.longitude}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
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

            <div className="mt-4">
              <textarea
                placeholder="Description"
                value={newEquipment.description}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
                    description: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddEquipment}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Equipment
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
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image Carousel */}
            <div className="relative h-48 bg-gray-100">
              <AnimatePresence mode="wait">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <FaTractor className="text-gray-400 text-4xl mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs">Image coming soon</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Equipment Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <span className="text-lg font-bold text-green-600">
                  ₹{item.dailyRate}/day
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>

              {/* Owner and Location */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  {item.location} •{" "}
                  <span className="font-medium text-green-600">
                    {item.distance} km
                  </span>
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < Math.floor(item.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      } text-sm`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  ({item.reviews} reviews)
                </span>
              </div>

              {/* Contact and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <FaPhone className="mr-1" />
                  <span>{item.phoneNumber}</span>
                </div>
                {item.owner === "You" && (
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value)
                    }
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex gap-2">
                <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Contact Owner
                </button>
                <button className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-8">
          <FaTractor className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-500">
            No equipment found matching your criteria
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default EquipmentRental;
