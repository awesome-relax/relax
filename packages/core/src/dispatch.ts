/**
 * Dispatch system for Relax framework
 * Provides function to execute actions with plugin lifecycle hooks
 * @module dispatch
 * @example
 * ```typescript
 * const result = dispatch(myAction, { store }, { id: '123' });
 * ```
 */

import type { Action } from './action';
import type { Store } from './store';
import type { Plugin, ActionContext } from './plugin';

/**
 * Dispatch options
 * Configuration options for dispatching an action
 * @example
 * ```typescript
 * const options: DispatchOptions = { store: myStore };
 * dispatch(myAction, options, payload);
 * ```
 */
export interface DispatchOptions {
  /** Store instance to execute action on */
  store: Store;
}

/**
 * Dispatches an action to be executed
 *
 * This is the primary way to execute actions in Relax. It:
 * 1. Executes all onBefore hooks from plugins (store-level + action-level)
 * 2. Executes the action handler
 * 3. If successful, executes all onAfter hooks
 * 4. If an error occurs, executes all onError hooks and re-throws
 *
 * @param action - Action to execute
 * @param options - Dispatch options including store
 * @param payload - Payload to pass to action handler
 * @returns Result from action handler
 *
 * @template P - Payload type for the action
 * @template R - Return type of the action
 *
 * @throws Error - Re-throws any error from the action handler after calling onError hooks
 *
 * @example
 * ```typescript
 * // Basic usage
 * const increment = action(
 *   (store, payload: { amount: number }) => {
 *     const current = store.get(countState);
 *     store.set(countState, current + payload.amount);
 *   },
 *   { name: 'counter/increment' }
 * );
 *
 * dispatch(increment, { store }, { amount: 5 });
 *
 * // With plugins
 * const loggerPlugin: Plugin = {
 *   name: 'logger',
 *   onBefore: (ctx) => console.log(`[START] ${ctx.type}`),
 *   onAfter: (ctx, result) => console.log(`[END] ${ctx.type}`, result),
 *   onError: (ctx, error) => console.error(`[ERROR] ${ctx.type}`, error)
 * };
 *
 * store.use(loggerPlugin);
 * dispatch(myAction, { store }, payload); // Will log start/end
 *
 * // Action with return value
 * const getUser = action(
 *   (store, userId: string) => {
 *     return store.get(usersState).find(u => u.id === userId);
 *   },
 *   { name: 'users/get' }
 * );
 *
 * const user = dispatch(getUser, { store }, '123');
 * console.log(user); // User object or undefined
 * ```
 */
export const dispatch = <P, R>(
  action: Action<P, R>,
  options: DispatchOptions,
  payload: P
): R => {
  const { store } = options;
  const { handler, plugins: actionPlugins = [], name } = action;

  // Merge store plugins and action-level plugins
  const storePlugins = store.getPlugins();
  const allPlugins: Plugin[] = [...storePlugins, ...actionPlugins];

  const context: ActionContext = { type: name || 'anonymous', payload };

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
