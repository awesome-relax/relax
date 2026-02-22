import { state } from '@relax-state/core';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useRelaxValue } from '../src/hooks';

describe('useRelaxValue', () => {
  it('should read and update value reactively', async () => {
    const count = state<number>(0);
    const { result } = renderHook(() => useRelaxValue(count));
    expect(result.current).toBe(0);
  });
});