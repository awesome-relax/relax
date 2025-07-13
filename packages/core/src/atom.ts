import { get, RELAX_NODES, RelaxValueNode, set, type RelaxValue } from './state';

export interface RelaxState<T, _R> extends RelaxValue<T> {
  readonly type: 'atom';
}

class RelaxStateNode<T, R> extends RelaxValueNode<T> implements RelaxState<T, R> {
  readonly type: 'atom';
  updateFn?: (params: R) => T | Promise<T>;
  constructor(
    public value: T,
    public defaultValue?: T
  ) {
    super('atom', value);
    this.type = 'atom';
    if (typeof value === 'function') {
      this.updateFn = value as (params: R) => T | Promise<T>;
    } else {
      this.value = value;
    }
  }
}

export const atom = <T, R = T>(
  value: T | ((params: R) => T | Promise<T>),
  defaultValue?: T
): RelaxState<T, R> => {
  const atom = new RelaxStateNode(value, defaultValue);
  return {
    id: atom.id,
    type: 'atom',
  };
};

export const update = async <T, R>(state: RelaxState<T, R>, value: R) => {
  const atom: RelaxStateNode<T, R> | undefined = RELAX_NODES.get(state.id) as RelaxStateNode<T, R>;
  if (!atom) {
    throw new Error(`Atom ${state.id} not found`);
  }
  const newValue = atom.updateFn ? await atom.updateFn(value) : value;
  set(state, newValue);
};

// 如果是全局状态，则需要一个全局状态管理器.那么ssr的场景怎么解决状态混淆以及内存泄漏的问题

const a = atom(1);
export const b = get(a);

const c = atom(
  (params: string) =>
    new Promise<number>((resolve) => setTimeout(() => resolve(Number(params) + 1), 1000))
);
export const d = get(c);

update(a, 2);
update(c, '1');
