import { describe, expect, it } from 'vitest';
import { state, computed, DefultStore } from '../src/index';

describe('computed', () => {
  it('should compute derived value and react to dependency changes', async () => {
    const a = state<number>(1);
    const b = state<number>(2);

    const sum = computed<number>({
      get: (getValue) => (getValue(a) ?? 0) + (getValue(b) ?? 0),
    });

    await Promise.resolve();
    expect(DefultStore.get(sum)).toBe(3);
  });
});
