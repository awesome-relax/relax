import { createId } from './id';
import { get, State, StateMap } from './state';

class RelaxState<T, R> extends State<T> {
  readonly type? = 'atom';
  updateFn?: (params: R) => T | Promise<T>;
  constructor(value: T | ((params: R) => T | Promise<T>), defaultValue?: T) {
    super();
    this.id = createId('atom');
    if (typeof value === 'function') {
      this.updateFn = value as (params: R) => T | Promise<T>;
      this.value = defaultValue;
    } else {
      this.value = value;
    }
  }
}
export type RelaxStateGetter<T, R> = (state: RelaxState<T, R>) => T;

export const atom = <T, R = T>(
  value: T | ((params: R) => T | Promise<T>),
  defaultValue?: T
): RelaxState<T, R> => {
  const atom = new RelaxState(value, defaultValue);
  StateMap.set(atom.id, atom);
  return {
    id: atom.id,
  };
};

export const update = async <T, R>(state: RelaxState<T, R>, value: R) => {
  const atom: RelaxState<T, R> | undefined = StateMap.get(state.id) as RelaxState<T, R>;
  if (!atom) {
    throw new Error(`Atom ${state.id} not found`);
  }
  if (atom.updateFn) {
    atom.value = await atom.updateFn(value);
  } else {
    atom.value = value as unknown as T;
  }
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
