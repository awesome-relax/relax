# @relax/react

A React integration package for the Relax state management framework. It provides convenient hooks for using Relax atoms and selectors in React applications.

## 🚀 Features

- **React Hooks**: Seamlessly use Relax state in React components
- **Full TypeScript Support**: All hooks and APIs are fully typed
- **Lightweight**: No extra dependencies except React and @relax/core
- **Composable**: Works with both atomic and derived (selector) state

## 📦 Installation

```bash
npm install @relax/react
```

## 🎯 Usage

### useRelaxState

A hook for using and updating Relax atoms/selectors in React components.

```typescript
import { state } from '@relax-state/core';
import { useRelaxState } from '@relax-state/react';

const counterAtom = state(0);

function Counter() {
  const [count, setCount] = useRelaxState(counterAtom);

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useRelaxValue

A hook for read-only subscription to Relax atoms/selectors.

```typescript
import { computed, state } from '@relax-state/core';
import { useRelaxValue } from '@relax-state/react';

const counterAtom = state(0);
const doubleCounter = computed({ get: (get) => (get(counterAtom) ?? 0) * 2 });

function DoubleCounter() {
  const value = useRelaxValue(doubleCounter);
  return <span>Double: {value}</span>;
}
```

### useActions

A hook for using actions with full type safety. The returned tuple preserves each action's payload and return types.

```typescript
import { action } from '@relax-state/core';
import { useActions } from '@relax-state/react';

// Define actions with types
const addTodoAction = action((store, payload: { text: string }) => {
  return { id: Date.now().toString(), text: payload.text, completed: false };
}, { name: 'addTodo' });

const toggleTodoAction = action((store, payload: { id: string }) => {
  // toggle logic
}, { name: 'toggleTodo' });

function TodoList() {
  // Full type safety - each action keeps its payload and return types
  const [addTodo, toggleTodo] = useActions([addTodoAction, toggleTodoAction]);

  // addTodo: (payload: { text: string }) => { id: string; text: string; completed: boolean }
  const newTodo = addTodo({ text: 'Buy milk' });

  // toggleTodo: (payload: { id: string }) => void
  toggleTodo({ id: newTodo.id });
}
```

## 🧩 API Reference

### `useRelaxState<T, R>(relaxState: RelaxState<T, R>): [T, (value: R) => void]`
- Subscribes to a Relax atom or selector and provides a setter for updating the state.

### `useRelaxValue<T>(state: RelaxValue<T>): T`
- Subscribes to a Relax atom or selector and returns its current value (read-only).

### `useActions<P extends Action[], R>(actions: P): R`
- Returns a tuple of action functions with full type inference for payload and return types.
- Each action in the tuple preserves its original payload type P and return type R.

## 🏗️ Project Structure

```
packages/relax-react/
├── package.json
├── tsconfig.json
├── README.md
├── INITIALIZATION.md
└── src/
    ├── index.ts
    └── hooks/
        └── index.ts
```

## ⚡ Dependencies

- `@relax-state/core`
- `@relax-state/store`
- `react` (peer dependency)

## 📝 Notes

- All hooks are fully reactive and will re-render your component when the underlying state changes.
- Import state/computed/action from `@relax-state/core` and createStore/DefultStore from `@relax-state/store`.

## 📄 License

ISC License

---

## Initialization.md (English)

---

# Relax React Package Initialization

## Project Structure

```
packages/relax-react/
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── README.md             # Documentation
├── INITIALIZATION.md     # Initialization summary
└── src/
    ├── index.ts          # Main entry
    └── hooks/
        └── index.ts      # React hooks
```

## Main Features

1. **React Hooks**
   - `useRelaxState`: Use and update Relax state in React components
   - `useRelaxValue`: Read-only subscription to Relax state
   - `useActions`: Use actions with full type inference

2. **TypeScript Support**
   - All APIs are fully typed

3. **Dependencies**
   - Depends on `@relax/core`
   - Peer dependency: React 18+
   - TypeScript ready

## Basic Usage

```typescript
<code_block_to_apply_changes_from>
```

## Build & Development

### Build Commands

```bash
# Build all packages
npm run build

# Build only core
npm run build:core

# Build only react
npm run build:react

# Clean build files
npm run clean
```

### Development Notes

1. The core package currently lacks a subscribe method; hooks use the effect system for reactivity.
2. React dependencies must be installed for proper usage.
3. TypeScript configuration is provided.

## Next Steps

1. Improve the event system in core (add subscribe method)
2. Add unit tests
3. Optimize hook performance
4. Add more examples and documentation

---

如果你需要更详细的英文文档或有特殊格式要求，请告知！ 