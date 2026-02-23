# @relax-state/core

Core state management library for Relax framework. Provides reactive state, computed values, effects, and actions.

## Installation

```bash
npm install @relax-state/core
# or
pnpm add @relax-state/core
```

## Quick Start

```typescript
import { state, computed, createStore, action, dispatch } from '@relax-state/core';

// Create state
const count = state(0);
const doubled = computed({
  get: (get) => get(count) * 2
});

// Create store
const store = createStore();

// Read state
console.log(store.get(count)); // 0
console.log(store.get(doubled)); // 0

// Update state
store.set(count, 5);
console.log(store.get(count)); // 5
console.log(store.get(doubled)); // 10

// Add effects
store.effect(count, ({ oldValue, newValue }) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// Create and dispatch actions
const increment = action(
  'counter/increment',
  (store, payload: { amount: number }) => {
    const current = store.get(count);
    store.set(count, current + payload.amount);
  }
);

dispatch(increment, { store }, { amount: 5 });
```

## Core Concepts

### State

State is the fundamental unit of reactive data.

```typescript
import { state } from '@relax-state/core';

// Create primitive state
const count = state(0);
const name = state('Relax');
const user = state({ id: 1, name: 'John' });

// With name for debugging
const debugState = state(0, 'counter');
```

### Store

The store manages all state and effects.

```typescript
import { createStore, state } from '@relax-state/core';

const store = createStore();
const count = state(0);

// Read state
const value = store.get(count);

// Update state
store.set(count, 5);

// Subscribe to changes
const unsubscribe = store.effect(count, ({ oldValue, newValue }) => {
  console.log(`Changed: ${oldValue} -> ${newValue}`);
});

// Unsubscribe
unsubscribe();
```

### Computed

Computed values are derived from other states.

```typescript
import { state, computed } from '@relax-state/core';

const count = state(0);
const doubled = computed({
  get: (get) => get(count) * 2
});

const store = createStore();
console.log(store.get(doubled)); // 0

store.set(count, 5);
console.log(store.get(doubled)); // 10
```

### Actions

Actions encapsulate business logic and can be dispatched.

```typescript
import { state, action, dispatch, createStore } from '@relax-state/core';

const store = createStore();
const count = state(0);

// Define an action
const increment = action(
  'counter/increment',
  (store, payload: { amount: number }) => {
    const current = store.get(count);
    store.set(count, current + payload.amount);
  }
);

// Dispatch the action
dispatch(increment, { store }, { amount: 5 });

// Action with return value
const getCount = action('counter/get', (store) => {
  return store.get(count);
});

const value = dispatch(getCount, { store }, null);
console.log(value); // 5
```

### Plugins

Plugins hook into the action lifecycle for cross-cutting concerns.

```typescript
import { Plugin, action, dispatch, createStore } from '@relax-state/core';

// Create a logging plugin
const loggerPlugin: Plugin = {
  name: 'logger',
  onBefore: (ctx) => console.log(`[START] ${ctx.type}`, ctx.payload),
  onAfter: (ctx, result) => console.log(`[END] ${ctx.type}`, result),
  onError: (ctx, error) => console.error(`[ERROR] ${ctx.type}`, error)
};

// Create a metrics plugin
const metricsPlugin: Plugin = {
  name: 'metrics',
  onBefore: (ctx) => metrics.recordStart(ctx.type),
  onAfter: (ctx) => metrics.recordEnd(ctx.type)
};

// Use plugins at store level
const store = createStore({
  plugins: [loggerPlugin, metricsPlugin]
});

// Or add later
store.use(analyticsPlugin);

// Use plugins at action level
const myAction = action(
  'my/action',
  (store, payload) => { /* ... */ },
  { plugins: [specificPlugin] }
);

// Dispatch - both store and action plugins will be called
dispatch(myAction, { store }, payload);
```

## API Reference

See the TypeScript definitions for detailed API documentation.

## License

MIT
