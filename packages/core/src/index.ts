/**
 * Main entry point for @relax/core package
 * Exports all public APIs for state management, selectors, and events
 */

// Export event system
export { createEvent } from './event';
// Export selector functionality
export { type Computed, computed } from './computed';
// Export core state management utilities
export {
  type State,
  type Value,
  state,
} from './state';
export { createStore, DefultStore, type Store } from './store';
