import { describe, expect, it } from 'vitest';
import { atom, get, selector, update } from '../src/index';

describe('selector', () => {
  it('should compute derived value and react to dependency changes', async () => {
    const a = atom<number>({ defaultValue: 1 });
    const b = atom<number>({ defaultValue: 2 });

    const sum = selector<number>({
      get: (getValue) => (getValue(a) ?? 0) + (getValue(b) ?? 0),
    });

    // selector initializes asynchronously in constructor via update()
    await Promise.resolve();
    expect(get(sum)).toBe(3);
    await update(a, 5);
    expect(get(sum)).toBe(7);
    await update(b, (prev) => (prev ?? 0) + 1);
    expect(get(sum)).toBe(8);
  });
});
