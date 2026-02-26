import { createStore, type Store } from '@relax-state/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { action } from '../src/action';
import { addPlugin, clearPlugins, type Plugin } from '../src/plugin';
import { state } from '../src/state';

describe('Action', () => {
  let store: Store;
  let countState: ReturnType<typeof state<number>>;

  beforeEach(() => {
    clearPlugins();
    store = createStore();
    countState = state(0, 'count');
  });

  it('should create callable action', () => {
    const testAction = action(
      (s, payload: { delta: number }) => {
        const current = s.get(countState);
        s.set(countState, current + payload.delta);
      },
      { name: 'test' }
    );

    expect(typeof testAction).toBe('function');
    expect(testAction.name).toBe('test');
  });

  it('should create action with options', () => {
    const testAction = action((_store, _payload) => {}, { name: 'Decrement Action' });

    expect(testAction.name).toBe('Decrement Action');
  });

  it('should support generic payload types', () => {
    const stringAction = action<string, void>((_store, _name) => {});
    expect(typeof stringAction).toBe('function');

    const objectAction = action<{ x: number; y: number }, number>((_store, coord) => {
      return coord.x + coord.y;
    });
    expect(typeof objectAction).toBe('function');
  });

  it('should execute action handler with payload', () => {
    const incrementAction = action((s, payload: { delta: number }) => {
      const current = s.get(countState);
      s.set(countState, current + payload.delta);
    });

    incrementAction(store, { delta: 5 });

    expect(store.get(countState)).toBe(5);
  });

  it('should return result from action handler', () => {
    const addAction = action((_s, payload: { a: number; b: number }) => {
      return payload.a + payload.b;
    });

    const result = addAction(store, { a: 3, b: 7 });

    expect(result).toBe(10);
  });

  it('should call onBefore plugin hook', () => {
    let beforeCalled = false;
    const plugin: Plugin = {
      name: 'test',
      onBefore: (ctx) => {
        beforeCalled = true;
        expect(ctx.name).toBeUndefined();
      },
    };

    addPlugin(plugin);

    const testAction = action((_s) => {});
    testAction(store, null);

    expect(beforeCalled).toBe(true);
  });

  it('should call onBefore with action name', () => {
    let capturedName = '';
    const plugin: Plugin = {
      name: 'test',
      onBefore: (ctx) => {
        capturedName = ctx.name || '';
      },
    };

    addPlugin(plugin);

    const testAction = action((_s) => {}, { name: 'my-action' });
    testAction(store, null);

    expect(capturedName).toBe('my-action');
  });

  it('should call onAfter plugin hook on success', () => {
    let afterCalled = false;
    let resultValue: unknown;
    const plugin: Plugin = {
      name: 'test',
      onAfter: (_ctx, result) => {
        afterCalled = true;
        resultValue = result;
      },
    };

    addPlugin(plugin);

    const testAction = action(() => 42);
    testAction(store, null);

    expect(afterCalled).toBe(true);
    expect(resultValue).toBe(42);
  });

  it('should call onError plugin hook on exception', () => {
    let errorCalled = false;
    let capturedError: Error | null = null;
    const plugin: Plugin = {
      name: 'test',
      onError: (_ctx, error) => {
        errorCalled = true;
        capturedError = error;
      },
    };

    addPlugin(plugin);

    const testAction = action(() => {
      throw new Error('Test error');
    });

    expect(() => testAction(store, null)).toThrow('Test error');
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
    testAction(store, null);

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
    testAction(store, null);

    expect(globalPluginCalled).toBe(true);
    expect(actionPluginCalled).toBe(true);
  });
});
