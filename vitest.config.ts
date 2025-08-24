import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'packages/*/src/**/__tests__/**/*.{test,spec}.ts',
      'packages/*/src/**/__tests__/**/*.{test,spec}.tsx',
    ],
  },
});
