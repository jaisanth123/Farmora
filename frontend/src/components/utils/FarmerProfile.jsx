import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FarmerProfile = () => {
  const { currentUser } = useAuth();
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFarmerData();
  }, [currentUser, navigate]);

  const fetchFarmerData = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const token = await currentUser.getIdToken();

    try {
      const response = await fetch(
        `http://localhost:5000/api/farmer/data/${currentUser.uid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch farmer data");
      }

      const data = await response.json();
      setFarmerData(data);
      setFormData(data); // Initialize form data with current data
    } catch (error) {
      console.error("Error fetching farmer data:", error);
      toast.error("Error fetching farmer data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild
            ? { ...(prev[parent]?.[child] || {}), [grandchild]: value }
            : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `http://localhost:5000/api/farmer/data/${currentUser.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update farmer data");
      }

      const updatedData = await response.json();
      setFarmerData(updatedData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating farmer data:", error);
      toast.error("Error updating profile: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!farmerData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow">
          <h2 className="text-xl text-red-700">No data available</h2>
          <p className="text-gray-600 mt-2">
            Please complete your profile setup
          </p>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => setIsEditing(true)}
          >
            Setup Profile
          </button>
        </div>
      </div>
    );
  }

  // Display the edit form when isEditing is true
  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
          Update Farmer Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 text-white">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    name="landInfo.district"
                    value={formData.landInfo?.district || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Soil Properties */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Soil Properties
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nitrogen
                  </label>
                  <input
                    type="text"
                    name="landInfo.soilProperties.nitrogen"
                    value={formData.landInfo?.soilProperties?.nitrogen || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phosphorous
                  </label>
                  <input
                    type="text"
                    name="landInfo.soilProperties.phosphorous"
                    value={formData.landInfo?.soilProperties?.phosphorous || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Potassium
                  </label>
                  <input
                    type="text"
                    name="landInfo.soilProperties.potassium"
                    value={formData.landInfo?.soilProperties?.potassium || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    pH
                  </label>
                  <input
                    type="text"
                    name="landInfo.soilProperties.pH"
                    value={formData.landInfo?.soilProperties?.pH || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Environmental Conditions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="text"
                    name="landInfo.environmentalConditions.temperature"
                    value={
                      formData.landInfo?.environmentalConditions?.temperature ||
                      ""
                    }
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Humidity (%)
                  </label>
                  <input
                    type="text"
                    name="landInfo.environmentalConditions.humidity"
                    value={
                      formData.landInfo?.environmentalConditions?.humidity || ""
                    }
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rainfall (mm)
                  </label>
                  <input
                    type="text"
                    name="landInfo.environmentalConditions.rainfall"
                    value={
                      formData.landInfo?.environmentalConditions?.rainfall || ""
                    }
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Crops */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Crops
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crops (comma-separated)
                </label>
                <input
                  type="text"
                  name="crops"
                  value={(formData.landInfo?.crops || []).join(", ")}
                  onChange={(e) => {
                    const cropsArray = e.target.value
                      .split(",")
                      .map((crop) => crop.trim())
                      .filter(Boolean);
                    setFormData((prev) => ({
                      ...prev,
                      landInfo: {
                        ...(prev.landInfo || {}),
                        crops: cropsArray,
                      },
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Wheat, Rice, Corn"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
      </div>
    );
  }

  // Display view mode
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
        Farmer Profile
      </h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile   Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 text-white">
          <h2 className="text-2xl font-bold">
            {farmerData.personalInfo.name || "Farmer"}
          </h2>
          <p className="opacity-90">
            {farmerData.personalInfo.state || "N/A"},{" "}
            {farmerData.landInfo.district || "N/A"}
          </p>
        </div>

        {/* Profile Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2 mb-3">
              Personal Information
            </h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Name:</span>
                <span>{farmerData.personalInfo.name || "N/A"}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Age:</span>
                <span>{farmerData.personalInfo.age || "N/A"}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">State:</span>
                <span>{farmerData.personalInfo.state || "N/A"}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">District:</span>
                <span>{farmerData.landInfo?.district || "N/A"}</span>
              </p>
            </div>
          </div>

          {/* Land Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-3">
              Land Information
            </h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Location:</span>
                <span className="text-right">
                  {farmerData.landInfo?.location?.coordinates.join(", ") ||
                    "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Soil Properties */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-3">
              Soil Properties
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-sm text-gray-500">Nitrogen</p>
                <p className="font-semibold">
                  {farmerData.landInfo?.soilProperties?.nitrogen || "N/A"}
                </p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-sm text-gray-500">Phosphorous</p>
                <p className="font-semibold">
                  {farmerData.landInfo?.soilProperties?.phosphorous || "N/A"}
                </p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-sm text-gray-500">Potassium</p>
                <p className="font-semibold">
                  {farmerData.landInfo?.soilProperties?.potassium || "N/A"}
                </p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-sm text-gray-500">pH</p>
                <p className="font-semibold">
                  {farmerData.landInfo?.soilProperties?.pH || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="bg-sky-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-sky-800 border-b border-sky-200 pb-2 mb-3">
              Environmental Conditions
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="font-semibold">
                  {farmerData.landInfo?.environmentalConditions?.temperature ||
                    "N/A"}{" "}
                  °C
                </p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="font-semibold">
                  {farmerData.landInfo?.environmentalConditions?.humidity ||
                    "N/A"}{" "}
                  %
                </p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <p className="text-sm text-gray-500">Rainfall</p>
                <p className="font-semibold">
                  {farmerData.landInfo?.environmentalConditions?.rainfall ||
                    "N/A"}{" "}
                  mm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Crops */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Crops</h3>
          {farmerData.landInfo?.crops &&
          farmerData.landInfo.crops.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {farmerData.landInfo.crops.map((crop, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {crop}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No crops listed</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default FarmerProfile;
