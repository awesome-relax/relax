import { describe, expect, it } from 'vitest';
import { state, computed, createStore } from '../src/index';

describe('store', () => {
  it('should create a store instance', () => {
    const store = createStore();
    expect(store).toBeDefined();
    expect(typeof store.get).toBe('function');
    expect(typeof store.set).toBe('function');
    expect(typeof store.effect).toBe('function');
  });

  it('should get and set values', () => {
    const store = createStore();
    const count = state<number>(0);

    expect(store.get(count)).toBe(0);
    store.set(count, 5);
    expect(store.get(count)).toBe(5);
  });

  it('should handle computed values', () => {
    const store = createStore();
    const a = state<number>(1);
    const b = state<number>(2);

    const sum = computed<number>({
      get: (getValue) => (getValue(a) ?? 0) + (getValue(b) ?? 0),
    });

    expect(store.get(sum)).toBe(3);
    store.set(a, 5);
    expect(store.get(sum)).toBe(7);
  });

  it('should handle effects', () => {
    const store = createStore();
    const count = state<number>(0);
    let effectValue = 0;

    const dispose = store.effect(count, ({ newValue }) => {
      effectValue = newValue;
    });

    store.set(count, 10);
    expect(effectValue).toBe(10);

    dispose();
    store.set(count, 20);
    expect(effectValue).toBe(10); // Should not change after disposal
  });
});