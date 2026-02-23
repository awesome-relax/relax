/**
 * Basic Actions Example
 * Demonstrates how to use actions with the Relax state management system
 */

import {
  state,
  action,
  dispatch,
  createStore,
  type Plugin,
} from '@relax-state/core';

// ============================================================================
// Setup
// ============================================================================

console.log('=== Basic Actions Example ===\n');

// Create a store
const store = createStore();

// Create some state
const counter = state(0, 'counter');
const user = state({ name: 'Guest', loggedIn: false }, 'user');

// ============================================================================
// Define Actions
// ============================================================================

/**
 * Action: Increment counter
 */
const increment = action(
  'counter/increment',
  (store, payload: { amount: number }) => {
    const current = store.get(counter);
    store.set(counter, current + payload.amount);
    console.log(`  Counter incremented by ${payload.amount}: ${current} -> ${current + payload.amount}`);
  }
);

/**
 * Action: Decrement counter
 */
const decrement = action(
  'counter/decrement',
  (store, payload: { amount: number }) => {
    const current = store.get(counter);
    store.set(counter, current - payload.amount);
    console.log(`  Counter decremented by ${payload.amount}: ${current} -> ${current - payload.amount}`);
  }
);

/**
 * Action: Reset counter
 */
const resetCounter = action(
  'counter/reset',
  (store) => {
    store.set(counter, 0);
    console.log('  Counter reset to 0');
  }
);

/**
 * Action: Login user
 */
const login = action(
  'user/login',
  (store, payload: { name: string }) => {
    store.set(user, { name: payload.name, loggedIn: true });
    console.log(`  User logged in: ${payload.name}`);
  }
);

/**
 * Action: Logout user
 */
const logout = action(
  'user/logout',
  (store) => {
    store.set(user, { name: 'Guest', loggedIn: false });
    console.log('  User logged out');
  }
);

/**
 * Action: Get current state (with return value)
 */
const getState = action(
  'state/get',
  (store) => {
    return {
      counter: store.get(counter),
      user: store.get(user),
    };
  }
);

// ============================================================================
// Plugin Example
// ============================================================================

console.log('--- Plugin Example ---');

/**
 * Simple logging plugin
 */
const loggerPlugin: Plugin = {
  name: 'logger',
  onBefore: (ctx) => {
    console.log(`  [PLUGIN] Before: ${ctx.type}`);
  },
  onAfter: (ctx, result) => {
    console.log(`  [PLUGIN] After: ${ctx.type}`, result);
  },
  onError: (ctx, error) => {
    console.error(`  [PLUGIN] Error: ${ctx.type}`, error);
  },
};

// Add plugin to store
store.use(loggerPlugin);
console.log('  Logger plugin registered\n');

// ============================================================================
// Execute Actions
// ============================================================================

console.log('--- Executing Actions ---\n');

console.log('1. Increment counter:');
dispatch(increment, { store }, { amount: 5 });

console.log('\n2. Increment again:');
dispatch(increment, { store }, { amount: 3 });

console.log('\n3. Decrement:');
dispatch(decrement, { store }, { amount: 2 });

console.log('\n4. Login user:');
dispatch(login, { store }, { name: 'John Doe' });

console.log('\n5. Get current state (action with return value):');
const currentState = dispatch(getState, { store }, null);
console.log('  Current state:', currentState);

console.log('\n6. Logout:');
dispatch(logout, { store }, null);

console.log('\n7. Reset counter:');
dispatch(resetCounter, { store }, null);

// ============================================================================
// Final State
// ============================================================================

console.log('\n--- Final State ---');
const finalState = dispatch(getState, { store }, null);
console.log('  Final state:', finalState);

console.log('\n=== Example Complete ===');
