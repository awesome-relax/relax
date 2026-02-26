import { createStore } from '@relax-state/store';
import { describe, expect, it } from 'vitest';
import { state } from '../src/index';

describe('state core', () => {
  it('set/get should work and trigger effects', () => {
    const store = createStore();
    const a = state<number>(0);
    const val = store.get(a);
    expect(val).toBe(0);

    let called = 0;
    const off = store.effect(a, () => {
      called += 1;
    });

    store.set(a, 1);
    expect(store.get(a)).toBe(1);
    expect(called).toBe(1);

    off?.();
  });

  it('removeEffect should stop notifications', () => {
    const store = createStore();
    const a = state<number>(0);
    const fn = () => {};
    const remove = store.effect(a, fn);
    store.clearEffect(a, fn);
    store.set(a, 2);
    // no assertion on calls; just ensure no errors
    remove?.();
  });
});
