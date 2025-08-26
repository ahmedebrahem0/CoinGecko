import React, { useEffect } from "react";
import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck className="w-5 h-5" />;
      case "error":
        return <FiX className="w-5 h-5" />;
      case "warning":
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600 dark:bg-green-600 dark:border-green-700";
      case "error":
        return "bg-red-500 text-white border-red-600 dark:bg-red-600 dark:border-red-700";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600 dark:bg-yellow-600 dark:border-yellow-700";
      default:
        return "bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700";
    }
  };

  const getAnimation = () => {
    return "animate-in slide-in-from-right-full duration-300";
  };

  return (
    <div
      className={`${getAnimation()} flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border-l-4 transition-all duration-300 ${getColors()}`}
      style={{
        minWidth: "300px",
        maxWidth: "400px",
      }}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-right" dir="rtl">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 mr-2 text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
