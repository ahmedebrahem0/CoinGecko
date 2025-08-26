import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ currentCard, onBackToHighlights }) => {
  return (
    <nav className="flex items-center space-x-2 text-light-text dark:text-dark-text mb-4">
      <Link
        to="/"
        className="hover:text-light-accent dark:hover:text-dark-accent transition-colors duration-200"
      >
        Home
      </Link>

      {currentCard ? (
        <>
          <span>/</span>
          <Link
            to="/highlights"
            onClick={onBackToHighlights}
            className="hover:text-light-accent dark:hover:text-dark-accent transition-colors duration-200"
          >
            Highlights
          </Link>
          <span>/</span>
          <span className="text-light-text dark:text-dark-text font-medium">
            {currentCard}
          </span>
        </>
      ) : (
        <>
          <span>/</span>
          <span className="text-light-text dark:text-dark-text font-medium">
            Highlights
          </span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;
