import { createStore } from '@relax-state/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { action, addPlugin, clearPlugins, state } from '../src/index';
import type { Plugin } from '../src/plugin';

describe('Action Integration', () => {
  beforeEach(() => {
    clearPlugins();
  });

  it('should complete full workflow with plugins', () => {
    // 1. Add global plugin
    const log: string[] = [];
    const loggerPlugin: Plugin = {
      name: 'logger',
      onBefore: (ctx) => log.push(`[START] ${ctx.name}`),
      onAfter: (ctx) => log.push(`[END] ${ctx.name}`),
    };

    addPlugin(loggerPlugin);

    const store = createStore();

    // 2. Create state
    const countState = state(0, 'count');

    // 3. Create actions
    const incrementAction = action(
      (s, payload: { delta: number }) => {
        const current = s.get(countState);
        s.set(countState, current + payload.delta);
      },
      { name: 'increment' }
    );

    const getCountAction = action((s) => s.get(countState), { name: 'getCount' });

    // 4. Call actions directly (no dispatch needed)
    incrementAction(store, { delta: 10 });
    incrementAction(store, { delta: 5 });

    const count = getCountAction(store, null);

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

  it('should support action-level plugins', () => {
    const store = createStore();

    const actionLog: string[] = [];
    const trackedAction = action(() => {}, {
      name: 'tracked',
      plugins: [
        {
          name: 'tracker',
          onBefore: () => actionLog.push('tracked-start'),
        },
      ],
    });

    trackedAction(store, null);
    expect(actionLog).toEqual(['tracked-start']);
  });

  it('should handle errors and still call error hooks', () => {
    const errorLog: Error[] = [];
    const errorPlugin: Plugin = {
      name: 'error-logger',
      onError: (ctx, error) => errorLog.push(error),
    };

    addPlugin(errorPlugin);

    const store = createStore();

    const failingAction = action(
      () => {
        throw new Error('Expected error');
      },
      { name: 'fail' }
    );

    expect(() => failingAction(store, null)).toThrow();
    expect(errorLog).toHaveLength(1);
    expect(errorLog[0].message).toBe('Expected error');
  });
});
