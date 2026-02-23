# Action 功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 为 @relax-state/core 添加 Action 功能，实现视图与逻辑分离，支持插件系统用于监控和埋点

**架构:** 采用类似 Zsa 的 action factory 方案，Action 创建时绑定 handler，运行时注入 Store。插件系统支持 onBefore/onAfter/onError 生命周期钩子，支持全局插件和 Action 级插件。

**技术栈:** TypeScript, Vitest

---

## 文件清单

- 新增: `packages/core/src/plugin.ts`
- 新增: `packages/core/src/action.ts`
- 新增: `packages/core/src/dispatch.ts`
- 修改: `packages/core/src/store.ts`
- 修改: `packages/core/src/index.ts`
- 新增测试: `packages/core/__tests__/action.test.ts`
- 新增测试: `packages/core/__tests__/plugin.test.ts`

---

## Task 1: 创建 Plugin 接口

**Files:**
- 新增: `packages/core/src/plugin.ts`

**Step 1: 写入测试**

```typescript
// packages/core/__tests__/plugin.test.ts
import { describe, it, expect } from 'vitest';
import { type Plugin } from '../src/plugin';

describe('Plugin', () => {
  it('should have correct interface', () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      onBefore: (ctx) => { console.log('before', ctx.type); },
      onAfter: (ctx, result) => { console.log('after', result); },
      onError: (ctx, error) => { console.log('error', error); }
    };

    expect(plugin.name).toBe('test-plugin');
    expect(typeof plugin.onBefore).toBe('function');
    expect(typeof plugin.onAfter).toBe('function');
    expect(typeof plugin.onError).toBe('function');
  });

  it('should allow optional hooks', () => {
    const minimalPlugin: Plugin = {
      name: 'minimal'
    };

    expect(minimalPlugin.name).toBe('minimal');
    expect(minimalPlugin.onBefore).toBeUndefined();
    expect(minimalPlugin.onAfter).toBeUndefined();
    expect(minimalPlugin.onError).toBeUndefined();
  });
});
```

**Step 2: 运行测试验证失败**

Run: `cd packages/core && pnpm test:run -- __tests__/plugin.test.ts`
Expected: FAIL (Plugin type not exported)

**Step 3: 写入最小实现**

```typescript
// packages/core/src/plugin.ts

/**
 * Action context passed to plugin hooks
 */
export interface ActionContext {
  type: string;
  payload: unknown;
}

/**
 * Plugin interface for Action monitoring
 */
export interface Plugin {
  /** Plugin name for identification */
  name?: string;

  /** Called before Action executes */
  onBefore?: (context: ActionContext) => void;

  /** Called after Action executes successfully */
  onAfter?: (context: ActionContext, result: unknown) => void;

  /** Called when Action throws an error */
  onError?: (context: ActionContext, error: Error) => void;
}
```

**Step 4: 运行测试验证通过**

Run: `cd packages/core && pnpm test:run -- __tests__/plugin.test.ts`
Expected: PASS

**Step 5: 提交**

```bash
cd packages/core && git add src/plugin.ts __tests__/plugin.test.ts
git commit -m "feat(core): add Plugin interface"
```

---

## Task 2: 创建 Action 类型和创建函数

**Files:**
- 新增: `packages/core/src/action.ts`

**Step 1: 写入测试**

```typescript
// packages/core/__tests__/action.test.ts
import { describe, it, expect } from 'vitest';
import { action, type Action } from '../src/action';

describe('Action', () => {
  it('should create action with type and handler', () => {
    const testAction: Action<{ delta: number }, void> = action(
      'increment',
      (store, payload) => {
        // handler will be tested in dispatch
      }
    );

    expect(testAction.type).toBe('increment');
    expect(typeof testAction.handler).toBe('function');
  });

  it('should create action with options', () => {
    const testAction = action(
      'decrement',
      (store, payload) => {},
      { name: 'Decrement Action' }
    );

    expect(testAction.type).toBe('decrement');
    expect(testAction.name).toBe('Decrement Action');
  });

  it('should support generic payload types', () => {
    const stringAction = action<string, void>('greet', (store, name) => {});
    expect(stringAction.type).toBe('greet');

    const objectAction = action<{ x: number; y: number }, number>('add', (store, coord) => {
      return coord.x + coord.y;
    });
    expect(objectAction.type).toBe('add');
  });
});
```

**Step 2: 运行测试验证失败**

Run: `cd packages/core && pnpm test:run -- __tests__/action.test.ts`
Expected: FAIL (action not exported)

**Step 3: 写入最小实现**

