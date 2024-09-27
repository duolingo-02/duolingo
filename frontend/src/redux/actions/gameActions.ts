// ==============================
// Importing Redux Toolkit
// ==============================
import { createAction } from "@reduxjs/toolkit";

// ==============================
// Game Actions
// ==============================

// Lives actions
export const decrementLives = createAction("game/decrementLives");
export const incrementLives = createAction("game/incrementLives");

// Timer actions
export const setTime = createAction("game/setTime");
export const resetTime = createAction("game/resetTime");

// Energy actions
export const decrementEnergy = createAction("game/decrementEnergy");
export const incrementEnergy = createAction<number>("game/incrementEnergy");

// Progress actions
export const setProgress = createAction<number>("game/setProgress");
export const incrementProgress = createAction<number>("game/incrementProgress");

// Coins actions
export const addCoins = createAction<number>("game/addCoins");
export const decrementCoins = createAction<number>("game/decrementCoins");

// Progress Percentage actions
export const setProgressPercentage = createAction<number>("game/setProgressPercentage");
export const incrementProgressPercentage = createAction<number>("game/incrementProgressPercentage");
// Extra Lives actions
export const setExtraLives = createAction<{
  current: number;
  timer: string;
}>("game/setExtraLives");
export const resetExtraLives = createAction("game/resetExtraLives");
