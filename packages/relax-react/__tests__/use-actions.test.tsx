import { action, createStore } from '@relax-state/core';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useActions } from '../src/hooks';

describe('useActions', () => {
  it('should preserve action types in tuple', () => {
    const _store = createStore();

    const addAction = action(
      (_s, payload: { text: string }) => {
        return { id: '1', ...payload, completed: false };
      },
      { name: 'add' }
    );

    const toggleAction = action(
      (_s, _payload: { id: string }) => {
        // no return
      },
      { name: 'toggle' }
    );

    const { result } = renderHook(() => useActions([addAction, toggleAction]));

    // Should have proper types - this is compile-time check
    const [add, toggle] = result.current;

    // Runtime verification
    expect(typeof add).toBe('function');
    expect(typeof toggle).toBe('function');
  });

  it('should preserve return types for each action', () => {
    const _store = createStore();

    const addAction = action(
      (_s, payload: { value: number }) => {
        return payload.value * 2;
      },
      { name: 'double' }
    );

    const { result } = renderHook(() => useActions([addAction]));

    const [double] = result.current;

    // Verify return type at runtime
    const resultValue = double({ value: 5 });
    expect(resultValue).toBe(10);
  });

  it('should support async actions', async () => {
    const _store = createStore();

    const asyncAction = action(
      async (_s, payload: { id: string }) => {
        return { id: payload.id, name: 'test' };
      },
      { name: 'fetch' }
    );

    const { result } = renderHook(() => useActions([asyncAction]));

    const [fetch] = result.current;

    const data = await fetch({ id: '123' });
    expect(data).toEqual({ id: '123', name: 'test' });
  });

  it('should preserve action name in metadata', () => {
    const _store = createStore();

    const testAction = action((_s, _payload: { x: number }) => {}, { name: 'myAction' });

    renderHook(() => useActions([testAction]));

    expect(testAction.name).toBe('myAction');
  });
});
