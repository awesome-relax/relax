/**
 * Event system for Relax framework
 * Provides a simple event dispatcher with listener management
 */

/**
 * Event dispatcher type that combines function call with listener management
 * @template T - The type of data to be dispatched
 */
export type EventDispatcher<T> = ((value: T) => void) & {
  on: (fn: Listener<T>) => void;
  off: (fn: Listener<T>) => void;
};

/**
 * Event listener function type
 * @template T - The type of data received by the listener
 */
export type Listener<T> = (value: T) => void;

/**
 * Creates a new event dispatcher
 * @template T - The type of data to be dispatched
 * @returns An event dispatcher with listener management capabilities
 */
export const createEvent = <T>(): EventDispatcher<T> => {
  const listeners: Listener<T>[] = [];

  const dispatch: EventDispatcher<T> = (value: T) => {
    listeners.forEach((fn) => fn(value));
  };

  // Add listener to the event
  dispatch.on = (fn: Listener<T>) => {
    listeners.push(fn);
  };

  // Remove listener from the event
  dispatch.off = (fn: Listener<T>) => {
    const index = listeners.indexOf(fn);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };

  return dispatch;
};
