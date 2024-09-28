import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store/store";
import Image from "next/image";
import { incrementLives } from "../../redux/actions/gameActions";

interface GameBarProps {
  initialTimerValue: number;
}

const GameBar: React.FC<GameBarProps> = ({ initialTimerValue }) => {
  const dispatch = useDispatch();
  const lives = useSelector((state: RootState) => state.game.lives);
  const coins = useSelector((state: RootState) => state.game.coins);
  const extraLives = useSelector((state: RootState) => state.game.extraLives);
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const progressPercentage = useSelector((state: RootState) => state.game.progressPercentage);

  const [isOverallProgress, setIsOverallProgress] = useState(true);
  const [timerValue, setTimerValue] = useState(initialTimerValue);

  const overallProgress = userProfile ? (userProfile.totalPoints / 3).toFixed(2) : 0;

  const toggleProgressView = () => {
    setIsOverallProgress(!isOverallProgress);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setTimerValue(initialTimerValue);
  }, [initialTimerValue]);

  useEffect(() => {
    if (timerValue > 0) {
      const timer = setInterval(() => {
        setTimerValue(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timerValue === 0 && lives < extraLives.max) {
      dispatch(incrementLives());
      setTimerValue(initialTimerValue);
    }
  }, [timerValue, dispatch, extraLives.max, initialTimerValue, lives]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 md:flex-row md:space-x-4">
      <div className="flex flex-col items-center justify-center px-4 py-4 md:flex-row md:space-x-4">
        <div className="flex items-center p-2 rounded-full shadow-md bg-duolingoDark2">
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center">
                {index < lives ? (
                  <Image src="/assets/icons/coeur.svg" alt="Heart" width={24} height={24} className="w-6 h-6 text-white" />
                ) : (
                  <Image src="/assets/icons/toxique.svg" alt="Dead" width={24} height={24} className="w-6 h-6 text-white" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center md:flex-row md:space-x-4 mt-2 md:mt-0">
          <span className="font-bold text-white">
            {lives}/{extraLives.max}
          </span>
          {lives < 5 && (
            <span className="text-red-500 font-bold">
              {formatTime(timerValue)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center p-2 rounded-full shadow-md bg-duolingoDark2">
        <div className="relative w-40 h-6 mx-2 bg-gray-200 rounded-full">
          <div
            className="absolute left-0 h-full bg-green-500 rounded-full"
            style={{ width: `${isOverallProgress ? overallProgress : progressPercentage}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-white">
            {isOverallProgress ? `${overallProgress}%` : `${progressPercentage}%`}
          </span>
        </div>
        <button
          onClick={toggleProgressView}
          className="ml-2 text-sm text-white underline"
        >
          {isOverallProgress ? "View Language Progress" : "View Overall Progress"}
        </button>
      </div>

      <div className="flex items-center p-2 rounded-full shadow-md bg-duolingoDark2">
        <Image src="/assets/icons/euro.svg" alt="Coin" width={24} height={24} className="w-6 h-6" />
        <span className="ml-2 font-bold text-white">{coins}</span>
      </div>
    </div>
  );
};

export default GameBar;