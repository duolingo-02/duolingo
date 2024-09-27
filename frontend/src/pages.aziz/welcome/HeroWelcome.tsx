// ==============================
// Importing React, Router and Icons
// ==============================
import React from "react";
import { Link } from "react-router-dom"; // For navigation between pages
import { ReactComponent as Key } from "../../assets/icons/cle.svg"; // Key icon for the login button
import { ReactComponent as Stylo } from "../../assets/icons/remarque.svg"; // Pen icon for the sign-up button

// ==============================
// Importing Styles
// ==============================
import {
  buttonStyles, // Predefined button styles
  containerStyles, // Styles for container and layout
  typographyStyles, // Styles for typography (headings, etc.)
} from "../../styles/styles"; // Centralized styles for consistency


/**
 * HeroWelcome Component
 *
 * A welcoming hero section for the app's homepage,
 * offering sign-up and login options with stylish buttons.
 */
const HeroWelcome: React.FC = () => {
  
  return (
    <div className={`${containerStyles.fullScreenCenter} p-4`}>
      {/* Main Card Section */}
      <div className={containerStyles.secondCard}>
        {/* Main Title */}
        <h1
          className={`${typographyStyles.heading1} mb-6 text-center text-5xl`}
        >
          Welcome to the unknown,{" "}
          <span className="text-indigo-300 logoTitle">Lingoleap</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-4 text-xl font-light text-center">
          Unlock hidden doors and explore the world beyond language.
        </p>

        {/* Buttons Section */}
        <div className="flex flex-col space-y-4">
          {/* Sign-Up Button */}
          <Link
            to="/register"
            className={`${buttonStyles.primary} w-full py-3 transition-colors transform hover:scale-105 flex items-center justify-center space-x-2`}
          >
            <Stylo className="w-6 h-6" /> {/* Icon for sign-up */}
            <span>Start your adventure</span> {/* Button text */}
          </Link>

          {/* Login Button */}
          <Link
            to="/login"
            className={`${buttonStyles.secondary} w-full py-3 transition-colors transform hover:scale-105 flex items-center justify-center space-x-2`}
          >
            <Key className="w-6 h-6" /> {/* Icon for login */}
            <span>Continue your quest</span> {/* Button text */}
          </Link>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center">Are you ready to unlock your mind?</p>
      </div>
    </div>
  );
};

export default HeroWelcome;
