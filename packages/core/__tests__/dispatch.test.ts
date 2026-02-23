import { beforeEach, describe, expect, it } from 'vitest';
import { action } from '../src/action';
import { type DispatchOptions, dispatch } from '../src/dispatch';
import type { Plugin } from '../src/plugin';
import { addPlugin, clearPlugins } from '../src/plugin';
import { state } from '../src/state';
import { createStore, type Store } from '../src/store';

describe('Dispatch', () => {
  let store: Store;
  let countState: ReturnType<typeof state<number>>;

  beforeEach(() => {
    clearPlugins();
    store = createStore();
    countState = state(0, 'count');
  });

  it('should execute action handler with payload', () => {
    const incrementAction = action((s, payload: { delta: number }) => {
      const current = s.get(countState);
      s.set(countState, current + payload.delta);
    });

    const options: DispatchOptions = { store };
    dispatch(incrementAction, options, { delta: 5 });

    expect(store.get(countState)).toBe(5);
  });

  it('should return result from action handler', () => {
    const addAction = action((s, payload: { a: number; b: number }) => {
      return payload.a + payload.b;
    });

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
        expect(ctx.type.name).toBeUndefined();
      },
    };

    addPlugin(plugin);

    const testAction = action((s) => {});
    dispatch(testAction, { store }, null);

    expect(beforeCalled).toBe(true);
  });

  it('should call onBefore with action name', () => {
    let capturedType = '';
    const plugin: Plugin = {
      name: 'test',
      onBefore: (ctx) => {
        capturedType = ctx.type.name;
      },
    };

    addPlugin(plugin);

    const testAction = action((s) => {}, { name: 'my-action' });
    dispatch(testAction, { store }, null);

    expect(capturedType).toBe('my-action');
  });

  it('should call onAfter plugin hook on success', () => {
    let afterCalled = false;
    let resultValue: unknown;
    const plugin: Plugin = {
      name: 'test',
      onAfter: (ctx, result) => {
        afterCalled = true;
        resultValue = result;
      },
    };

    addPlugin(plugin);

    const testAction = action(() => 42);
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
      },
    };

    addPlugin(plugin);

    const testAction = action(() => {
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
      onBefore: () => {
        actionPluginCalled = true;
      },
    };

    const testAction = action(() => {}, { plugins: [actionPlugin] });
    dispatch(testAction, { store }, null);

    expect(actionPluginCalled).toBe(true);
  });

  it('should merge global plugins and action plugins', () => {
    let globalPluginCalled = false;
    let actionPluginCalled = false;

    const globalPlugin: Plugin = {
      name: 'global-plugin',
      onBefore: () => {
        globalPluginCalled = true;
      },
    };
    const actionPlugin: Plugin = {
      name: 'action-plugin',
      onBefore: () => {
        actionPluginCalled = true;
      },
    };

    addPlugin(globalPlugin);
    const testAction = action(() => {}, { plugins: [actionPlugin] });
    dispatch(testAction, { store }, null);

    expect(globalPluginCalled).toBe(true);
    expect(actionPluginCalled).toBe(true);
  });
});
