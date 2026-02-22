/**
 * Main entry point for @relax/core package
 * Exports all public APIs for state management, selectors, and events
 */

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
export { createStore, DefultStore, type Store } from './store';
