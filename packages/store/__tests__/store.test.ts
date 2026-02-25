import { createStore } from '../src';
import { state } from '@relax-state/core';

describe('store', () => {
  it('verifies store get/set roundtrip', () => {
    const store = createStore();
    const count = state(0);
    expect(store.get(count)).toBe(0);
    store.set(count, 5);
    expect(store.get(count)).toBe(5);
  });
});
