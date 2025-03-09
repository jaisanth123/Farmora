import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const SelectableCropList = ({ allCrops, selectedCrops, onSelectionChange }) => {
  const handleToggleCrop = (crop) => {
    if (selectedCrops.includes(crop)) {
      onSelectionChange(selectedCrops.filter((c) => c !== crop));
    } else {
      onSelectionChange([...selectedCrops, crop]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allCrops.map((crop) => {
        const isSelected = selectedCrops.includes(crop);
        return (
          <button
            key={crop}
            onClick={() => handleToggleCrop(crop)}
            className={`flex items-center py-1 px-3 rounded-full text-sm transition-colors duration-200 ${
              isSelected
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            }`}
          >
            {crop}
            {isSelected ? (
              <FaCheckCircle className="ml-1 text-green-500" size={12} />
            ) : (
              <FaTimesCircle className="ml-1 text-gray-400" size={12} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SelectableCropList;
