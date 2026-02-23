/**
 * Action system for Relax framework
 * Provides action factory for creating dispatchable actions with handlers
 * @module action
 * @example
 * ```typescript
 * const increment = action('increment', (store, payload: { delta: number }) => {
 *   const current = store.get(countState);
 *   store.set(countState, current + payload.delta);
 * });
 * ```
 */

import { type Store } from './store';
import { type Plugin } from './plugin';

/**
 * Action handler function type
 * @template P - Payload type
 * @template R - Return type
 * @template S - Store type (defaults to Store)
 * @param store - The store instance to interact with state
 * @param payload - The payload passed when dispatching the action
 * @returns The result of the action execution
 * @example
 * ```typescript
 * const handler: ActionHandler<{ id: string }, User> = (store, payload) => {
 *   return store.get(userState).find(u => u.id === payload.id);
 * };
 * ```
 */
export type ActionHandler<P, R, S extends Store = Store> = (
  store: S,
  payload: P
) => R;

/**
 * Action interface
 * Represents a dispatchable action with its handler and metadata
 * @template P - Payload type
 * @template R - Return type
 * @example
 * ```typescript
 * const myAction: Action<{ id: string }, User> = action('getUser', (store, payload) => {
 *   return store.get(users).find(u => u.id === payload.id);
 * });
 * ```
 */
export interface Action<P = any, R = any> {
  /** Unique action type identifier */
  type: string;

  /** Action handler function that implements the business logic */
  handler: ActionHandler<P, R>;

  /** Optional readable name for debugging and logging */
  name?: string;

  /** Optional plugins specific to this action for custom behavior */
  plugins?: Plugin[];
}

/**
 * Action options for creating actions
 * Used to configure additional action properties
 * @example
 * ```typescript
 * const myAction = action(
 *   'fetchUser',
 *   (store, id: string) => store.get(userState),
 *   { name: 'Fetch User Action', plugins: [loggerPlugin] }
 * );
 * ```
 */
export interface ActionOptions {
  /** Optional readable name for the action */
  name?: string;

  /** Optional plugins specific to this action */
  plugins?: Plugin[];
}

/**
 * Creates a new Action
 * Actions are the primary way to modify state in Relax. They encapsulate business logic
 * and can be dispatched to perform operations on the store.
 *
 * @param type - Unique action type identifier (should be descriptive of the action)
 * @param handler - Action handler function that implements the business logic
 * @param options - Optional action configuration (name, plugins)
 * @returns Action object that can be dispatched
 *
 * @template P - Payload type for the action
 * @template R - Return type of the action
 *
 * @example
 * ```typescript
 * // Simple action with payload
 * const increment = action(
 *   'counter/increment',
 *   (store, payload: { amount: number }) => {
 *     const current = store.get(countState);
 *     store.set(countState, current + payload.amount);
 *   }
 * );
 *
 * // Action with return value and options
 * const fetchUser = action(
 *   'users/fetch',
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
 * // Dispatching actions
 * dispatch(increment, { store }, { amount: 5 });
 * const user = await dispatch(fetchUser, { store }, '123');
 * ```
 */
export const action = <P, R>(
  type: string,
  handler: ActionHandler<P, R>,
  options?: ActionOptions
): Action<P, R> => {
  return {
    type,
    handler,
    name: options?.name,
    plugins: options?.plugins
  };
};
