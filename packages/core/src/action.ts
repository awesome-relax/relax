/**
 * Action system for Relax framework
 * Provides action factory for creating callable actions with plugin support
 * @module action
 * @example
 * ```typescript
 * const increment = action((store, payload: { delta: number }) => {
 *   const current = store.get(countState);
 *   store.set(countState, current + payload.delta);
 * }, { name: 'increment' });
 *
 * // Call directly (store is injected by the runtime)
 * increment({ delta: 5 });
 * ```
 */

import { getRuntimeStore, type Store } from '@relax-state/store';
import { type ActionContext, getPlugins, type Plugin } from './plugin';

/**
 * Action handler function type
 * @template P - Payload type
 * @template R - Return type
 * @template S - Store type (defaults to Store)
 * @param store - The store instance (injected by the runtime)
 * @param payload - The payload (optional when P is void or optional)
 * @returns The result of the action execution
 * @example
 * ```typescript
 * const handler: ActionHandler<{ id: string }, User> = (store, payload) => {
 *   return store.get(userState).find(u => u.id === payload.id);
 * };
 * ```
 */
export type ActionHandler<P, R, S extends Store = Store> = (store: S, payload?: P) => R;

/**
 * Action interface
 * Represents a callable action with its handler and metadata
 * @template P - Payload type
 * @template R - Return type
 * @example
 * ```typescript
 * const myAction: Action<{ id: string }, User> = action((store, payload) => {
 *   return store.get(users).find(u => u.id === payload.id);
 * }, { name: 'getUser' });
 *
 * // Call directly
 * const user = myAction({ id: '123' });
 * ```
 */
/**
 * - When P is undefined | void: no args, action().
 * - When undefined extends P (optional payload): action(payload?) optional param.
 * - Otherwise: action(payload) required.
 */
export type Action<P = any, R = any> = {
  /** Optional readable name for debugging and logging */
  name?: string;
} & ([P] extends [undefined | void]
  ? () => R
  : undefined extends P
    ? (payload?: P) => R
    : (payload: P) => R);

/**
 * Action options for creating actions
 * Used to configure additional action properties
 * @example
 * ```typescript
 * const myAction = action(
 *   (store, payload: string) => store.get(userState),
 *   { name: 'Fetch User Action', plugins: [loggerPlugin] }
 * );
 * ```
 */
export interface ActionOptions {
  /** Optional readable name for the action */
  name?: string;
}

/**
 * Creates a new Action
 * Actions are callable objects that encapsulate business logic with plugin support.
 * They can be invoked directly like: action(payload). The store is injected by the runtime.
 *
 * @param handler - Action handler (store, payload) => result
 * @param options - Optional action configuration (name, plugins)
 * @returns Callable Action object
 *
 * @template P - Payload type for the action
 * @template R - Return type of the action
 *
 * @example
 * ```typescript
 * // Simple action with payload
 * const increment = action(
 *   (store, payload: { amount: number }) => {
 *     const current = store.get(countState);
 *     store.set(countState, current + payload.amount);
 *   },
 *   { name: 'increment' }
 * );
 *
 * // Action with return value and options
 * const fetchUser = action(
 *   async (store, userId: string) => {
 *     const response = await fetch(`/api/users/${userId}`);
 *     return response.json();
 *   },
 *   {
 *     name: 'Fetch User',
 *     plugins: [loggingPlugin, analyticsPlugin]
 *   }
 * );
 *
 * // Call directly (store injected by runtime)
 * increment({ amount: 5 });
 * const user = await fetchUser('123');
 *
 * // No-payload (P is void | undefined): call with no args
 * const refresh = action((store) => { store.set(count, 0); }, { name: 'refresh' });
 * refresh();
 * ```
 */
export const action = <P, R>(
  handler: ActionHandler<P, R>,
  options?: ActionOptions
): Action<P, R> => {
  const name = options?.name;

  // Create the callable function (payload optional when P is undefined)
  const actionFn = (payload?: P): R => {
    const store = getRuntimeStore();
    // Get global plugins
    const globalPlugins = getPlugins();
    const allPlugins: Plugin[] = [...globalPlugins];

    const context: ActionContext<P, R> = { name, type: actionFn, payload };

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

  // Use Object.defineProperty to attach metadata
  Object.defineProperty(actionFn, 'name', { value: name, writable: false, configurable: false });

  return actionFn as Action<P, R>;
};
