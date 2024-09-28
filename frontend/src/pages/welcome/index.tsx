
import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  buttonStyles,
  containerStyles,
  typographyStyles,
} from "../../styles/styles";

const HeroWelcome: React.FC = () => {
  return (
    <div className={`${containerStyles.fullScreenCenter} p-4`}>
      <div className={containerStyles.secondCard}>
        <h1 className={`${typographyStyles.heading1} mb-6 text-center text-5xl`}>
          Welcome to the unknown,{" "}
          <span className="text-indigo-300 logoTitle">Lingoleap</span>
        </h1>

        <p className="mb-4 text-xl font-light text-center">
          Unlock hidden doors and explore the world beyond language.
        </p>

        <div className="flex flex-col space-y-4">
          <Link href="/auth/signup" className={`${buttonStyles.primary} w-full py-3 transition-colors transform hover:scale-105 flex items-center justify-center space-x-2`}>
            <Image src="/assets/icons/remarque.svg" alt="Sign up" width={24} height={24} />
            <span>Start your adventure</span>
          </Link>

          <Link href="/auth/login" className={`${buttonStyles.secondary} w-full py-3 transition-colors transform hover:scale-105 flex items-center justify-center space-x-2`}>
            <Image src="/assets/icons/cle.svg" alt="Login" width={24} height={24} />
            <span>Continue your quest</span>
          </Link>
        </div>

        <p className="mt-6 text-center">Are you ready to unlock your mind?</p>
      </div>
    </div>
  );
};

export default HeroWelcome;