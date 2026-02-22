/**
 * Core state management system for Relax framework
 * Provides infrastructure for reactive state management including state nodes, effects system, and lifecycle management
 */

import { createId } from './id';

/**
 * State persistence function (placeholder implementation)
 * @param id - The storage identifier
 * @returns Empty string (placeholder implementation)
 */
export const snapshot = (): string => {
  return '';
};
export type ValueGetter = <U>(state: Value<U>) => U;
export type ComputedFn<T> = (get: ValueGetter, prev?: T) => T;

export interface Value<T> {
  value?: T | ComputedFn<T>;
  id: string;
  name?: string;
}
export interface Node<T> extends Value<T> {
  type: string;
}
/**
 * Base interface for all Relax state values
 * @template T - The type of the state value
 */
export interface State<T> extends Value<T> {}

/**
 * Core state node class managing effects and lifecycle
 * @template T - The type of the state value
 */
export class StateNode<T> implements Node<T> {
  readonly id: string;
  readonly name?: string;
  readonly value?: T;
  readonly type: string = 'state';

  constructor({
    value,
    name,
    type,
  }: {
    value?: T;
    name?: string;
    type: string;
  }) {
    this.id = createId(type);
    this.name = name;
    this.value = value;
    RELAX_NODES.set(this.id, this as unknown as StateNode<unknown>);
  }
}

/**
 * Global registry of all Relax state nodes
 */
export const RELAX_NODES = new Map<string, Value<unknown>>();

export const state = <T>(defaultValue: T, name?: string): State<T> => {
  const state = new StateNode({ value: defaultValue, name, type: 'state' });
  return {
    id: state.id,
    name,
  } as State<T>;
};
