/**
 * React hooks for Relax state management
 * Provides reactive integration between Relax state and React components
 */

import { useEffect, useState } from 'react';
import { type RelaxValue, effect, get } from '@relax/core';

/**
 * Hook for read-only subscription to Relax atoms/selectors
 * @template T - The type of the state value
 * @param state - The Relax state to subscribe to
 * @returns The current value of the state
 */
export const useRelaxValue = <T>(state: RelaxValue<T>) => {
  // Initialize state with current value from Relax
  const [value, setValue] = useState<T>(() => get(state) as T);

  useEffect(() => {
    // Subscribe to state changes and update local state
    return effect(state, () => {
      setValue(get(state) as T);
    });
  }, [state]);

  // Return only the current value (read-only)
  return value;
};
