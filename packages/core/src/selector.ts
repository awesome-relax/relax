import { createId } from './id';
import { effect, get, removeEffect, State, StateMap, type RelaxStateGetter } from './state';

class Selector<T> extends State<T> {
  id: string;
  private computeFn: (getter: RelaxStateGetter) => T | Promise<T>;
  private deps: State<any>[] = [];
  private effect = () => this.update();
  private getter: RelaxStateGetter = (state) => {
    const value = get(state);
    return value;
  };
  constructor(computeFn: (getter: RelaxStateGetter) => T | Promise<T>) {
    super();
    this.id = createId('selector');
    this.computeFn = computeFn;
    this.update();
  }
  async update() {
    this.prepare();
    const result = await this.computeFn(this.getter);
    this.value = result;
    this.afterUpdate();
  }
  private prepare() {
    this.deps.forEach((dep) => {
      removeEffect(dep, this.effect);
    });
    this.deps = [];
  }
  private afterUpdate() {
    this.deps.forEach((dep) => {
      effect(dep, this.effect);
    });
  }
}
export const selector = <T>(computeFn: (getter: RelaxStateGetter) => T | Promise<T>) => {
  const selector = new Selector(computeFn);
  StateMap.set(selector.id, selector);
  return {
    id: selector.id,
  };
};
