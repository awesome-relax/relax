/**
 * Derived state management - Computed state system for Relax framework
 * Provides ability to create computed states that automatically track dependencies and respond to changes
 */

import {
  type RelaxValue,
  type RelaxStateGetter,
  effect,
  get as getState,
  RelaxValueNode,
  set,
} from './state';

/**
 * Selector state interface with type information
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
  private computeFn: (getter: RelaxStateGetter, prev?: T) => T | Promise<T>;

  private deps: Set<RelaxValue<any>> = new Set();
  private effectHandle = () => this.update();

  /**
   * Custom getter that tracks dependencies during computation
   */
  private getter: RelaxStateGetter = (state) => {
    const value = getState(state);
    this.deps.add(state);
    return value;
  };

  constructor({
    get,
    key,
  }: {
    get: (getter: RelaxStateGetter) => T | Promise<T>;
    key?: string;
  }) {
    super({ type: 'selector', key });
    this.computeFn = get;
    this.update();
  }

  /**
   * Updates the selector value by recomputing with current dependencies
   */
  async update() {
    this.prepare();
    const result = await this.computeFn(this.getter, this.value);
    set(this, result);
    this.afterUpdate();
  }

  /**
   * Clears all current dependencies and their effects
   * @fix  fix the bug:
   * 1. when the selector depend on two or more state,and these state changes on the same time,the selector will not update
   * 2. just remove the clear code to fix the bug,until find a better solution
   */
  private prepare() {
    // this.deps.forEach((dep) => {
    //   removeEffect(dep, this.effectHandle);
    // });
    // this.deps.clear();
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
 * @param options - Selector configuration options
 * @param options.get - Function that computes the derived value
 * @param options.key - Optional unique identifier
 * @returns A SelectorValue object representing the derived state
 */
export const selector = <T>({
  get,
  key,
}: {
  get: (getter: RelaxStateGetter, prev?: T) => T | Promise<T>;
  key?: string;
}): SelectorValue<T> => {
  const selector = new SelectorNode({ get, key });
  return {
    id: selector.id,
    type: 'selector',
  };
};
