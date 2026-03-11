import { createStore } from '@relax-state/store';
import { describe, expect, it } from 'vitest';
import { computed, state } from '../src/index';

describe('computed', () => {
  it('should compute derived value and react to dependency changes', async () => {
    const store = createStore();
    const a = state<number>(1);
    const b = state<number>(2);

    const sum = computed<number>({
      get: (getValue) => (getValue(a) ?? 0) + (getValue(b) ?? 0),
    });

    await Promise.resolve();
    expect(store.get(sum)).toBe(3);
  });
});
