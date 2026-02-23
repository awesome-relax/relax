/**
 * Plugin system for Action monitoring
 * Provides hooks for tracking action execution, useful for logging, debugging, and analytics
 */

/**
 * Action context passed to plugin hooks
 */
export interface ActionContext {
  /** Unique action type identifier */
  type: string;
  /** Payload passed to the action */
  payload: unknown;
}

/**
 * Plugin interface for Action monitoring
 * Plugins can hook into action lifecycle events
 */
export interface Plugin {
  /** Plugin name for identification */
  name?: string;

  /** Called before Action executes */
  onBefore?: (context: ActionContext) => void;

  /** Called after Action executes successfully */
  onAfter?: (context: ActionContext, result: unknown) => void;

  /** Called when Action throws an error */
  onError?: (context: ActionContext, error: Error) => void;
}
