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
