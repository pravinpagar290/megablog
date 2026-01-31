import React from "react";

// Pass `bgColor` and `textColor` as props with sensible defaults
function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600", // Default primary color
  textColor = "text-white", // Default text color for primary button
  className = "",
  ...props // Capture any other props like onClick, etc.
}) {
  return (
    <button
      className={`
                px-4 py-2 
                rounded-lg 
                ${bgColor} 
                ${textColor} 
                ${className} 
                font-semibold
                transition-all 
                duration-200 
                ease-in-out
                hover:shadow-md
                hover:opacity-90
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-2 
                focus:ring-blue-500
            `}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
