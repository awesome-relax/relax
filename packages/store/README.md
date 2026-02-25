# @relax-state/store

Store runtime for the Relax framework. Manages reactive state values, computed caching, and effects.

## Installation

```bash
npm install @relax-state/store
# or
pnpm add @relax-state/store
```

Requires `@relax-state/core` for state creation (`state`, `computed`).

## Quick Usage

```typescript
import { state, computed } from '@relax-state/core';
import { createStore } from '@relax-state/store';

const store = createStore();
const count = state(0);
const doubled = computed({ get: (get) => get(count) * 2 });

// Read state
console.log(store.get(count)); // 0
console.log(store.get(doubled)); // 0

// Update state
store.set(count, 5);
console.log(store.get(count)); // 5
console.log(store.get(doubled)); // 10

// Subscribe to changes
store.effect(count, ({ oldValue, newValue }) => {
  console.log(`Count: ${oldValue} -> ${newValue}`);
});
```

## API

### `createStore(): Store`

Creates a new store instance. Use this when you need multiple isolated stores.

```typescript
import { createStore } from '@relax-state/store';

const store = createStore();
```

### `DefultStore`

Singleton store instance. Use when you don't need multiple stores.

```typescript
import { DefultStore } from '@relax-state/store';
import { state } from '@relax-state/core';

const count = state(0);
DefultStore.set(count, 5);
console.log(DefultStore.get(count)); // 5
```

### `Store`

The store class. Instances provide:

- **`get(state)`** – Read state value (computes and caches derived values)
- **`set(state, value)`** – Update state and trigger effects
- **`effect(state, fn)`** – Subscribe to state changes; returns unsubscribe function
- **`clearEffect(state, fn)`** – Remove an effect callback

```typescript
import type { Store } from '@relax-state/store';
```

## License

ISC
