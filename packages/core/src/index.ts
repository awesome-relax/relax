/**
 * Main entry point for @relax/core package
 * Exports all public APIs for state management, selectors, and events
 */

// Export atom functionality for atomic state management
export { atom, type RelaxState, update } from './atom';
// Export event system
export { createEvent } from './event';
// Export selector functionality
export { type SelectorValue, selector } from './selector';
// Export core state management utilities
export {
  dispose,
  effect,
  get,
  type RelaxStateGetter,
  type RelaxValue,
  removeEffect,
} from './state';
