// src/components/forum/EmojiPickerContainer.jsx
import React from "react";
import Picker from "emoji-picker-react";
import { FaTimes } from "react-icons/fa";

const EmojiPickerContainer = ({ onEmojiClick, onClose }) => {
  return (
    <div className="absolute right-0 z-10 mt-2">
      <div className="relative">
        <button
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-20 shadow-md hover:bg-red-600 transition-colors"
          onClick={onClose}
          aria-label="Close emoji picker"
        >
          <FaTimes size={12} />
        </button>
        <div className="shadow-xl rounded-lg overflow-hidden">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      </div>
    </div>
  );
};

export default EmojiPickerContainer;
