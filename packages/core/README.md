# @relax/core

The core package of the Relax framework, providing reactive state management functionality. This is a lightweight, high-performance state management solution that supports atomic states, derived states, and event systems.

## 🚀 Features

- **Atomic State Management**: Use `atom` to create independent state units
- **Derived States**: Use `selector` to create derived states based on other states
- **Reactive Updates**: Automatically track dependencies and update when state changes
- **Event System**: Built-in event dispatching mechanism
- **Type Safety**: Complete TypeScript support
- **Lightweight**: No external dependencies, small bundle size

## 📦 Installation

```bash
npm install @relax/core
```

## 🎯 Core Concepts

### Atom (Atomic State)

Atom is the most basic state unit that can store values of any type.

```typescript
import { atom, update, get } from '@relax/core';

// Create a simple atom
const counterAtom = atom(0);

// Get value
const value = get(counterAtom); // 0

// Update value
update(counterAtom, 1);
```

### Selector (Derived State)

Selector creates derived states based on other states and automatically tracks dependencies.

```typescript
import { selector, get } from '@relax/core';

const doubleCounterSelector = selector((get) => {
  const count = get(counterAtom);
  return count * 2;
});

// When counterAtom changes, doubleCounterSelector will automatically recalculate
```

### Effect (Side Effects)

Effect is used to listen for state changes and execute side effects.

```typescript
import { effect, removeEffect } from '@relax/core';

// Add side effect
const removeEffectFn = effect(counterAtom, (state) => {
  console.log('Counter changed:', state.value);
});

// Remove side effect
removeEffectFn();
```

### Event (Event System)

Event system is used for communication between components.

```typescript
import { createEvent } from '@relax/core';

const userLoginEvent = createEvent<{ userId: string; name: string }>();

// Listen to event
userLoginEvent.on((user) => {
  console.log('User logged in:', user);
});

// Trigger event
userLoginEvent({ userId: '123', name: 'John' });
```

## 📚 API Reference

### atom

Create an atomic state.

```typescript
function atom<T, R = T>(
  value: T | ((params: R) => T | Promise<T>),
  defaultValue?: T
): RelaxState<T, R>
```

**Parameters:**
- `value`: Initial value or update function
- `defaultValue`: Default value (used when value is a function)

**Examples:**
```typescript
// Simple value
const countAtom = atom(0);

// With update function
const asyncCountAtom = atom(
  (params: number) => Promise.resolve(params + 1),
  0
);
```

### update

Update the value of an atom.

```typescript
function update<T, R>(state: RelaxState<T, R>, value: R): Promise<void>
```

**Example:**
```typescript
await update(countAtom, 5);
await update(asyncCountAtom, 10);
```

### get

Get the value of a state.

```typescript
function get<T extends RelaxValue<any>>(state: T): T['value'] | undefined
```

**Example:**
```typescript
const value = get(countAtom);
```

### selector

Create a derived state.

```typescript
function selector<T>(
  computeFn: (getter: RelaxStateGetter) => T | Promise<T>
): SelectorValue<T>
```

**Example:**
```typescript
const doubleCountSelector = selector((get) => {
  const count = get(countAtom);
  return count * 2;
});
```

### effect

Add side effects for state changes.

```typescript
function effect(
  state: RelaxValue<any>, 
  fn: (state: RelaxValue<any>) => void
): () => void
```

**Returns:** Function to remove the side effect

**Example:**
```typescript
const removeEffect = effect(countAtom, (state) => {
  console.log('Count changed:', state.value);
});

// Remove side effect
removeEffect();
```

### removeEffect

Remove side effects for state changes.

```typescript
function removeEffect(
  state: RelaxValue<any>, 
  fn: (state: RelaxValue<any>) => void
): void
```

### dispose

Destroy a state node and clean up all related resources.

```typescript
function dispose(state: RelaxValue<any>): void
```

### createEvent

Create an event dispatcher.

```typescript
function createEvent<T>(): EventDispatcher<T>
```

**Example:**
```typescript
const event = createEvent<string>();

event.on((value) => console.log('Event:', value));
event('Hello World');
```

## 🔧 Type Definitions

### RelaxState

Type definition for atomic state.

```typescript
interface RelaxState<T, R = T> extends RelaxValue<T> {
  readonly type: 'atom';
}
```

### SelectorValue

Type definition for derived state.

```typescript
interface SelectorValue<T> extends RelaxValue<T> {
  readonly type: 'selector';
}
```

### RelaxValue

Base value type.

```typescript
interface RelaxValue<T> {
  id: string;
  value?: T;
}
```

### EventDispatcher

Event dispatcher type.

```typescript
type EventDispatcher<T> = ((value: T) => void) & {
  on: (fn: Listener<T>) => void;
  off: (fn: Listener<T>) => void;
};
```

## 💡 Usage Examples

### Counter Application

```typescript
import { atom, selector, update, get, effect } from '@relax/core';

// Create states
const countAtom = atom(0);
const doubleCountSelector = selector((get) => get(countAtom) * 2);

// Add side effect
effect(countAtom, (state) => {
  console.log('Count:', state.value);
});

// Update state
update(countAtom, 5);
console.log('Double count:', get(doubleCountSelector)); // 10
```

### User State Management

```typescript
import { atom, selector, update, get } from '@relax/core';

// User state
const userAtom = atom<{ id: string; name: string } | null>(null);
const isLoggedInSelector = selector((get) => get(userAtom) !== null);
const userNameSelector = selector((get) => get(userAtom)?.name || 'Guest');

// Login
update(userAtom, { id: '123', name: 'John' });
console.log('Is logged in:', get(isLoggedInSelector)); // true
console.log('User name:', get(userNameSelector)); // 'John'
```

### Async State

```typescript
import { atom, update, get } from '@relax/core';

// Async user data fetching
const userDataAtom = atom(
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
  null
);

// Fetch user data
await update(userDataAtom, '123');
const userData = get(userDataAtom);
```

## 🏗️ Architecture Design

Relax Core follows these design principles:

1. **Reactive**: State changes automatically trigger related updates
2. **Immutable**: State updates through functional approach
3. **Type Safe**: Complete TypeScript support
4. **Lightweight**: Minimal dependencies and bundle size
5. **Composable**: States can be freely combined and derived

## 🔄 State Lifecycle

1. **Creation**: Use `atom()` or `selector()` to create states
2. **Subscription**: Use `effect()` to listen for state changes
3. **Update**: Use `update()` to update state values
4. **Cleanup**: Use `dispose()` to destroy state nodes

## 📝 Important Notes

- State nodes are managed in a global registry, be careful to avoid memory leaks
- Consider state isolation in SSR scenarios
- Async update functions need proper Promise handling
- It's recommended to clean up related effects when components unmount

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

ISC License 