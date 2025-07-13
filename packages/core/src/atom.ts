/**
 * Atomic state management for Relax framework
 * Provides the foundation for creating and managing atomic state units
 */

import { RELAX_NODES, RelaxValueNode, set, type RelaxValue } from './state';

/**
 * Interface for atomic state with type information
 * @template T - The type of the state value
 * @template R - The type of the update parameter (defaults to T)
 */
export interface RelaxState<T, _R = T> extends RelaxValue<T> {
  readonly type: 'atom';
}

/**
 * Internal node class for atomic state management
 * @template T - The type of the state value
 * @template R - The type of the update parameter
 */
class RelaxStateNode<T, R = T> extends RelaxValueNode<T> implements RelaxState<T, R> {
  readonly type: 'atom';
  updateFn?: (params: R) => T | Promise<T>;

  constructor(
    public value: T,
    public defaultValue?: T
  ) {
    super('atom', value);
    this.type = 'atom';

    // If value is a function, treat it as an update function
    if (typeof value === 'function') {
      this.updateFn = value as (params: R) => T | Promise<T>;
    } else {
      this.value = value;
    }
  }
}

/**
 * Creates a new atomic state
 * @template T - The type of the state value
 * @template R - The type of the update parameter
 * @param value - Initial value or update function
 * @param defaultValue - Default value (used when value is a function)
 * @returns A RelaxState object representing the atomic state
 */
export const atom = <T, R = T>(
  value: T | ((params: R) => T | Promise<T>),
  defaultValue?: T
): RelaxState<T, R> => {
  const atom = new RelaxStateNode(value, defaultValue);
  return {
    id: atom.id,
    type: 'atom',
  };
};

/**
 * Updates an atomic state with a new value
 * @template T - The type of the state value
 * @template R - The type of the update parameter
 * @param state - The atomic state to update
 * @param value - The new value or parameter for the update function
 */
export const update = async <T, R>(state: RelaxState<T, R>, value: R) => {
  const atom: RelaxStateNode<T, R> | undefined = RELAX_NODES.get(state.id) as RelaxStateNode<T, R>;
  if (!atom) {
    throw new Error(`Atom ${state.id} not found`);
  }

  // If there's an update function, use it; otherwise, use the value directly
  const newValue = atom.updateFn ? await atom.updateFn(value) : value;
  set(state, newValue as T);
};

// TODO: For global state, we need a global state manager.
// How to solve state confusion and memory leaks in SSR scenarios?
