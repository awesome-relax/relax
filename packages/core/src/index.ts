/**
 * Main entry point for @relax/core package
 * Exports all public APIs for state management, selectors, events, and actions
 */

// Export plugin system
export { type ActionContext, type Plugin } from './plugin';
// Export action functionality
export { type Action, type ActionOptions, action } from './action';
// Export dispatch
export { dispatch, type DispatchOptions } from './dispatch';
// Export selector functionality
export { type Computed, computed } from './computed';
// Export event system
export { createEvent } from './event';
// Export core state management utilities
export {
  type State,
  state,
  type Value,
} from './state';
export { createStore, DefultStore, type Store, type StoreOptions } from './store';
