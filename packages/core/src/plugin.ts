/**
 * Plugin system for Relax framework
 * Provides hooks for tracking action execution, useful for logging, debugging, and analytics
 * @module plugin
 */

import type { Action } from './action';

/**
 * Global plugins registry
 * Plugins are global and apply to all actions across all stores
 */
const globalPlugins: Plugin[] = [];

/**
 * Action context passed to plugin hooks
 * Contains information about the action being executed
 */
export interface ActionContext<T = any, R = any> {
  /** Action name from options */
  name?: string;
  /** Full action object */
  type: Action<T, R>;
  /** Payload passed to the action */
  payload: unknown;
}

/**
 * Plugin interface for Action monitoring
 * Plugins can hook into action lifecycle events to implement logging, analytics, error reporting, etc.
 *
 * @example
 * ```typescript
 * const loggerPlugin: Plugin = {
 *   name: 'logger',
 *   onBefore: (ctx) => console.log(`[START] ${ctx.name}`, ctx.payload),
 *   onAfter: (ctx, result) => console.log(`[END] ${ctx.name}`, result),
 *   onError: (ctx, error) => console.error(`[ERROR] ${ctx.name}`, error)
 * };
 * ```
 */
export interface Plugin {
  /** Plugin name for identification */
  name?: string;

  /**
   * Called before Action executes
   * @param context - The action context containing type and payload
   */
  onBefore?: (context: ActionContext) => void;

  /**
   * Called after Action executes successfully
   * @param context - The action context containing type and payload
   * @param result - The result returned by the action handler
   */
  onAfter?: (context: ActionContext, result: unknown) => void;

  /**
   * Called when Action throws an error
   * @param context - The action context containing type and payload
   * @param error - The error thrown by the action handler
   */
  onError?: (context: ActionContext, error: Error) => void;
}

/**
 * Adds a global plugin
 * The plugin will be applied to all actions across all stores
 *
 * @param plugin - Plugin to add
 * @example
 * ```typescript
 * const loggerPlugin: Plugin = {
 *   name: 'logger',
 *   onBefore: (ctx) => console.log(`[START] ${ctx.name}`)
 * };
 *
 * addPlugin(loggerPlugin);
 * ```
 */
export const addPlugin = (plugin: Plugin): void => {
  globalPlugins.push(plugin);
};

/**
 * Removes a global plugin by name
 *
 * @param pluginName - Name of the plugin to remove
 * @returns true if plugin was found and removed
 * @example
 * ```typescript
 * removePlugin('logger');
 * ```
 */
export const removePlugin = (pluginName: string): boolean => {
  const index = globalPlugins.findIndex((p) => p.name === pluginName);
  if (index !== -1) {
    globalPlugins.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * Gets all global plugins
 *
 * @returns Array of all registered plugins
 * @example
 * ```typescript
 * const plugins = getPlugins();
 * console.log(`Total plugins: ${plugins.length}`);
 * ```
 */
export const getPlugins = (): Plugin[] => {
  return [...globalPlugins];
};

/**
 * Clears all global plugins
 *
 * @example
 * ```typescript
 * clearPlugins();
 * ```
 */
export const clearPlugins = (): void => {
  globalPlugins.length = 0;
};
