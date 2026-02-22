import { createStore, state } from '@relax-state/core';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useRelaxState } from '../src/hooks';

describe('useRelaxState', () => {
  it('should read and update value via setter', () => {
    const store = createStore();
    const count = state<number>(0);

    const { result } = renderHook(() => useRelaxState(count));

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
  });

  it('should handle multiple state atoms', () => {
    const store = createStore();
    const count1 = state<number>(0);
    const count2 = state<number>(10);

    const { result: result1 } = renderHook(() => useRelaxState(count1));
    const { result: result2 } = renderHook(() => useRelaxState(count2));

    expect(result1.current[0]).toBe(0);
    expect(result2.current[0]).toBe(10);
  });
});