```typescript
// packages/core/src/action.ts

import { type Store } from './store';

/**
 * Action handler function type
 */
export type ActionHandler<P, R, S extends Store = Store> = (
  store: S,
  payload: P
) => R;

/**
 * Action interface
 */
export interface Action<P = any, R = any> {
  /** Unique action type identifier */
  type: string;

  /** Action handler function */
  handler: ActionHandler<P, R>;

  /** Optional readable name */
  name?: string;

  /** Optional plugins specific to this action */
  plugins?: import('./plugin').Plugin[];
}

/**
 * Action options
 */
export interface ActionOptions {
  /** Optional readable name */
  name?: string;

  /** Optional plugins specific to this action */
  plugins?: import('./plugin').Plugin[];
}

/**
 * Creates a new Action
 * @param type - Unique action type identifier
 * @param handler - Action handler function
 * @param options - Optional action options
 * @returns Action object
 */
export const action = <P, R>(
  type: string,
  handler: ActionHandler<P, R>,
  options?: ActionOptions
): Action<P, R> => {
  return {
    type,
    handler,
    name: options?.name,
    plugins: options?.plugins
  };
};
```

**Step 4: 运行测试验证通过**

Run: `cd packages/core && pnpm test:run -- __tests__/action.test.ts`
Expected: PASS

**Step 5: 提交**

```bash
cd packages/core && git add src/action.ts __tests__/action.test.ts
git commit -m "feat(core): add Action type and action factory"
```

---

## Task 3: 扩展 Store 支持插件

**Files:**
- 修改: `packages/core/src/store.ts`

**Step 1: 写入测试**

在 `packages/core/__tests__/store.test.ts` 添加新测试:

```typescript
import { type Plugin } from '../src/plugin';

describe('Store Plugins', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('should accept plugins in constructor', () => {
    const testPlugin: Plugin = { name: 'test' };
    const storeWithPlugin = createStore({ plugins: [testPlugin] });

    expect(storeWithPlugin.getPlugins()).toHaveLength(1);
    expect(storeWithPlugin.getPlugins()[0].name).toBe('test');
  });

  it('should allow adding plugins via use()', () => {
    const plugin1: Plugin = { name: 'plugin1' };
    const plugin2: Plugin = { name: 'plugin2' };

    store.use(plugin1);
    store.use(plugin2);

    expect(store.getPlugins()).toHaveLength(2);
  });

  it('should return empty array when no plugins', () => {
    expect(store.getPlugins()).toEqual([]);
  });
});
```

**Step 2: 运行测试验证失败**

Run: `cd packages/core && pnpm test:run -- __tests__/store.test.ts`
Expected: FAIL (plugins option not supported)

**Step 3: 写入实现**

在 `packages/core/src/store.ts` 文件顶部添加 import:

```typescript
import { type Plugin } from './plugin';
```

添加 StoreOptions 接口和修改 Store 类:

```typescript
export interface StoreOptions {
  plugins?: Plugin[];
}

export class Store {
  /** Internal storage for state values */
  private values: Map<string, unknown> = new Map();
  /** Internal storage for effect callbacks mapped by state ID */
  private effects: Map<string, Set<(value: { oldValue: unknown; newValue: unknown }) => void>> =
    new Map();
  /** Tracks currently computing states to detect circular dependencies */
  private computing: Set<string> = new Set();
  /** Store plugins */
  private plugins: Plugin[] = [];

  constructor(options: StoreOptions = {}) {
    this.plugins = options.plugins || [];
  }

  // ... 现有方法保持不变 ...

  /**
   * Gets all registered plugins
   * @returns Array of plugins
   */
  getPlugins(): Plugin[] {
    return this.plugins;
  }

  /**
   * Adds a plugin to the store
   * @param plugin - Plugin to add
   */
  use(plugin: Plugin): void {
    this.plugins.push(plugin);
  }
}
```

修改 createStore 函数:

```typescript
export const createStore = (options?: StoreOptions): Store => {
  return new Store(options);
};
```

**Step 4: 运行测试验证通过**

Run: `cd packages/core && pnpm test:run -- __tests__/store.test.ts`
Expected: PASS

**Step 5: 提交**

```bash
cd packages/core && git add src/store.ts
git commit -m "feat(core): extend Store with plugin support"
```

---

## Task 4: 创建 Dispatch 函数

**Files:**
- 新增: `packages/core/src/dispatch.ts`

**Step 1: 写入测试**

