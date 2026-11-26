import { configureStore } from '@reduxjs/toolkit';
import goalReducer from './features/goalSlice';
import matchesReducer from './features/matchesSlice';
import { loadSaved, saveMatches } from './storage';

const saved = loadSaved();

export const hasSaved = saved !== null;

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    goal: goalReducer,
  },
  preloadedState: {
    matches: saved ?? [],
  },
});

let prevMatches = store.getState().matches;
store.subscribe(() => {
  const currentMatches = store.getState().matches;
  if (currentMatches !== prevMatches) {
    prevMatches = currentMatches;
    saveMatches(currentMatches);
  }
});
