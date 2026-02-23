# useActions Type Optimization Design

## Goal

Optimize `useActions` hook to preserve full type information for each action, including payload types and return types.

## Current Problem

The current implementation loses type information:

```typescript
export const useActions = (actions: Action[]) => {
  const store = useRelaxStore();
  return useMemo(() => {
    return actions.map((action) => (payload?: any) => action(store, payload));
  }, [actions, store]);
};
```

When used:
```typescript
const [addTodo, toggleTodo] = useActions([addTodoAction, toggleTodoAction]);
addTodo({ text: 'hello' }); // ❌ No type safety, any type
```

## Solution

Use TypeScript's tuple types and const assertions to preserve type information.

## Implementation

```typescript
export const useActions = <const P extends Action[]>(actions: P) => {
  const store = useRelaxStore();
  return useMemo(() => {
    return actions.map((action) => (payload: Parameters<typeof action>[1]) => action(store, payload));
  }, [actions, store]) as {
    [K in keyof P]: P[K] extends Action<infer P, infer R>
      ? (payload: P) => R
      : never;
  };
};
```

## Usage

```typescript
// Define actions with types
const addTodoAction = action((store, payload: { text: string }) => {
  const newTodo: Todo = { id: Date.now().toString(), text: payload.text, completed: false };
  const currentTodos = store.get(todoListAtom) || [];
  store.set(todoListAtom, [...currentTodos, newTodo]);
  return newTodo;
}, { name: 'addTodo' });

const toggleTodoAction = action((store, payload: { id: string }) => {
  // ...
}, { name: 'toggleTodo' });

// Use in React component
const [addTodo, toggleTodo] = useActions([addTodoAction, toggleTodoAction]);

// Full type safety!
addTodo({ text: 'hello' });     // ✓ Payload type: { text: string }, Return: Todo
toggleTodo({ id: '123' });      // ✓ Payload type: { id: string }, Return: void
```

## Async Action Support

The solution also supports async actions:

```typescript
const fetchUserAction = action(async (store, payload: { id: string }) => {
  const res = await fetch(`/api/users/${payload.id}`);
  return res.json();
}, { name: 'fetchUser' });

const [fetchUser] = useActions([fetchUserAction]);

const user = await fetchUser({ id: '123' }); // ✓ Returns Promise<User>
```

## Key Points

1. **Tuple type preservation** - Use `const` type parameter to preserve tuple types
2. **Generic inference** - TypeScript can infer each action's P (payload) and R (return) types
3. **No runtime overhead** - Pure type transformation, same runtime behavior
4. **Backward compatible** - Same API, just with proper typing
