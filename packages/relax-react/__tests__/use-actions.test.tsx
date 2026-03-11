import { action } from '@relax-state/core';
import { createStore } from '@relax-state/store';
import { renderHook } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { useActions } from '../src/hooks';

describe('useActions', () => {
  it('should preserve action types in tuple', () => {
    const _store = createStore();

    const addAction = action<{ text: string }, { id: string; text: string }>(
      (_s, payload = { text: '' }) => {
        return { id: '1', ...payload, completed: false };
      },
      { name: 'add' }
    );

    const toggleAction = action<{ id: string }, void>(
      (_s, _payload) => {
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

    expectTypeOf(add).parameters.toEqualTypeOf<[payload: { text: string }]>();
    expectTypeOf(toggle).parameters.toEqualTypeOf<[payload: { id: string }]>();
  });

  it('should keep parameter types when using readonly action tuples', () => {
    const _store = createStore();

    const noPayloadAction = action((_s) => 'ok', { name: 'noop' });
    const optionalPayloadAction = action((_s, payload?: { id: string }) => payload?.id ?? 'none', {
      name: 'maybe',
    });
    const requiredPayloadAction = action<{ count: number }, number>(
      (_s, payload) => (payload?.count ?? 0) + 1,
      { name: 'required' }
    );

    const actions = [noPayloadAction, optionalPayloadAction, requiredPayloadAction] as const;
    const { result } = renderHook(() => useActions(actions));
    const [noop, maybe, required] = result.current;

    expectTypeOf(noop).parameters.toEqualTypeOf<[]>();
    expectTypeOf(maybe).parameters.toEqualTypeOf<[payload?: { id: string } | undefined]>();
    expectTypeOf(required).parameters.toEqualTypeOf<[payload: { count: number }]>();

    expect(noop()).toBe('ok');
    expect(maybe()).toBe('none');
    expect(maybe({ id: 'a' })).toBe('a');
    expect(required({ count: 1 })).toBe(2);
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
