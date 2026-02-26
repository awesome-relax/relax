import { createStore, setRuntimeStore, resetRuntimeStore, type Store } from '@relax-state/store';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { action } from '../src/action';
import { addPlugin, clearPlugins, type Plugin } from '../src/plugin';
import { state } from '../src/state';

describe('Action', () => {
  let store: Store;
  let countState: ReturnType<typeof state<number>>;

  beforeEach(() => {
    clearPlugins();
    store = createStore();
    setRuntimeStore(store);
    countState = state(0, 'count');
  });

  afterEach(() => {
    resetRuntimeStore();
  });

  it('should create callable action', () => {
    const testAction = action(
      (payload: { delta: number }, s) => {
        const current = s.get(countState);
        s.set(countState, current + payload.delta);
      },
      { name: 'test' }
    );

    expect(typeof testAction).toBe('function');
    expect(testAction.name).toBe('test');
  });

  it('should create action with options', () => {
    const testAction = action((_payload, _store) => {}, { name: 'Decrement Action' });

    expect(testAction.name).toBe('Decrement Action');
  });

  it('should support generic payload types', () => {
    const stringAction = action<string, void>((_name, _store) => {});
    expect(typeof stringAction).toBe('function');

    const objectAction = action<{ x: number; y: number }, number>((coord, _store) => {
      return coord.x + coord.y;
    });
    expect(typeof objectAction).toBe('function');
  });

  it('should execute action handler with payload', () => {
    const incrementAction = action((payload: { delta: number }, s) => {
      const current = s.get(countState);
      s.set(countState, current + payload.delta);
    });
    const getCountAction = action((_p: null, s) => s.get(countState));

    incrementAction({ delta: 5 });

    expect(getCountAction(null)).toBe(5);
  });

  it('should return result from action handler', () => {
    const addAction = action((payload: { a: number; b: number }, _s) => {
      return payload.a + payload.b;
    });

    const result = addAction({ a: 3, b: 7 });

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

    const testAction = action((_payload, _s) => {});
    testAction(null);

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

    const testAction = action((_payload, _s) => {}, { name: 'my-action' });
    testAction(null);

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

    const testAction = action((_payload) => 42);
    testAction(null);

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

    expect(() => testAction(null)).toThrow('Test error');
    expect(errorCalled).toBe(true);
    expect(capturedError?.message).toBe('Test error');
  });
});
