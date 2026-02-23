/**
 * Dispatch system for Relax framework
 * Provides function to execute actions with plugin lifecycle hooks
 */

import { type Action } from './action';
import { type Store } from './store';
import { type Plugin, type ActionContext } from './plugin';

/**
 * Dispatch options
 */
export interface DispatchOptions {
  /** Store instance to execute action on */
  store: Store;
}

/**
 * Dispatches an action to be executed
 * @param action - Action to execute
 * @param options - Dispatch options including store
 * @param payload - Payload to pass to action handler
 * @returns Result from action handler
 */
export const dispatch = <P, R>(
  action: Action<P, R>,
  options: DispatchOptions,
  payload: P
): R => {
  const { store } = options;
  const { type, handler, plugins: actionPlugins = [] } = action;

  // Merge store plugins and action-level plugins
  const storePlugins = store.getPlugins();
  const allPlugins: Plugin[] = [...storePlugins, ...actionPlugins];

  const context: ActionContext = { type, payload };

  // 1. Execute onBefore hooks
  for (const plugin of allPlugins) {
    plugin.onBefore?.(context);
  }

  let result: R;
  let error: Error | null = null;

  // 2. Execute action handler
  try {
    result = handler(store, payload);
  } catch (e) {
    error = e as Error;

    // 3. Execute onError hooks
    for (const plugin of allPlugins) {
      plugin.onError?.(context, error);
    }

    throw e;
  }

  // 4. Execute onAfter hooks (only if no error)
  for (const plugin of allPlugins) {
    plugin.onAfter?.(context, result);
  }

  return result;
};
