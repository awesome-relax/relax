# @relax-state/core

Core state management library for Relax framework. Provides reactive state, computed values, effects, and actions.

## Breaking Change: Store Exports Moved

As of the store package split, `createStore` and `Store` are **no longer exported from @relax-state/core**. Import them from `@relax-state/store` instead:

```typescript
// Before
import { createStore, state } from '@relax-state/core';

// After
import { state } from '@relax-state/core';
import { createStore } from '@relax-state/store';
```

Install the store package: `pnpm add @relax-state/store`

## Installation

```bash
npm install @relax-state/core
# or
pnpm add @relax-state/core
```

## Quick Start

```typescript
import { state, computed, action } from '@relax-state/core';
import { createStore } from '@relax-state/store';

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

// Create and call actions (store is injected by the runtime)
const increment = action(
  (payload: { amount: number }, store) => {
    const current = store.get(count);
    store.set(count, current + payload.amount);
  },
  { name: 'counter/increment' }
);

// Call action directly (ensure setRuntimeStore(store) is set, e.g. via RelaxProvider)
increment({ amount: 5 });
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
import { state } from '@relax-state/core';
import { createStore } from '@relax-state/store';

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
import { createStore } from '@relax-state/store';

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
import { state, action } from '@relax-state/core';
import { createStore } from '@relax-state/store';

const store = createStore();
const count = state(0);

// Define an action (handler receives payload, then store)
const increment = action(
  (payload: { amount: number }, store) => {
    const current = store.get(count);
    store.set(count, current + payload.amount);
  },
  { name: 'counter/increment' }
);

// Call the action directly (store is injected by runtime, e.g. setRuntimeStore(store))
increment({ amount: 5 });

// Action with return value
const getCount = action(
  (_payload, store) => {
    return store.get(count);
  },
  { name: 'counter/get' }
);

const value = getCount(null);
console.log(value); // 5
```

### Plugins

Plugins hook into the action lifecycle for cross-cutting concerns. Plugins are global and can be added/removed at runtime.

```typescript
import { Plugin, action, addPlugin, removePlugin, getPlugins, clearPlugins } from '@relax-state/core';
import { createStore } from '@relax-state/store';

const store = createStore();

// Create a logging plugin
const loggerPlugin: Plugin = {
  name: 'logger',
  onBefore: (ctx) => console.log(`[START] ${ctx.name}`, ctx.payload),
  onAfter: (ctx, result) => console.log(`[END] ${ctx.name}`, result),
  onError: (ctx, error) => console.error(`[ERROR] ${ctx.name}`, error)
};

// Create a metrics plugin
const metricsPlugin: Plugin = {
  name: 'metrics',
  onBefore: (ctx) => metrics.recordStart(ctx.name),
  onAfter: (ctx) => metrics.recordEnd(ctx.name)
};

// Add global plugins
addPlugin(loggerPlugin);
addPlugin(metricsPlugin);

// Get all active plugins
const activePlugins = getPlugins();

// Remove a plugin
removePlugin('logger');

// Clear all plugins
clearPlugins();

// Define an action; global plugins run on every call
const myAction = action((payload: unknown, store) => { /* ... */ }, { name: 'myAction' });
myAction(payload);
```

## API Reference

See the TypeScript definitions for detailed API documentation.

## License

MIT
