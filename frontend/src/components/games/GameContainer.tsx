// ==============================
// Importing React and Hooks
// ==============================
import React, { useEffect, useState } from "react";

// ==============================
// Importing Styles and Types
// ==============================
import { containerStyles } from "../../styles/styles";
import { GameContainerProps } from "../../types/Game"; // Importing the separated types

/**
 * GameContainer Component
 *
 * Manages a timed game session with a progress bar.
 */
const GameContainer: React.FC<GameContainerProps> = ({
  onTimeUp,
  children,
}) => {
  const [progress, setProgress] = useState(0);
  const duration = 15 * 1000; // 15 seconds

  // Manage the progress bar and handle time expiration
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / duration) * 100;
      if (newProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
        onTimeUp(); // Trigger callback when time is up
      } else {
        setProgress(newProgress);
      }
    }, 100); // Update progress every 0.1 second

    return () => clearInterval(interval); // Cleanup interval
  }, [onTimeUp]);

  return (
    <div className={`${containerStyles.fullWidthCenter} p-4`}>
      <div className={containerStyles.gameCard}>
        {/* Progress Bar */}
        <div className="relative w-full h-4 mb-6 rounded-full">
          <div
            className="h-full rounded-full bg-duolingoGreen"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center">{children}</div>
      </div>
    </div>
  );
};

export default GameContainer;
