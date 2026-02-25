import { beforeEach, describe, expect, it } from 'vitest';
import {
  addPlugin,
  clearPlugins,
  computed,
  getPlugins,
  removePlugin,
  state,
} from '../src/index';
import { createStore } from '@relax-state/store';
import type { Plugin } from '../src/plugin';

describe('store', () => {
  it('should create a store instance', () => {
    const store = createStore();
    expect(store).toBeDefined();
    expect(typeof store.get).toBe('function');
    expect(typeof store.set).toBe('function');
    expect(typeof store.effect).toBe('function');
  });

  it('should get and set state values', () => {
    const store = createStore();
    const count = state(0);

    expect(store.get(count)).toBe(0);
    store.set(count, 5);
    expect(store.get(count)).toBe(5);
  });

  it('should compute derived values', () => {
    const store = createStore();
    const count = state(0);
    const doubled = computed({
      get: (get) => get(count) * 2,
    });

    expect(store.get(doubled)).toBe(0);
    store.set(count, 5);
    expect(store.get(doubled)).toBe(10);
  });

  it('should trigger effects on state change', () => {
    const store = createStore();
    const count = state(0);
    let effectCount = 0;

    store.effect(count, () => {
      effectCount++;
    });

    expect(store.get(count)).toBe(0);
    store.set(count, 1);
    expect(effectCount).toBe(1);
    store.set(count, 2);
    expect(effectCount).toBe(2);
  });

  it('should not update when setting same value', () => {
    const store = createStore();
    const count = state<number>(0);
    let effectCount = 0;

    store.effect(count, () => {
      effectCount++;
    });

    expect(store.get(count)).toBe(0);
    store.set(count, 0);
    expect(effectCount).toBe(0); // Should not trigger effect
  });
});

describe('Global Plugins', () => {
  beforeEach(() => {
    clearPlugins();
  });

  it('should add global plugins', () => {
    const testPlugin: Plugin = { name: 'test' };
    addPlugin(testPlugin);

    expect(getPlugins()).toHaveLength(1);
    expect(getPlugins()[0].name).toBe('test');
  });

  it('should add multiple plugins', () => {
    const plugin1: Plugin = { name: 'plugin1' };
    const plugin2: Plugin = { name: 'plugin2' };

    addPlugin(plugin1);
    addPlugin(plugin2);

    expect(getPlugins()).toHaveLength(2);
  });

  it('should remove plugins by name', () => {
    const plugin1: Plugin = { name: 'plugin1' };
    const plugin2: Plugin = { name: 'plugin2' };

    addPlugin(plugin1);
    addPlugin(plugin2);
    expect(getPlugins()).toHaveLength(2);

    removePlugin('plugin1');
    expect(getPlugins()).toHaveLength(1);
    expect(getPlugins()[0].name).toBe('plugin2');
  });

  it('should return false when removing non-existent plugin', () => {
    const result = removePlugin('non-existent');
    expect(result).toBe(false);
  });

  it('should return empty array when no plugins', () => {
    expect(getPlugins()).toEqual([]);
  });

  it('should clear all plugins', () => {
    addPlugin({ name: 'p1' });
    addPlugin({ name: 'p2' });
    expect(getPlugins()).toHaveLength(2);

    clearPlugins();
    expect(getPlugins()).toEqual([]);
  });
});
