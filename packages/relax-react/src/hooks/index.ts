/**
 * React hooks for Relax state management
 * Provides reactive integration between Relax state and React components
 */

import { type State, type Value } from '@relax-state/core';
import { resetRuntimeStore, setRuntimeStore, type Store } from '@relax-state/store';
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

type AnyFn = (...args: any[]) => any;

type BoundAction<TAction> = TAction extends AnyFn
  ? (...args: Parameters<TAction>) => ReturnType<TAction>
  : never;

type BoundActions<TActions extends readonly unknown[]> = {
  [K in keyof TActions]: BoundAction<TActions[K]>;
};

type IsTuple<TActions extends readonly unknown[]> = number extends TActions['length']
  ? false
  : true;

type EnsureTuple<TActions extends readonly unknown[]> = IsTuple<TActions> extends true
  ? TActions
  : never;

const bindAction = <TAction extends AnyFn>(store: Store, action: TAction): BoundAction<TAction> => {
  const bound = (...args: Parameters<TAction>): ReturnType<TAction> => {
    setRuntimeStore(store);
    try {
      return action(...args);
    } finally {
      resetRuntimeStore();
    }
  };
  return bound as BoundAction<TAction>;
};

/** Preserves each action's call signature (optional/required payload, no-arg for void). */
export const useActions = <const P extends readonly AnyFn[]>(
  actions: EnsureTuple<P> & P
): BoundActions<P> => {
  const store = useRelaxStore();
  //
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useMemo(
    () => actions.map((action) => bindAction(store, action)) as BoundActions<P>,
    [...actions, store]
  );
};
