import { createId } from './id';

export const store = (): string => {};
export const restore = (id?: string) => {};

export interface RelaxValue<T> {
  id: string;
  value?: T;
}

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
  dispose() {
    this.effects.clear();
    RELAX_NODES.delete(this.id);
  }
  effect(fn: (state: RelaxValue<T>) => void) {
    const remove = () => this.removeEffect(fn);
    this.effects.add(fn);
    return remove;
  }
  removeEffect(fn: (state: RelaxValue<T>) => void) {
    this.effects.delete(fn);
  }
  dispatchEffect() {
    this.effects.forEach((fn) => fn(this));
  }
}

export const RELAX_NODES = new Map<string, RelaxValueNode<any>>();
export const get = <T extends RelaxValue<any>>(state: T): T['value'] | undefined => {
  return RELAX_NODES.get(state.id)?.value;
};

export type RelaxStateGetter = typeof get;

export const set = <T>(state: RelaxValue<T>, value: T) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<T>;
  if (relaxNode) {
    relaxNode.value = value;
    dispatchEffect(state);
  }
};

export const dispose = (state: RelaxValue<any>) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<any>;
  if (relaxNode) {
    relaxNode.dispose();
  }
};
// 副作用
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

export const removeEffect = (state: RelaxValue<any>, fn: (state: RelaxValue<any>) => void) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<any>;
  if (relaxNode) {
    relaxNode.removeEffect(fn);
  }
};

const dispatchEffect = (state: RelaxValue<any>) => {
  const relaxNode = RELAX_NODES.get(state.id) as RelaxValueNode<any>;
  if (relaxNode) {
    relaxNode.dispatchEffect();
  }
};
