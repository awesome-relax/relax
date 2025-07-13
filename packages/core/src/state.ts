/**
 * Core state management system for Relax framework
 * Provides the foundation for reactive state management with effects
 */

import { createId } from './id';

/**
 * Store function placeholder for future state persistence
 * @param id - The store identifier
 * @returns Empty string (placeholder implementation)
 */
export const store = (): string => {
  return '';
};

/**
 * Restore function placeholder for future state restoration
 * @param id - The store identifier to restore from
 * @returns Empty string (placeholder implementation)
 */
export const restore = (id?: string): string => {
  return '';
};

/**
 * Base interface for all Relax state values
 * @template T - The type of the state value
 */
export interface RelaxValue<T> {
  id: string;
  value?: T;
}

/**
 * Core state node that manages effects and lifecycle
 * @template T - The type of the state value
 */
export class RelaxValueNode<T> implements RelaxValue<T> {
  readonly id: string;
  private readonly effects: Set<(state: RelaxValue<T>) => void> = new Set();

  constructor(
    type: string,
    public value?: T
  ) {
    this.id = createId(type);
    RELAX_NODES.set(this.id, this);
  }

  /**
   * Clean up the node and remove it from the global registry
   */
  dispose() {
    this.effects.clear();
    RELAX_NODES.delete(this.id);
  }

  /**
   * Add an effect to this node
   * @param fn - The effect function to execute when state changes
   * @returns A function to remove this effect
   */
  effect(fn: (state: RelaxValue<T>) => void) {
    const remove = () => this.removeEffect(fn);
    this.effects.add(fn);
    return remove;
  }

  /**
   * Remove an effect from this node
   * @param fn - The effect function to remove
   */
  removeEffect(fn: (state: RelaxValue<T>) => void) {
    this.effects.delete(fn);
  }

  /**
   * Trigger all effects for this node
   */
  dispatchEffect() {
    this.effects.forEach((fn) => fn(this));
  }
}

/**
 * Global registry of all Relax state nodes
 */
export const RELAX_NODES = new Map<string, RelaxValueNode<any>>();

/**
 * Get the current value of a state
 * @template T - The type of the state
 * @param state - The state to get the value from
 * @returns The current value or undefined
 */
export const get = <T extends RelaxValue<any>>(state: T): T['value'] | undefined => {
  return RELAX_NODES.get(state.id)?.value;
};

/**
 * Type alias for the get function
 */
export type RelaxStateGetter = typeof get;

/**
 * Set the value of a state and trigger effects
 * @template T - The type of the state value
 * @param state - The state to update
 * @param value - The new value
 */
export const set = <T>(state: RelaxValue<T>, value: T) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<T>;
  if (relaxNode) {
    relaxNode.value = value;
    dispatchEffect(state);
  }
};

/**
 * Dispose of a state node and clean up resources
 * @param state - The state to dispose
 */
export const dispose = (state: RelaxValue<any>) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<any>;
  if (relaxNode) {
    relaxNode.dispose();
  }
};

/**
 * Add an effect to a state that will be triggered when the state changes
 * @param state - The state to add the effect to
 * @param fn - The effect function
 * @returns A function to remove the effect
 */
export const effect = (state: RelaxValue<any>, fn: (state: RelaxValue<any>) => void) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<any>;
  if (relaxNode) {
    const remove = () => {
      removeEffect(state, fn);
    };
    relaxNode.effect(fn);
    return remove;
  }
  return () => {};
};

/**
 * Remove an effect from a state
 * @param state - The state to remove the effect from
 * @param fn - The effect function to remove
 */
export const removeEffect = (state: RelaxValue<any>, fn: (state: RelaxValue<any>) => void) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<any>;
  if (relaxNode) {
    relaxNode.removeEffect(fn);
  }
};

/**
 * Internal function to dispatch effects for a state
 * @param state - The state to dispatch effects for
 */
const dispatchEffect = (state: RelaxValue<any>) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<any>;
  if (relaxNode) {
    relaxNode.dispatchEffect();
  }
};
