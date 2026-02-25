/**
 * Store module for Relax framework
 * Provides the Store class for managing reactive state and effects
 * @module store
 * @example
 * ```typescript
 * const store = createStore();
 * const count = state(0);
 * store.set(count, 5);
 * console.log(store.get(count)); // 5
 * ```
 */

import {
  type ComputedFn,
  RELAX_NODES,
  type State,
  type Value,
} from '@relax-state/core';

/**
 * Store class for managing reactive state
 * Provides methods for getting, setting state values and managing side effects
 *
 * The Store is the central hub for state management in Relax. It:
 * - Stores state values and computed values
 * - Manages effects (subscriptions to state changes)
 * - Handles circular dependency detection for computed values
 *
 * @example
 * ```typescript
 * // Create a store
 * const store = createStore();
 *
 * // Create some state
 * const count = state(0);
 * const name = state('Relax');
 *
 * // Read state
 * console.log(store.get(count)); // 0
 *
 * // Update state
 * store.set(count, 5);
 *
 * // Add an effect
 * store.effect(count, ({ oldValue, newValue }) => {
 *   console.log(`Count changed from ${oldValue} to ${newValue}`);
 * });
 * ```
 */
export class Store {
  /** Internal storage for state values */
  private values: Map<string, unknown> = new Map();
  /** Internal storage for effect callbacks mapped by state ID */
  private effects: Map<string, Set<(value: { oldValue: unknown; newValue: unknown }) => void>> =
    new Map();
  /** Tracks currently computing states to detect circular dependencies */
  private computing: Set<string> = new Set();

  /**
   * Creates a new Store instance
   */
  constructor() {
    // No initialization needed
  }

  /**
   * Gets the value of a state
   * For computed values, this will compute and cache the value, tracking dependencies
   *
   * @param state - The state to get value from
   * @returns The current value of the state
   * @throws Error if state is not found in the registry
   *
   * @example
   * ```typescript
   * const count = state(0);
   * console.log(store.get(count)); // 0
   *
   * // With computed
   * const doubled = computed({
   *   get: (get) => get(count) * 2
   * });
   * console.log(store.get(doubled)); // 0
   * ```
   */
  get<T>(state: Value<T>): T {
    const id = state.id;
    const newValue = this.values.get(id);
    if (newValue !== undefined) {
      return newValue as T;
    }
    const stateNode = RELAX_NODES.get(id);
    if (!stateNode) {
      throw new Error(`State with id ${id} not found`);
    }
    const defaultValue = stateNode.value;
    if (typeof defaultValue === 'function') {
      // Detect circular dependency
      if (this.computing.has(id)) {
        throw new Error(`Circular dependency detected for state with id ${id}`);
      }

      this.computing.add(id);
      try {
        const dependencies = new Set<Value<any>>();
        const get = <U>(state: Value<U>): U => {
          // Track dependency relationship
          dependencies.add(state);
          return this.get(state);
        };
        const computedValue = (defaultValue as ComputedFn<T>)(get);
        this.values.set(id, computedValue);

        // After computation, add effect listeners for all dependencies
        dependencies.forEach((dep) => {
          this.effect(dep, () => {
            // When dependency changes, clear the cached computed value
            this.values.delete(id);
          });
        });

        return computedValue;
      } finally {
        // Ensure tracking is removed after computation completes
        this.computing.delete(id);
      }
    }
    return defaultValue as T;
  }

  /**
   * Sets the value of a state and triggers all registered effects
   * If the new value is the same as the current value, no effects will be triggered
   *
   * @param state - The state to set value to
   * @param value - The new value
   *
   * @example
   * ```typescript
   * const count = state(0);
   * store.set(count, 5);
   * console.log(store.get(count)); // 5
   *
   * // Setting same value doesn't trigger effects
   * store.set(count, 5); // No effect triggered
   * ```
   */
  set<T>(state: State<T>, value: T) {
    const oldValue = this.get(state);
    if (oldValue === value) {
      return;
    }
    this.values.set(state.id, value);
    this.dispatchEffects(state, oldValue, value);
  }

  /**
   * Registers an effect callback that will be called when state changes
   * Effects are useful for side effects like logging, syncing with external systems, etc.
   *
   * @param state - The state to watch for changes
   * @param fn - Callback function that receives old and new values
   * @returns A function to unsubscribe the effect
   *
   * @example
   * ```typescript
   * const count = state(0);
   *
   * // Add an effect
   * const unsubscribe = store.effect(count, ({ oldValue, newValue }) => {
   *   console.log(`Count changed from ${oldValue} to ${newValue}`);
   * });
   *
   * // Update state - effect will be called
   * store.set(count, 5); // Logs: "Count changed from 0 to 5"
   *
   * // Unsubscribe when no longer needed
   * unsubscribe();
   *
   * // This update won't trigger the effect
   * store.set(count, 10); // No log
   * ```
   */
  effect<T>(state: Value<T>, fn: (value: { oldValue: T; newValue: T }) => void) {
    const id = state.id;
    if (!this.effects.has(id)) {
      this.effects.set(id, new Set());
    }
    this.effects.get(id)?.add(fn as (value: unknown) => void);
    return () => {
      this.clearEffect(state, fn);
    };
  }

  /**
   * Removes an effect callback from a state
   * This is called automatically when unsubscribing from an effect
   *
   * @param state - The state to remove effect from
   * @param fn - The effect callback to remove
   *
   * @example
   * ```typescript
   * const effectFn = ({ oldValue, newValue }) => {
   *   console.log(`Changed: ${oldValue} -> ${newValue}`);
   * };
   *
   * store.effect(count, effectFn);
   * store.clearEffect(count, effectFn); // Remove the effect
   * ```
   */
  clearEffect<T>(state: Value<T>, fn: (value: { oldValue: T; newValue: T }) => void) {
    const id = state.id;
    this.effects.get(id)?.delete(fn as (value: unknown) => void);
  }

  /**
   * Dispatches effects for a state change
   * Called internally when state changes to notify all registered effects
   *
   * @param state - The state that changed
   * @param oldValue - The previous value
   * @param newValue - The new value
   */
  private dispatchEffects<T>(state: Value<T>, oldValue: T, newValue: T) {
    const id = state.id;
    this.effects.get(id)?.forEach((fn) => {
      fn({ oldValue, newValue });
    });
  }
}

/**
 * Creates a new Store instance
 * This is the recommended way to create stores in Relax
 *
 * @returns A new Store instance
 *
 * @example
 * ```typescript
 * // Basic store
 * const store = createStore();
 * const count = state(0);
 * store.set(count, 5);
 * console.log(store.get(count)); // 5
 * ```
 */
export const createStore = (): Store => {
  return new Store();
};

/**
 * Default store instance for the Relax framework
 * This is a singleton store that can be used when you don't need multiple stores
 * @example
 * ```typescript
 * // Using the default store
 * import { DefultStore } from '@relax-state/core';
 *
 * const count = state(0);
 * DefultStore.set(count, 5);
 * console.log(DefultStore.get(count)); // 5
 *
 * // Recommended: create your own store
 * const store = createStore();
 * store.set(count, 10);
 * ```
 */
export const DefultStore = createStore();
