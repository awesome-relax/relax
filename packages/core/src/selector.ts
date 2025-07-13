import {
  effect,
  get,
  RelaxValueNode,
  type RelaxValue,
  removeEffect,
  set,
  type RelaxStateGetter,
} from './state';

export interface SelectorValue<T> extends RelaxValue<T> {
  readonly type: 'selector';
}

class SelectorNode<T> extends RelaxValueNode<T> implements SelectorValue<T> {
  readonly type: 'selector' = 'selector';
  private computeFn: (getter: RelaxStateGetter) => T | Promise<T>;

  private deps: Set<RelaxValue<any>> = new Set();
  private effectHandle = () => this.update();
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
  async update() {
    this.prepare();
    const result = await this.computeFn(this.getter);
    set(this, result);
    this.afterUpdate();
  }
  private prepare() {
    this.deps.forEach((dep) => {
      removeEffect(dep, this.effectHandle);
    });
    this.deps.clear();
  }
  private afterUpdate() {
    this.deps.forEach((dep) => {
      effect(dep, this.effectHandle);
    });
  }
}
export const selector = <T>(
  computeFn: (getter: RelaxStateGetter) => T | Promise<T>
): SelectorValue<T> => {
  const selector = new SelectorNode(computeFn);
  return {
    id: selector.id,
    type: 'selector',
  };
};
