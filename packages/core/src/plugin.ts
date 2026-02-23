/**
 * Plugin system for Action monitoring
 * Provides hooks for tracking action execution, useful for logging, debugging, and analytics
 * @module plugin
 */

/**
 * Action context passed to plugin hooks
 * Contains information about the action being executed
 */
export interface ActionContext {
  /** Unique action type identifier */
  type: string;
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
 *   onBefore: (ctx) => console.log(`[START] ${ctx.type}`, ctx.payload),
 *   onAfter: (ctx, result) => console.log(`[END] ${ctx.type}`, result),
 *   onError: (ctx, error) => console.error(`[ERROR] ${ctx.type}`, error)
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