```typescript
// packages/core/__tests__/dispatch.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { dispatch, type DispatchOptions } from '../src/dispatch';
import { action } from '../src/action';
import { state } from '../src/state';
import { createStore, type Store } from '../src/store';
import { type Plugin } from '../src/plugin';

describe('Dispatch', () => {
  let store: Store;
  let countState: ReturnType<typeof state<number>>;

  beforeEach(() => {
    store = createStore();
    countState = state(0, 'count');
  });

  it('should execute action handler with payload', () => {
    const incrementAction = action(
      'increment',
      (s, payload: { delta: number }) => {
        const current = s.get(countState);
        s.set(countState, current + payload.delta);
      }
    );

    const options: DispatchOptions = { store };
    dispatch(incrementAction, options, { delta: 5 });

    expect(store.get(countState)).toBe(5);
  });

  it('should return result from action handler', () => {
    const addAction = action(
      'add',
      (s, payload: { a: number; b: number }) => {
        return payload.a + payload.b;
      }
    );

    const options: DispatchOptions = { store };
    const result = dispatch(addAction, options, { a: 3, b: 7 });

    expect(result).toBe(10);
  });

  it('should call onBefore plugin hook', () => {
    let beforeCalled = false;
    const plugin: Plugin = {
      name: 'test',
      onBefore: (ctx) => {
        beforeCalled = true;
        expect(ctx.type).toBe('test-action');
      }
    };

    store.use(plugin);

    const testAction = action('test-action', (s) => {});
    dispatch(testAction, { store }, null);

    expect(beforeCalled).toBe(true);
  });

  it('should call onAfter plugin hook on success', () => {
    let afterCalled = false;
    let resultValue: unknown;
    const plugin: Plugin = {
      name: 'test',
      onAfter: (ctx, result) => {
        afterCalled = true;
        resultValue = result;
      }
    };

    store.use(plugin);

    const testAction = action('test-action', () => 42);
    dispatch(testAction, { store }, null);

    expect(afterCalled).toBe(true);
    expect(resultValue).toBe(42);
  });

  it('should call onError plugin hook on exception', () => {
    let errorCalled = false;
    let capturedError: Error | null = null;
    const plugin: Plugin = {
      name: 'test',
      onError: (ctx, error) => {
        errorCalled = true;
        capturedError = error;
      }
    };

    store.use(plugin);

    const testAction = action('test-action', () => {
      throw new Error('Test error');
    });

    expect(() => dispatch(testAction, { store }, null)).toThrow('Test error');
    expect(errorCalled).toBe(true);
    expect(capturedError?.message).toBe('Test error');
  });

  it('should call action-level plugins', () => {
    let actionPluginCalled = false;
    const actionPlugin: Plugin = {
      name: 'action-plugin',
      onBefore: () => { actionPluginCalled = true; }
    };

    const testAction = action('test', () => {}, { plugins: [actionPlugin] });
    dispatch(testAction, { store }, null);

    expect(actionPluginCalled).toBe(true);
  });

  it('should merge store plugins and action plugins', () => {
    let storePluginCalled = false;
    let actionPluginCalled = false;

    const storePlugin: Plugin = {
      name: 'store-plugin',
      onBefore: () => { storePluginCalled = true; }
    };
    const actionPlugin: Plugin = {
      name: 'action-plugin',
      onBefore: () => { actionPluginCalled = true; }
    };

    store.use(storePlugin);
    const testAction = action('test', () => {}, { plugins: [actionPlugin] });
    dispatch(testAction, { store }, null);

    expect(storePluginCalled).toBe(true);
    expect(actionPluginCalled).toBe(true);
  });
});
```

**Step 2: 运行测试验证失败**

Run: `cd packages/core && pnpm test:run -- __tests__/dispatch.test.ts`
Expected: FAIL (dispatch not exported)

**Step 3: 写入实现**

```typescript
// packages/core/src/dispatch.ts

import { type Action } from './action';
import { type Store } from './store';
import { type Plugin, type ActionContext } from './plugin';

/**
 * Dispatch options
 */
export interface DispatchOptions {
  /** Store instance to execute action on */
  store: Store;
}

/**
 * Dispatches an action to be executed
 * @param action - Action to execute
 * @param options - Dispatch options including store
 * @param payload - Payload to pass to action handler
 * @returns Result from action handler
 */
export const dispatch = <P, R>(
  action: Action<P, R>,
  options: DispatchOptions,
  payload: P
): R => {
  const { store } = options;
  const { type, handler, plugins: actionPlugins = [] } = action;

  // Merge store plugins and action-level plugins
  const storePlugins = store.getPlugins();
  const allPlugins: Plugin[] = [...storePlugins, ...actionPlugins];

  const context: ActionContext = { type, payload };

  // 1. Execute onBefore hooks
  for (const plugin of allPlugins) {
    plugin.onBefore?.(context);
  }

  let result: R;
  let error: Error | null = null;

  // 2. Execute action handler
  try {
    result = handler(store, payload);
  } catch (e) {
    error = e as Error;

    // 3. Execute onError hooks
    for (const plugin of allPlugins) {
      plugin.onError?.(context, error);
    }

    throw e;
  }

  // 4. Execute onAfter hooks (only if no error)
  for (const plugin of allPlugins) {
    plugin.onAfter?.(context, result);
  }

  return result;
};
```

**Step 4: 运行测试验证通过**

