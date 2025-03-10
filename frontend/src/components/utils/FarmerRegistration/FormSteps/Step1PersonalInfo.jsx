import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, ChevronDown } from "lucide-react";
import Select from "react-select";

// Indian states data
const INDIAN_STATES = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
];

// Tamil Nadu districts
const TAMIL_NADU_DISTRICTS = [
  { value: "Ariyalur", label: "Ariyalur" },
  { value: "Chennai", label: "Chennai" },
  { value: "Coimbatore", label: "Coimbatore" },
  { value: "Cuddalore", label: "Cuddalore" },
  { value: "Dharmapuri", label: "Dharmapuri" },
  { value: "Dindigul", label: "Dindigul" },
  { value: "Erode", label: "Erode" },
  { value: "Kancheepuram", label: "Kancheepuram" },
  { value: "Kanyakumari", label: "Kanyakumari" },
  { value: "Karur", label: "Karur" },
  { value: "Krishnagiri", label: "Krishnagiri" },
  { value: "Madurai", label: "Madurai" },
  { value: "Nagapattinam", label: "Nagapattinam" },
  { value: "Namakkal", label: "Namakkal" },
  { value: "The Nilgiris", label: "The Nilgiris" },
  { value: "Perambalur", label: "Perambalur" },
  { value: "Pudukkottai", label: "Pudukkottai" },
  { value: "Ramanathapuram", label: "Ramanathapuram" },
  { value: "Salem", label: "Salem" },
  { value: "Sivagangai", label: "Sivagangai" },
  { value: "Thanjavur", label: "Thanjavur" },
  { value: "Theni", label: "Theni" },
  { value: "Thoothukudi", label: "Thoothukudi" },
  { value: "Tiruchirappalli", label: "Tiruchirappalli" },
  { value: "Tirunelveli", label: "Tirunelveli" },
  { value: "Tiruppur", label: "Tiruppur" },
  { value: "Tiruvallur", label: "Tiruvallur" },
  { value: "Tiruvannamalai", label: "Tiruvannamalai" },
  { value: "Tiruvarur", label: "Tiruvarur" },
  { value: "Vellore", label: "Vellore" },
  { value: "Viluppuram", label: "Viluppuram" },
  { value: "Virudhunagar", label: "Virudhunagar" },
  { value: "Kodaikanal", label: "Kodaikanal" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Pune", label: "Pune" },
  { value: "Jaipur", label: "Jaipur" },
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Lucknow", label: "Lucknow" },
  { value: "Indore", label: "Indore" },
  { value: "Bhopal", label: "Bhopal" },
  { value: "Patna", label: "Patna" },
  { value: "Ranchi", label: "Ranchi" },
  { value: "Bhubaneswar", label: "Bhubaneswar" },
  { value: "Visakhapatnam", label: "Visakhapatnam" },
  { value: "Guwahati", label: "Guwahati" },
  { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
  { value: "Mysuru", label: "Mysuru" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Noida", label: "Noida" },
];

// District data by state - simplified example
const DISTRICTS_BY_STATE = {
  "Tamil Nadu": TAMIL_NADU_DISTRICTS,
  // Other states would have their own districts here
};

const Step1PersonalInfo = ({ farmerInfo, setFarmerInfo, setStep }) => {
  const [availableDistricts, setAvailableDistricts] = useState([]);

  useEffect(() => {
    if (farmerInfo.state) {
      setAvailableDistricts(DISTRICTS_BY_STATE[farmerInfo.state] || []);
    }
  }, [farmerInfo.state]);

  const handleFarmerInfoChange = (e) => {
    const { name, value } = e.target;
    setFarmerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (selectedOption) => {
    setFarmerInfo((prev) => ({
      ...prev,
      state: selectedOption.value,
      district: "",
    }));
    setAvailableDistricts(DISTRICTS_BY_STATE[selectedOption.value] || []);
  };

  const handleDistrictChange = (selectedOption) => {
    setFarmerInfo((prev) => ({ ...prev, district: selectedOption.value }));
  };

  const isFormValid =
    farmerInfo.name &&
    farmerInfo.age &&
    farmerInfo.district &&
    farmerInfo.state;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 p-2 rounded-full">
          <User className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Personal Information
        </h2>
      </div>

      <div className="space-y-5">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={farmerInfo.name || ""}
            onChange={handleFarmerInfoChange}
            placeholder="Enter your full name"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-2.5 border"
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={farmerInfo.age || ""}
            onChange={handleFarmerInfoChange}
            placeholder="Enter your age"
            min="18"
            max="100"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-2.5 border"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State
            </label>
            <div className="relative">
              <Select
                id="state"
                name="state"
                value={
                  farmerInfo.state
                    ? { value: farmerInfo.state, label: farmerInfo.state }
                    : null
                }
                onChange={handleStateChange}
                options={INDIAN_STATES}
                placeholder="Select your state"
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable
                required
              />
              <div className="absolute right-2 top-2.5 pointer-events-none text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              District
            </label>
            <div className="relative">
              <Select
                id="district"
                name="district"
                value={
                  farmerInfo.district
                    ? { value: farmerInfo.district, label: farmerInfo.district }
                    : null
                }
                onChange={handleDistrictChange}
                options={availableDistricts}
                placeholder={
                  farmerInfo.state
                    ? "Select your district"
                    : "Please select a state first"
                }
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable
                isDisabled={!farmerInfo.state}
                required
              />
              <div className="absolute right-2 top-2.5 pointer-events-none text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => setStep(2)}
        disabled={!isFormValid}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${
            isFormValid
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }
          transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-6`}
      >
        Next: Land Information
      </motion.button>

      {!isFormValid && (
        <p className="text-sm text-center text-amber-600 mt-2">
          Please fill in all required fields to continue
        </p>
      )}
    </motion.div>
  );
};

export default Step1PersonalInfo;
