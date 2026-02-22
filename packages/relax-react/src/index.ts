/**
 * Main entry point for @relax-state/react package
 * Provides React hooks for using Relax state management in React components
 */

// Re-export all core functionality for convenience
export * from '@relax-state/core';
// Export React hooks for state management
export { useRelaxState, useRelaxValue } from './hooks';

export { RelaxProvider } from './provider';
