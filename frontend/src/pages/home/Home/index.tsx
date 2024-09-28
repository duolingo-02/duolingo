'use client'

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import GameWrapper from "../../../components/games/GameWrapper";
import Lobby from "../../../components/games/LobbyLanguage";
import { setTime } from "../../../redux/actions/gameActions";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  
  const initialTimerValue = 10;
  const [remainingSeconds, setRemainingSeconds] = useState(initialTimerValue);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev > 0) {
          dispatch(setTime());
          return prev - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div>
      <GameWrapper initialTimerValue={remainingSeconds}>
        <Lobby />
      </GameWrapper>
    </div>
  );
};

export default Home;