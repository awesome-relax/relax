/**
 * Action system for Relax framework
 * Provides action factory for creating dispatchable actions with handlers
 */

import { type Store } from './store';
import { type Plugin } from './plugin';

/**
 * Action handler function type
 * @template P - Payload type
 * @template R - Return type
 * @template S - Store type (defaults to Store)
 */
export type ActionHandler<P, R, S extends Store = Store> = (
  store: S,
  payload: P
) => R;

/**
 * Action interface
 * @template P - Payload type
 * @template R - Return type
 */
export interface Action<P = any, R = any> {
  /** Unique action type identifier */
  type: string;

  /** Action handler function */
  handler: ActionHandler<P, R>;

  /** Optional readable name */
  name?: string;

  /** Optional plugins specific to this action */
  plugins?: Plugin[];
}

/**
 * Action options
 */
export interface ActionOptions {
  /** Optional readable name */
  name?: string;

  /** Optional plugins specific to this action */
  plugins?: Plugin[];
}

/**
 * Creates a new Action
 * @param type - Unique action type identifier
 * @param handler - Action handler function
 * @param options - Optional action options
 * @returns Action object
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
