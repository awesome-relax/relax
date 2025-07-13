/**
 * React hooks for Relax state management
 * Provides reactive integration between Relax state and React components
 */

import { useEffect, useState } from 'react';
import { type RelaxState, type RelaxValue, effect, get, update } from '@relax/core';

/**
 * Hook for using and updating Relax atoms/selectors in React components
 * @template T - The type of the state value
 * @template R - The type of the update parameter
 * @param relaxState - The Relax state to subscribe to
 * @returns A tuple containing the current value and a setter function
 */
export const useRelaxState = <T, R>(relaxState: RelaxState<T, R>) => {
  // Initialize state with current value from Relax
  const [state, setState] = useState<T>(() => get(relaxState) as T);

  useEffect(() => {
    // Subscribe to state changes and update local state
    return effect(relaxState, () => {
      setState(get(relaxState) as T);
    });
  }, [relaxState]);

  // Return current value and a setter that updates the Relax state
  return [state, (value: R) => update(relaxState, value)] as const;
};

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
