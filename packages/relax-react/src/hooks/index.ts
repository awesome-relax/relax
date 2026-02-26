/**
 * React hooks for Relax state management
 * Provides reactive integration between Relax state and React components
 */

import type { Action, State, Value } from '@relax-state/core';
import { resetRuntimeStore, setRuntimeStore } from '@relax-state/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRelaxStore } from '../provider';

/**
 * Hook for read-only subscription to Relax atoms/selectors
 * @template T - The type of the state value
 * @param state - The Relax state to subscribe to
 * @returns The current value of the state
 */
export const useRelaxValue = <T>(state: Value<T>): T => {
  const store = useRelaxStore();
  const [value, setValue] = useState<T>(() => store.get(state) as T);

  useEffect(() => {
    // Subscribe to state changes and update local state
    return store.effect(state, () => {
      setValue(store.get(state) as T);
    });
  }, [state, store]);

  // Return only the current value (read-only)
  return value;
};

/**
 * Hook for read-write subscription to Relax state
 * @template T - The type of the state value
 * @param state - The Relax state to subscribe to
 * @returns A tuple containing the current value and a setter function
 */
export const useRelaxState = <T>(state: State<T>): readonly [T, (value: T) => void] => {
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

/** Preserves each action's call signature (optional/required payload, no-arg for void). */
export const useActions = <const P extends Action[]>(actions: P) => {
  const store = useRelaxStore();
  return useMemo(
    () =>
      actions.map((action) => (...args: Parameters<P[number]>) => {
        setRuntimeStore(store);
        const result = (action as (...a: unknown[]) => unknown)(...args);
        resetRuntimeStore();
        return result;
      }),
    [actions, store]
  ) as { [K in keyof P]: P[K] extends (...args: infer A) => infer R ? (...args: A) => R : never };
};
