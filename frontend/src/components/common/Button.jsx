import React from "react";

const Button = ({ label, icon, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-300 ${className}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
