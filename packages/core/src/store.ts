import { type Value, type State, type ComputedFn, RELAX_NODES } from './state';

export class Store {
  private values: Map<string, unknown> = new Map();
  private effects: Map<string, Set<(value: { oldValue: unknown; newValue: unknown }) => void>> =
    new Map();
  private computing: Set<string> = new Set(); // 跟踪正在计算的状态，用于检测循环依赖
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
      // 检测循环依赖
      if (this.computing.has(id)) {
        throw new Error(`Circular dependency detected for state with id ${id}`);
      }

      this.computing.add(id);
      try {
        const dependencies = new Set<Value<unknown>>();
        const get = (state: Value<unknown>) => {
          // 记录依赖关系
          dependencies.add(state);
          return this.get(state);
        };
        const computedValue = (defaultValue as ComputedFn<T>)(get);
        this.values.set(id, computedValue);

        // 在计算完成后，为所有依赖项添加 effect 监听器
        dependencies.forEach((dep) => {
          this.effect(dep, () => {
            // 当依赖项发生变化时，清除当前 computed 值的缓存
            this.values.delete(id);
          });
        });

        return computedValue;
      } finally {
        this.computing.delete(id); // 确保在计算完成后移除跟踪
      }
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
