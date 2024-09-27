// GameWrapper.tsx
import React from "react";
import { GameWrapperProps } from "../../types/types"; // Import the updated type
import GameBar from "./GameBar";

/**
 * GameWrapper Component
 *
 * Wraps the children components with the GameBar.
 */
const GameWrapper: React.FC<GameWrapperProps> = ({ children, initialTimerValue }) => {
  return (
    <>
      <GameBar initialTimerValue={initialTimerValue} />
      <div>{children}</div>
    </>
  );
};

export default GameWrapper;