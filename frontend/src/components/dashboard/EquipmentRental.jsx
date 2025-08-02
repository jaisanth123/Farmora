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
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    category: "",
    description: "",
    dailyRate: "",
    images: [],
    phoneNumber: "",
    status: "available",
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

  // Mock data for demonstration with proper farming equipment images
  useEffect(() => {
    const mockEquipment = [
      {
        id: 1,
        name: "John Deere Tractor",
        category: "Tractors",
        description: "Powerful 50HP tractor with modern features",
        dailyRate: 2500,
        images: [
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        ],
        phoneNumber: "+91 98765 43210",
        status: "available",
        owner: "Rajesh Kumar",
        location: "Erode, Tamil Nadu",
        distance: "2.5 km",
        rating: 4.5,
        reviews: 12,
        coordinates: [77.7274, 11.341],
      },
      {
        id: 2,
        name: "Drip Irrigation System",
        category: "Irrigation Systems",
        description: "Complete drip irrigation setup for 2 acres",
        dailyRate: 800,
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        ],
        phoneNumber: "+91 87654 32109",
        status: "booked",
        owner: "Suresh Patel",
        location: "Erode, Tamil Nadu",
        distance: "1.8 km",
        rating: 4.2,
        reviews: 8,
        coordinates: [77.73, 11.345],
      },
      {
        id: 3,
        name: "Combine Harvester",
        category: "Harvesters",
        description: "Efficient harvesting machine for wheat and rice",
        dailyRate: 5000,
        images: [
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400",
        ],
        phoneNumber: "+91 76543 21098",
        status: "available",
        owner: "Mohan Singh",
        location: "Erode, Tamil Nadu",
        distance: "4.2 km",
        rating: 4.8,
        reviews: 15,
        coordinates: [77.725, 11.338],
      },
      {
        id: 4,
        name: "Rotavator",
        category: "Plows",
        description: "Heavy-duty rotavator for soil preparation",
        dailyRate: 1200,
        images: [
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400",
        ],
        phoneNumber: "+91 65432 10987",
        status: "available",
        owner: "Kumar Singh",
        location: "Erode, Tamil Nadu",
        distance: "3.1 km",
        rating: 4.3,
        reviews: 9,
        coordinates: [77.728, 11.343],
      },
      {
        id: 5,
        name: "Seed Drill",
        category: "Seeders",
        description: "Precision seed drill for row planting",
        dailyRate: 600,
        images: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        ],
        phoneNumber: "+91 54321 09876",
        status: "available",
        owner: "Lakshmi Devi",
        location: "Erode, Tamil Nadu",
        distance: "1.5 km",
        rating: 4.6,
        reviews: 11,
        coordinates: [77.726, 11.34],
      },
      {
        id: 6,
        name: "Pesticide Sprayer",
        category: "Sprayers",
        description: "Backpack sprayer for pest control",
        dailyRate: 300,
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        ],
        phoneNumber: "+91 43210 98765",
        status: "maintenance",
        owner: "Ramesh Kumar",
        location: "Erode, Tamil Nadu",
        distance: "2.8 km",
        rating: 4.1,
        reviews: 7,
        coordinates: [77.729, 11.344],
      },
    ];

    setEquipment(mockEquipment);
    setFilteredEquipment(mockEquipment);
    setLoading(false);
  }, []);

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

    const equipmentToAdd = {
      id: Date.now(),
      ...newEquipment,
      owner: "You",
      location: farmerLocation || "Your Location",
      distance: "0 km",
      rating: 0,
      reviews: 0,
      coordinates: [77.7274, 11.341], // Default coordinates
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
          <FaPlus />
          Add Equipment
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <textarea
                placeholder="Description"
                value={newEquipment.description}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
                    description: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
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
                    <FaTractor className="text-gray-400 text-4xl" />
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
                  {item.location} • {item.distance}
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
