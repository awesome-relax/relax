import { createStore, setRuntimeStore, resetRuntimeStore } from '@relax-state/store';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { action, addPlugin, clearPlugins, state } from '../src/index';
import type { Plugin } from '../src/plugin';

describe('Action Integration', () => {
  beforeEach(() => {
    clearPlugins();
  });

  afterEach(() => {
    resetRuntimeStore();
  });

  it('should complete full workflow with plugins', () => {
    // 1. Add global plugin
    const log: string[] = [];
    const loggerPlugin: Plugin = {
      name: 'logger',
      onBefore: (ctx) => log.push(`[START] ${ctx.name}`),
      onAfter: (_ctx) => log.push(`[END] ${_ctx.name}`),
    };

    addPlugin(loggerPlugin);

    const store = createStore();
    setRuntimeStore(store);

    // 2. Create state
    const countState = state(0, 'count');

    // 3. Create actions
    const incrementAction = action(
      (payload: { delta: number }, s) => {
        const current = s.get(countState);
        s.set(countState, current + payload.delta);
      },
      { name: 'increment' }
    );

    const getCountAction = action((_p: null, s) => s.get(countState), { name: 'getCount' });

    // 4. Call actions directly (no dispatch needed)
    incrementAction({ delta: 10 });
    incrementAction({ delta: 5 });

    const count = getCountAction(null);

    // 5. Verify
    expect(count).toBe(15);
    expect(log).toEqual([
      '[START] increment',
      '[END] increment',
      '[START] increment',
      '[END] increment',
      '[START] getCount',
      '[END] getCount',
    ]);
  });

  it('should handle errors and still call error hooks', () => {
    const errorLog: Error[] = [];
    const errorPlugin: Plugin = {
      name: 'error-logger',
      onError: (_ctx, error) => errorLog.push(error),
    };

    addPlugin(errorPlugin);

    const store = createStore();
    setRuntimeStore(store);

    const failingAction = action(
      () => {
        throw new Error('Expected error');
      },
      { name: 'fail' }
    );

    expect(() => failingAction(null)).toThrow();
    expect(errorLog).toHaveLength(1);
    expect(errorLog[0].message).toBe('Expected error');
  });
});
