// src/layouts/GameLayout.tsx

import React, { ReactNode } from "react";
import { containerStyles } from "../styles/styles";

interface GameLayoutProps {
  children: ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <div className={`${containerStyles.gameContainer}`}>
      <div className="w-full max-w-4xl p-8 shadow-2xl bg-duolingoDark rounded-2xl">
        {/* Optionnel : Ajouter un logo ou une en-tête */}
        {/* <header className="mb-6 text-center">
          {/* <h1 className={typographyStyles.heading1}>Jeu de Langue</h1> */}
        {/* </header> */}
        {children}
      </div>
    </div>
  );
};

export default GameLayout;
