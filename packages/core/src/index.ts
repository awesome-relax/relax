/**
 * Main entry point for @relax/core package
 * Exports all public APIs for state management, selectors, and events
 */

// Export selector functionality
export { selector, type SelectorValue } from './selector';

// Export atom functionality for atomic state management
export { atom, update, type RelaxState } from './atom';

// Export core state management utilities
export {
  type RelaxValue,
  type RelaxStateGetter,
  effect,
  removeEffect,
  dispose,
  get,
} from './state';

// Export event system
export { createEvent } from './event';
