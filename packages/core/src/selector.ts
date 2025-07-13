/**
 * Derived state management for Relax framework
 * Provides the ability to create computed states that automatically track dependencies
 */

import {
  effect,
  get,
  RelaxValueNode,
  type RelaxValue,
  removeEffect,
  set,
  type RelaxStateGetter,
} from './state';

/**
 * Interface for selector state with type information
 * @template T - The type of the computed value
 */
export interface SelectorValue<T> extends RelaxValue<T> {
  readonly type: 'selector';
}

/**
 * Internal node class for selector state management
 * @template T - The type of the computed value
 */
class SelectorNode<T> extends RelaxValueNode<T> implements SelectorValue<T> {
  readonly type: 'selector' = 'selector';
  private computeFn: (getter: RelaxStateGetter) => T | Promise<T>;

  private deps: Set<RelaxValue<any>> = new Set();
  private effectHandle = () => this.update();

  /**
   * Custom getter that tracks dependencies during computation
   */
  private getter: RelaxStateGetter = (state) => {
    const value = get(state);
    this.deps.add(state);
    return value;
  };

  constructor(computeFn: (getter: RelaxStateGetter) => T | Promise<T>) {
    super('selector');
    this.computeFn = computeFn;
    this.update();
  }

  /**
   * Updates the selector value by recomputing with current dependencies
   */
  async update() {
    this.prepare();
    const result = await this.computeFn(this.getter);
    set(this, result);
    this.afterUpdate();
  }

  /**
   * Clears all current dependencies and their effects
   */
  private prepare() {
    this.deps.forEach((dep) => {
      removeEffect(dep, this.effectHandle);
    });
    this.deps.clear();
  }

  /**
   * Sets up effects for all current dependencies
   */
  private afterUpdate() {
    this.deps.forEach((dep) => {
      effect(dep, this.effectHandle);
    });
  }
}

/**
 * Creates a new derived state (selector)
 * @template T - The type of the computed value
 * @param computeFn - Function that computes the derived value
 * @returns A SelectorValue object representing the derived state
 */
export const selector = <T>(
  computeFn: (getter: RelaxStateGetter) => T | Promise<T>
): SelectorValue<T> => {
  const selector = new SelectorNode(computeFn);
  return {
    id: selector.id,
    type: 'selector',
  };
};
