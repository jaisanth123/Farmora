// src/components/forum/ImagePreview.jsx
import React from "react";
import { FaTimes } from "react-icons/fa";

const ImagePreview = ({ image, onRemove }) => {
  return (
    <div className="relative inline-block group">
      <img
        src={image}
        alt="Upload preview"
        className="max-h-48 rounded-lg object-cover shadow-md group-hover:opacity-95 transition-opacity"
      />
      <button
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
        onClick={onRemove}
        aria-label="Remove image"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

export default ImagePreview;
