import { describe, expect, it } from 'vitest';
import { atom, effect, get, update } from '../src/index';

describe('atom', () => {
  it('should create atom and read default value via get', () => {
    const count = atom<number>({ defaultValue: 1 });
    expect(get(count)).toBe(1);
  });

  it('should update value synchronously', async () => {
    const count = atom<number>({ defaultValue: 0 });
    await update(count, 2);
    expect(get(count)).toBe(2);
  });

  it('should update value using updater function', async () => {
    const count = atom<number>({ defaultValue: 1 });
    await update(count, (prev) => (prev ?? 0) + 5);
    expect(get(count)).toBe(6);
  });

  it('should support async update function', async () => {
    const value = atom<number, number>({
      defaultValue: 0,
      get: async (params, prev) => {
        await Promise.resolve();
        return (prev ?? 0) + params;
      },
    });
    await update(value, 3);
    expect(get(value)).toBe(3);
  });

  it('should trigger effect on update', async () => {
    const a = atom<number>({ defaultValue: 0 });
    let called = 0;
    const off = effect(a, () => {
      called += 1;
    });
    await update(a, 1);
    await update(a, 2);
    expect(called).toBeGreaterThanOrEqual(2);
    off?.();
  });
});
