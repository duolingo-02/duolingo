'use client'

import React from "react";
import { useRouter } from "next/router";

import {
  buttonStyles,
  containerStyles,
  typographyStyles,
} from "../../../styles/styles";

const TermsAndConditions: React.FC = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className={`${containerStyles.fullScreenCenter} p-4`}>
      <div className={containerStyles.secondCard}>
        <h1
          className={`${typographyStyles.heading1} text-5xl text-center logoTitle text-blue-300`}
        >
          Lingoleap
        </h1>

        <h2 className={`${typographyStyles.heading2} mb-6 text-center`}>
          Terms and Conditions
        </h2>

        <div className="mb-4 text-center" style={{ color: 'Silver' }}>
          <p>
            Welcome to Lingoleap! By accessing or using our services, you agree
            to be bound by these terms and conditions.
          </p>
          <p className="mt-2">
            Please review them carefully. If you do not agree with any part of
            these terms, you may not use our services.
          </p>
          <p className="mt-4">
            <strong>1. Use of Service:</strong> You are responsible for
            maintaining the confidentiality of your account and password.
          </p>
          <p className="mt-2">
            <strong>2. Privacy Policy:</strong> Your privacy is important to us.
            Please review our privacy policy for more details.
          </p>
          <p className="mt-2">
            <strong>3. Changes to Terms:</strong> We reserve the right to modify
            these terms at any time. Any changes will be posted on this page.
          </p>
          <p className="mt-4">Thank you for using Lingoleap.</p>
        </div>

        <button
          onClick={handleBackClick}
          className={`${buttonStyles.primary} mt-4`}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;