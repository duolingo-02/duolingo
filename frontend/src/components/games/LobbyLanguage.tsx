// ==============================
// Importing React, Axios, and Hooks
// ==============================
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ==============================
// Importing Styles and Types
// ==============================
import {
  buttonStyles,
  containerStyles,
  typographyStyles,
} from "../../styles/styles";
import {
  Language,
  LanguageCardProps,
  NavigationButtonProps,
  SelectButtonProps,
} from "../../types/Game"; // Importing types

/**
 * NavigationButton Component
 *
 * Handles left and right navigation for languages.
 */
const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="text-4xl text-duolingoLight hover:text-duolingoGreen"
    >
      {direction === "left" ? "◀" : "▶"}
    </button>
  );
};

/**
 * SelectButton Component
 *
 * Allows user to select a language.
 */
const SelectButton: React.FC<SelectButtonProps> = ({ onSelect }) => {
  return (
    <button onClick={onSelect} className={buttonStyles.primary}>
      Choose
    </button>
  );
};

/**
 * LanguageCard Component
 *
 * Displays the selected language with an image and name.
 */
const LanguageCard: React.FC<LanguageCardProps> = ({ image, name }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={image}
        alt={name}
        className="object-cover w-64 h-40 mx-auto rounded-lg shadow-lg"
      />
      <p className="mt-4 text-2xl text-center text-duolingoLight">{name}</p>
    </div>
  );
};

/**
 * Lobby Component
 *
 * Manages language selection and navigation for the lobby.
 */
const Lobby: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1274/api/language/get"
        );
        const formattedLanguages = response.data.map((language: any) => ({
          id: language.id,
          name: language.name,
          image: language.languagePicture,
        }));

        setLanguages(formattedLanguages);
        setLoading(false);
      } catch (err) {
        setError("Error fetching languages");
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleLeftClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? languages.length - 1 : prevIndex - 1
    );
  };

  const handleRightClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === languages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSelectLanguage = () => {
    const selectedLanguage = languages[currentIndex];
    if (selectedLanguage) {
      navigate(`/language/${selectedLanguage.id}/stages`);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-duolingoLight">Loading languages...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className={`${containerStyles.fullWidthCenter} p-4`}>
      <div className={containerStyles.card}>
        <h1 className={`${typographyStyles.heading1} text-center`}>
          Choose the language you want to learn
        </h1>
        <div className="flex items-center justify-center mt-8">
          <NavigationButton direction="left" onClick={handleLeftClick} />
          <LanguageCard
            image={languages[currentIndex].image}
            name={languages[currentIndex].name}
          />
          <NavigationButton direction="right" onClick={handleRightClick} />
        </div>
        <div className="flex justify-center mt-8">
          <SelectButton onSelect={handleSelectLanguage} />
        </div>
      </div>
    </div>
  );
};

export default Lobby;
