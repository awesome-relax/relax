import { describe, expect, it } from 'vitest';
import type { Plugin } from '../src/plugin';

describe('Plugin', () => {
  it('should have correct interface', () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      onBefore: (ctx) => {
        console.log('before', ctx.type);
      },
      onAfter: (ctx, result) => {
        console.log('after', result);
      },
      onError: (ctx, error) => {
        console.log('error', error);
      },
    };

    expect(plugin.name).toBe('test-plugin');
    expect(typeof plugin.onBefore).toBe('function');
    expect(typeof plugin.onAfter).toBe('function');
    expect(typeof plugin.onError).toBe('function');
  });

  it('should allow optional hooks', () => {
    const minimalPlugin: Plugin = {
      name: 'minimal',
    };

    expect(minimalPlugin.name).toBe('minimal');
    expect(minimalPlugin.onBefore).toBeUndefined();
    expect(minimalPlugin.onAfter).toBeUndefined();
    expect(minimalPlugin.onError).toBeUndefined();
  });
});
