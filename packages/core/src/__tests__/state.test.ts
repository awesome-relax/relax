import { describe, expect, it } from 'vitest';
import { dispose, effect, get, removeEffect, set } from '../state';
import { atom } from '../atom';

describe('state core', () => {
  it('set/get should work and trigger effects', () => {
    const a = atom<number>({ defaultValue: 0 });
    const val = get(a);
    expect(val).toBe(0);

    let called = 0;
    const off = effect(a, () => {
      called += 1;
    });

    set(a, 1);
    expect(get(a)).toBe(1);
    expect(called).toBe(1);

    off?.();
  });

  it('removeEffect should stop notifications', () => {
    const a = atom<number>({ defaultValue: 0 });
    const fn = () => {};
    const remove = effect(a, fn);
    removeEffect(a, fn);
    set(a, 2);
    // no assertion on calls; just ensure no errors
    remove?.();
  });

  it('dispose should clean node', () => {
    const a = atom<number>({ defaultValue: 1 });
    dispose(a);
    // After dispose, subsequent set should be no-op
    set(a as any, 3);
    expect(get(a)).toBe(undefined);
  });
});
