import type { Computed } from './computed';
import { type Value, type State, type ComputedFn, RELAX_NODES } from './state';

export class Store {
  private values: Map<string, unknown> = new Map();
  private effects: Map<string, Set<(value: { oldValue: unknown; newValue: unknown }) => void>> =
    new Map();
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
    const defaultValue = state.value;
    if (typeof defaultValue === 'function') {
      const get = (state: Value<unknown>) => {
        this.effect(state, () => {
          // update computed value when dependency changes
          const computedState = RELAX_NODES.get(id) as unknown as Computed<unknown>;
          const oldValue = this.values.get(id);
          if (computedState) {
            const newComputedValue = (defaultValue as ComputedFn<unknown>)(get);
            this.values.set(id, newComputedValue);
            this.dispatchEffects(state, oldValue, this.values.get(id) as unknown); // dispatch effects for the computed state when dependencies change
          }
        });
        return this.get(state);
      };
      const computedValue = (defaultValue as ComputedFn<T>)(get);
      this.values.set(id, computedValue);
      return computedValue;
    }
    return defaultValue as T;
  }
  set<T>(state: State<T>, value: T) {
    const oldValue = this.get(state);
    if (oldValue === value) {
      return;
    }
    this.values.set(state.id, value);
    this.dispatchEffects(state, oldValue, value);
  }
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
  clearEffect<T>(state: Value<T>, fn: (value: { oldValue: T; newValue: T }) => void) {
    const id = state.id;
    this.effects.get(id)?.delete(fn as (value: unknown) => void);
  }
  private dispatchEffects<T>(state: Value<T>, oldValue: T, newValue: T) {
    const id = state.id;
    this.effects.get(id)?.forEach((fn) => {
      fn({ oldValue, newValue });
    });
  }
}
export const createStore = () => {
  return new Store();
};

export const DefultStore = createStore();
