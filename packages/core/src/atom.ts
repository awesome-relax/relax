/**
 * Atomic state management - Core state unit for Relax framework
 * Provides foundation for creating and managing atomic states with support for synchronous and asynchronous updates
 */

import { RELAX_NODES, RelaxValueNode, set, type RelaxValue } from './state';

/**
 * Atomic state interface defining the basic structure of atomic states
 * @template T - The type of the state value
 * @template R - The type of the update parameter (defaults to T)
 */
export interface RelaxState<T, _R = T> extends RelaxValue<T> {
  readonly type: 'atom';
}

/**
 * Atomic state node class managing lifecycle and update logic
 * @template T - The type of the state value
 * @template R - The type of the update parameter
 */
class RelaxStateNode<T, R = T> extends RelaxValueNode<T> implements RelaxState<T, R> {
  readonly type: 'atom';
  updateFn?: (params: R) => T | Promise<T>;

  constructor({
    get,
    defaultValue,
    key,
  }: {
    get?: (params: R) => T | Promise<T>;
    defaultValue?: T;
    key?: string;
  }) {
    super({ type: 'atom', value: defaultValue, key });
    this.type = 'atom';

    this.updateFn = get;
    this.value = defaultValue;
  }
}

/**
 * Creates a new atomic state
 * @template T - The type of the state value
 * @template R - The type of the update parameter
 * @param options - Atomic state configuration options
 * @param options.get - Optional update function for computing new state values
 * @param options.defaultValue - Optional default value used when update function is provided
 * @param options.key - Optional unique identifier
 * @returns A RelaxState object representing the atomic state
 */
export const atom = <T, R = T>({
  get,
  defaultValue,
  key,
}: {
  get?: (params: R) => T | Promise<T>;
  defaultValue?: T;
  key?: string;
}): RelaxState<T, R> => {
  const atom = new RelaxStateNode({ get, defaultValue, key });
  return {
    id: atom.id,
    type: 'atom',
    key,
  };
};

/**
 * Updates the value of an atomic state
 * @template T - The type of the state value
 * @template R - The type of the update parameter
 * @param state - The atomic state to update
 * @param value - The new value or parameter for the update function
 */
export const update = async <T, R>(state: RelaxState<T, R>, value: R | ((prev?: T) => R)) => {
  const atom: RelaxStateNode<T, R> | undefined = RELAX_NODES.get(state.id) as RelaxStateNode<T, R>;
  if (!atom) {
    throw new Error(`Atom ${state.id} not found`);
  }

  // Use update function if available, otherwise use the value directly
  const newValue = atom.updateFn
    ? await atom.updateFn(
        typeof value === 'function' ? (value as (prev: T) => R)(atom.value as T) : value
      )
    : value;
  set(state, newValue as T);
};

// TODO: For global state, we need a global state manager
// How to solve state confusion and memory leaks in SSR scenarios?
