/**
 * Main entry point for @relax/core package
 * Exports all public APIs for state management, selectors, and events
 */

// Export atom functionality for atomic state management
export { type RelaxState, atom, update } from './atom';
// Export selector functionality
export { type SelectorValue, selector } from './selector';

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
