import { useState, useCallback, useRef } from "react";

/**
 * Generic undo/redo history hook.
 * @param {any} initialState
 */
export const useHistory = (initialState) => {
  const [state, setState] = useState(initialState);
  const past = useRef([]);
  const future = useRef([]);

  // Call this whenever a NEW change happens (not on undo/redo itself)
  const set = useCallback((newState) => {
    past.current.push(state);
    future.current = []; // clear redo stack on new action
    setState(newState);
  }, [state]);

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    const previous = past.current.pop();
    future.current.push(state);
    setState(previous);
  }, [state]);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    const next = future.current.pop();
    past.current.push(state);
    setState(next);
  }, [state]);

  // Use this to load a fresh layout without polluting history (e.g. on variant switch)
  const reset = useCallback((newState) => {
    past.current = [];
    future.current = [];
    setState(newState);
  }, []);

  return {
    state,
    set,
    undo,
    redo,
    reset,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
};