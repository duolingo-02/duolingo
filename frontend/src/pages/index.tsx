// Home.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import GameWrapper from "@/components/games/GameWrapper";
import Lobby from "@/components/games/LobbyLanguage"; // Lobby component to display available languages
import { setTime } from "@/redux/actions/gameActions"; // Action to increment time

/**
 * Home Component
 *
 * Displays the game Navbar and the Lobby of available languages.
 * Sets up a timer to increment time every second.
 */
const Home: React.FC = () => {
  const dispatch = useDispatch();
  
  const initialTimerValue = 10; // Set the initial timer value to 10 seconds
  const [remainingSeconds, setRemainingSeconds] = useState(initialTimerValue);
  
  useEffect(() => {
    // Set up a timer to decrement the remaining seconds
    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev > 0) {
          dispatch(setTime()); // Dispatch action to increment time
          return prev - 1; // Decrement the timer
        } else {
          clearInterval(interval); // Clear the interval if the timer reaches 0
          return 0; // Ensure it doesn't go below 0
        }
      });
    }, 1000);

    // Clear the timer on unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div>
      {/* Display the GameWrapper with timerValue passed to it */}
      <GameWrapper initialTimerValue={remainingSeconds}>
        {/* Display the Lobby with available languages */}
        <Lobby />
      </GameWrapper>
      {/* Optionally display the formatted timer for user visibility */}
    </div>
  );
};

export default Home;
