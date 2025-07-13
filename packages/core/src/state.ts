export const store = (): string => {};
export const restore = (id?: string) => {};

export class State<T> {
  id: string;
  value?: T;
}
export const StateMap = new Map<string, State<any>>();
export const get = <T>(state: State<T>): T | undefined => {
  return StateMap.get(state.id)?.value;
};

export type RelaxStateGetter = typeof get;

export const set = <T>(state: State<T>, value: T) => {
  const relaxState = StateMap.get(state.id) as State<T>;
  if (relaxState) {
    relaxState.value = value;
    dispatchEffect(state);
  }
};

export const dispose = (state: State<any>) => {
  StateMap.delete(state.id);
  EFFECTS.delete(state.id);
};
// 副作用
const EFFECTS = new Map<string, ((state: State<any>) => void)[]>();
export const effect = (state: State<any>, fn: (state: State<any>) => void) => {
  const currentEffects = EFFECTS.get(state.id) || [];

  const remove = () => {
    removeEffect(state, fn);
  };
  remove();
  currentEffects.push(fn);
  EFFECTS.set(state.id, currentEffects);
  return remove;
};

export const removeEffect = (state: State<any>, fn: (state: State<any>) => void) => {
  const currentEffects = EFFECTS.get(state.id) || [];
  currentEffects.splice(currentEffects.indexOf(fn), 1);
  EFFECTS.set(state.id, currentEffects);
};

const dispatchEffect = (state: State<any>) => {
  const currentEffects = EFFECTS.get(state.id) || [];
  currentEffects.forEach((fn) => fn(state));
};
