/**
 * Derived state management - Computed state system for Relax framework
 * Provides ability to create computed states that automatically track dependencies and respond to changes
 */
import { RELAX_NODES, type Value, type Node, type ComputedFn } from './state';

import { createId } from './id';

/**
 * Selector state interface with type information
 * @template T - The type of the computed value
 */
export interface Computed<T> extends Value<T> {
  value?: ComputedFn<T>;
}

/**
 * Internal node class for computed state management
 * @template T - The type of the computed value
 */
class ComputedNode<T> implements Node<T> {
  readonly type: 'computed' = 'computed';
  readonly id: string;
  readonly name?: string;
  readonly value: ComputedFn<T>;

  constructor({
    get,
    name,
  }: {
    get: ComputedFn<T>;
    name?: string;
  }) {
    this.value = get;
    this.name = name;
    this.id = createId('computed');
    RELAX_NODES.set(this.id, this as unknown as Node<unknown>);
  }
}

/**
 * Creates a new derived state (selector)
 * @template T - The type of the computed value
 * @param options - Selector configuration options
 * @param options.get - Function that computes the derived value
 * @param options.key - Optional unique identifier
 * @returns A SelectorValue object representing the derived state
 */
export const computed = <T>({ get, name }: { get: ComputedFn<T>; name?: string }): Computed<T> => {
  const compotedNode = new ComputedNode({ get, name });
  return {
    id: compotedNode.id,
    type: 'computed',
    name,
  } as Computed<T>;
};
