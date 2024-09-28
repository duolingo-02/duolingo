'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchLanguages } from '../../redux/actions/languageAction';
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
} from "../../types/Game";

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

const SelectButton: React.FC<SelectButtonProps> = ({ onSelect }) => {
  return (
    <button onClick={onSelect} className={buttonStyles.primary}>
      Choose
    </button>
  );
};

const LanguageCard: React.FC<LanguageCardProps> = ({ image, name }) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={image}
        alt={name}
        width={256}
        height={160}
        className="object-cover w-64 h-40 mx-auto rounded-lg shadow-lg"
      />
      <p className="mt-4 text-2xl text-center text-duolingoLight">{name}</p>
    </div>
  );
};

const Lobby: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchLanguagesData = async () => {
      try {
        const resultAction = await dispatch(fetchLanguages());
        if (fetchLanguages.fulfilled.match(resultAction)) {
          const fetchedLanguages = resultAction.payload.map(lang => ({
            ...lang,
            image: lang.languagePicture || '' // Assuming 'languagePicture' is the correct field name
          }));
          setLanguages(fetchedLanguages);
        } else if (fetchLanguages.rejected.match(resultAction)) {
          setError("Error fetching languages");
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching languages");
        setLoading(false);
      }
    };
  
    fetchLanguagesData();
  }, [dispatch]);

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
      router.push(`/language/${selectedLanguage.id}/stages`);
    }
  }



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
          {languages.length > 0 && (
            <LanguageCard
              image={languages[currentIndex].image}
              name={languages[currentIndex].name}
            />
          )}
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