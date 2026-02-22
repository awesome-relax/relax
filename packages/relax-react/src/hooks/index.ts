/**
 * React hooks for Relax state management
 * Provides reactive integration between Relax state and React components
 */

import type { Value, State } from '@relax-state/core';
import { useCallback, useEffect, useState } from 'react';
import { useRelaxStore } from '../provider';

/**
 * Hook for read-only subscription to Relax atoms/selectors
 * @template T - The type of the state value
 * @param state - The Relax state to subscribe to
 * @returns The current value of the state
 */
export const useRelaxValue = <T>(state: Value<T>) => {
  // Initialize state with current value from Relax
  const store = useRelaxStore();
  const [value, setValue] = useState<T>(() => store.get(state) as T);
  console.log('useRelaxValue: subscribing to state1', value);
  useEffect(() => {
    // Subscribe to state changes and update local state
    return store.effect(state, () => {
      setValue(store.get(state) as T);
    });
  }, [state, store]);

  // Return only the current value (read-only)
  return value;
};

export const useRelaxState = <T>(state: State<T>) => {
  // Initialize state with current value from Relax
  const store = useRelaxStore();
  const [value, setValue] = useState<T>(() => store.get(state) as T);

  useEffect(() => {
    // Subscribe to state changes and update local state
    return store.effect(state, () => {
      setValue(store.get(state) as T);
    });
  }, [state, store]);

  // Return the current value and a setter function for updating the state
  const setState = useCallback(
    (newValue: T) => {
      store.set(state, newValue);
    },
    [state, store]
  );

  return [value, setState] as const;
};
