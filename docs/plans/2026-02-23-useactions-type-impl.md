# useActions Type Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Optimize useActions hook to preserve full type information for each action, enabling type-safe payload and return types.

**Architecture:** Use TypeScript's tuple types with const parameter to preserve type information at runtime, mapping each Action to its typed function.

**Tech Stack:** TypeScript, React Hooks, Relax Action system

---

## Task 1: Update useActions type signature

**Files:**
- Modify: `packages/relax-react/src/hooks/index.ts:59-64`

**Step 1: Read current implementation**

```typescript
export const useActions = (actions: Action[]) => {
  const store = useRelaxStore();
  return useMemo(() => {
    return actions.map((action) => (payload?: any) => action(store, payload));
  }, [actions, store]);
};
```

**Step 2: Run existing tests to verify baseline**

Run: `pnpm test:run`
Expected: All tests pass

**Step 3: Update useActions with proper typing**

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

**Step 4: Run tests to verify**

Run: `pnpm test:run`
Expected: All tests pass

**Step 5: Commit**

```bash
git add packages/relax-react/src/hooks/index.ts
git commit -m "feat(react): optimize useActions with proper type inference"
```

---

## Task 2: Add type tests for useActions

**Files:**
- Create: `packages/relax-react/__tests__/use-actions.test.tsx`

**Step 1: Write failing type test**

```typescript
import { describe, expect, it } from 'vitest';
import { action, createStore } from '@relax-state/core';
import { useActions } from '../src/hooks';
import { renderHook } from '@testing-library/react';

describe('useActions', () => {
  it('should preserve action types in tuple', () => {
    const store = createStore();

    const addAction = action((store, payload: { text: string }) => {
      return { id: '1', ...payload, completed: false };
    }, { name: 'add' });

    const toggleAction = action((store, payload: { id: string }) => {
      // no return
    }, { name: 'toggle' });

    const { result } = renderHook(() =>
      useActions([addAction, toggleAction])
    );

    // Should have proper types - this is compile-time check
    const [add, toggle] = result.current;

    // Runtime verification
    expect(typeof add).toBe('function');
    expect(typeof toggle).toBe('function');
  });
});
```

**Step 2: Run test to verify it passes**

Run: `pnpm test:run`
Expected: Test passes

**Step 3: Commit**

```bash
git add packages/relax-react/__tests__/use-actions.test.tsx
git commit -m "test(react): add type tests for useActions"
```
