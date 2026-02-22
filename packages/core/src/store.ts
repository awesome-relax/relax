import { type ComputedFn, RELAX_NODES, type State, type Value } from './state';

/**
 * Store class for managing reactive state
 * Provides methods for getting, setting state values and managing side effects
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
   * Gets the value of a state
   * @param state - The state to get value from
   * @returns The current value of the state
   * @throws Error if state is not found
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
   * @param state - The state to set value to
   * @param value - The new value
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
   * @param state - The state to watch
   * @param fn - Callback function that receives old and new values
   * @returns A function to unsubscribe the effect
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
   * @param state - The state to remove effect from
   * @param fn - The effect callback to remove
   */
  clearEffect<T>(state: Value<T>, fn: (value: { oldValue: T; newValue: T }) => void) {
    const id = state.id;
    this.effects.get(id)?.delete(fn as (value: unknown) => void);
  }

  /**
   * Dispatches effects for a state change
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
 * @returns A new Store instance
 */
export const createStore = () => {
  return new Store();
};

/**
 * Default store instance for the Relax framework
 */
export const DefultStore = createStore();
