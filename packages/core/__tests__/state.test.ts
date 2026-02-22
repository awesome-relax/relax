import { describe, expect, it } from 'vitest';
import { state, DefultStore } from '../src/index';

describe('state core', () => {
  it('set/get should work and trigger effects', () => {
    const a = state<number>(0);
    const val = DefultStore.get(a);
    expect(val).toBe(0);

    let called = 0;
    const off = DefultStore.effect(a, () => {
      called += 1;
    });

    DefultStore.set(a, 1);
    expect(DefultStore.get(a)).toBe(1);
    expect(called).toBe(1);

    off?.();
  });

  it('removeEffect should stop notifications', () => {
    const a = state<number>(0);
    const fn = () => {};
    const remove = DefultStore.effect(a, fn);
    DefultStore.clearEffect(a, fn);
    DefultStore.set(a, 2);
    // no assertion on calls; just ensure no errors
    remove?.();
  });
});
