import { atom, update } from '@relax/core';
import { act, renderHook } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { useRelaxValue } from '../src/hooks';

describe('useRelaxValue', () => {
  it('should read and update value reactively', async () => {
    const count = atom<number>({ defaultValue: 0 });
    const { result } = renderHook(() => useRelaxValue(count));
    expect(result.current).toBe(0);

    await act(async () => {
      await update(count, 1);
    });
    expect(result.current).toBe(1);
  });
});