Run: `cd packages/core && pnpm test:run -- __tests__/dispatch.test.ts`
Expected: PASS

**Step 5: 提交**

```bash
cd packages/core && git add src/dispatch.ts __tests__/dispatch.test.ts
git commit -m "feat(core): add dispatch function with plugin hooks"
```

---

## Task 5: 更新 index.ts 导出

**Files:**
- 修改: `packages/core/src/index.ts`

**Step 1: 运行现有测试验证**

Run: `cd packages/core && pnpm test:run`
Expected: PASS

**Step 2: 更新导出**

```typescript
// packages/core/src/index.ts

/**
 * Main entry point for @relax-state/core package
 * Exports all public APIs for state management, selectors, events, and actions
 */

// Export plugin system
export { type Plugin, type ActionContext } from './plugin';
// Export action functionality
export { type Action, type ActionOptions, action } from './action';
// Export dispatch
export { dispatch, type DispatchOptions } from './dispatch';
// Export selector functionality
export { type Computed, computed } from './computed';
// Export event system
export { createEvent } from './event';
// Export core state management utilities
export {
  type State,
  state,
  type Value,
} from './state';
export { createStore, DefultStore, type Store, type StoreOptions } from './store';
```

**Step 3: 运行测试验证通过**

Run: `cd packages/core && pnpm test:run`
Expected: PASS

**Step 4: 提交**

```bash
cd packages/core && git add src/index.ts
git commit -m "feat(core): export action, dispatch, and plugin APIs"
```

---

## Task 6: 集成测试

**Files:**
- 新增: `packages/core/__tests__/integration.test.ts`

**Step 1: 写入集成测试**

```typescript
// packages/core/__tests__/integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { state, action, dispatch, createStore } from '../src/index';
import { type Plugin } from '../src/plugin';

describe('Action Integration', () => {
  it('should complete full workflow with plugins', () => {
    // 1. Create store with global plugin
    const log: string[] = [];
    const loggerPlugin: Plugin = {
      name: 'logger',
      onBefore: (ctx) => log.push(`[START] ${ctx.type}`),
      onAfter: (ctx, result) => log.push(`[END] ${ctx.type}`)
    };

    const store = createStore({ plugins: [loggerPlugin] });

    // 2. Create state
    const countState = state(0, 'count');

    // 3. Create actions
    const incrementAction = action(
      'increment',
      (s, payload: { delta: number }) => {
        const current = s.get(countState);
        s.set(countState, current + payload.delta);
      }
    );

    const getCountAction = action(
      'getCount',
      (s) => s.get(countState)
    );

    // 4. Dispatch actions
    dispatch(incrementAction, { store }, { delta: 10 });
    dispatch(incrementAction, { store }, { delta: 5 });

    const count = dispatch(getCountAction, { store }, null);

    // 5. Verify
    expect(count).toBe(15);
    expect(log).toEqual([
      '[START] increment',
      '[END] increment',
      '[START] increment',
      '[END] increment',
      '[START] getCount',
      '[END] getCount'
    ]);
  });

  it('should support action-level plugins', () => {
    const store = createStore();

    const actionLog: string[] = [];
    const trackedAction = action(
      'tracked',
      () => {},
      {
        plugins: [{
          name: 'tracker',
          onBefore: (ctx) => actionLog.push('tracked-start')
        }]
      }
    );

    dispatch(trackedAction, { store }, null);
    expect(actionLog).toEqual(['tracked-start']);
  });

  it('should handle errors and still call error hooks', () => {
    const errorLog: Error[] = [];
    const errorPlugin: Plugin = {
      name: 'error-logger',
      onError: (ctx, error) => errorLog.push(error)
    };

    const store = createStore({ plugins: [errorPlugin] });

    const failingAction = action('fail', () => {
      throw new Error('Expected error');
    });

    expect(() => dispatch(failingAction, { store }, null)).toThrow();
    expect(errorLog).toHaveLength(1);
    expect(errorLog[0].message).toBe('Expected error');
  });
});
```

**Step 2: 运行测试验证通过**

Run: `cd packages/core && pnpm test:run -- __tests__/integration.test.ts`
Expected: PASS

**Step 3: 提交**

```bash
cd packages/core && git add __tests__/integration.test.ts
git commit -m "test(core): add integration tests for action system"
```

---

## Task 7: 版本更新

**Files:**
- 修改: `packages/core/package.json`

**Step 1: 更新版本**

修改 version 从 `0.0.2` 到 `0.0.3`

**Step 2: 提交**

```bash
cd packages/core && git add package.json
git commit -m "chore: bump version to 0.0.3"
```

---

## 执行摘要

共 7 个 Task，每个 Task 包含 5 个步骤：写测试 → 验证失败 → 写实现 → 验证通过 → 提交

预计需要 35 个步骤完成全部实现。
