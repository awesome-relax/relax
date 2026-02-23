/**
 * Main entry point for @relax/core package
 * Exports all public APIs for state management, selectors, events, and actions
 */

// Export action functionality
export { type Action, type ActionOptions, action } from './action';
// Export selector functionality
export { type Computed, computed } from './computed';
// Export event system
export { createEvent } from './event';
// Export plugin system
export {
  type ActionContext,
  addPlugin,
  clearPlugins,
  getPlugins,
  Plugin,
  removePlugin,
} from './plugin';
// Export core state management utilities
export {
  type State,
  state,
  type Value,
} from './state';
export { createStore, DefultStore, type Store } from './store';
