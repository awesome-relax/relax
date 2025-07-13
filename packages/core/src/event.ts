export type EventDispatcher<T> = ((value: T) => void) & {
  on: (fn: Listener<T>) => void;
  off: (fn: Listener<T>) => void;
};

export type Listener<T> = (value: T) => void;

export const createEvent = <T>(): EventDispatcher<T> => {
  const listeners: Listener<T>[] = [];
  const dispatch: EventDispatcher<T> = (value: T) => {
    listeners.forEach((fn) => fn(value));
  };
  dispatch.on = (fn: Listener<T>) => {
    listeners.push(fn);
  };
  dispatch.off = (fn: Listener<T>) => {
    listeners.splice(listeners.indexOf(fn), 1);
  };
  return dispatch;
};
