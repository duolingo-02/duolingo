import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { incrementLives } from "../redux/actions/gameActions";
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const useTimer = () => {
  const dispatch = useDispatch();
  const timerRef = useRef<number>(7200); // Initial timer value in seconds (e.g., 2 hours)
  const [remainingSeconds, setRemainingSeconds] = useState(timerRef.current); // Store raw seconds
  const [displayTimer, setDisplayTimer] = useState(formatTime(timerRef.current)); // Initialize formatted time

  // Function to format time in HH:MM:SS format
 
  useEffect(() => {
    setDisplayTimer(formatTime(timerRef.current)); // Set the initial formatted time

    const countdownInterval = setInterval(() => {
      if (timerRef.current <= 1) {
        dispatch(incrementLives());
        timerRef.current = 7200; // Reset timer
      } else {
        timerRef.current -= 1; // Decrement the timer
      }
      setRemainingSeconds(timerRef.current); // Update raw seconds
      setDisplayTimer(formatTime(timerRef.current)); // Update the formatted time
    }, 1000); // 1-second interval

    return () => clearInterval(countdownInterval); // Cleanup on unmount
  }, [dispatch]);

  return { displayTimer, remainingSeconds }; // Return both
};

export default useTimer;
  