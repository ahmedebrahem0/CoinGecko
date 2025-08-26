import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";

const MoreDropdown = ({ title, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const defaultOptions = [
    { label: "View All", path: "/markets", icon: "📊" },
    { label: "Markets", path: "/markets", icon: "💹" },
    { label: "Exchanges", path: "/exchanges", icon: "🏢" },
    { label: "Portfolio", path: "/portfolio", icon: "💼" },
    { label: "Watchlist", path: "/watchlist", icon: "⭐" },
  ];

  const menuOptions = options.length > 0 ? options : defaultOptions;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent transition-colors flex items-center space-x-1"
      >
        <span>more</span>
        <IoMdArrowDropdown
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-light-card dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {menuOptions.map((option, index) => (
              <Link
                key={index}
                to={option.path}
                className="flex items-center space-x-2 px-4 py-2 text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-base">{option.icon}</span>
                <span>{option.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreDropdown;
