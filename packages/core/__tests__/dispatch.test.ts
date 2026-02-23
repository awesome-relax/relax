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
