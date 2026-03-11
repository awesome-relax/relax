import { addPlugin, type Plugin } from '@relax-state/core';

/**
 * Check if the code is running in a server-side environment
 * @returns true if running in a server-side environment, false otherwise
 */
export const isSSR = typeof window === 'undefined';

const ssrGuardPlugin: Plugin = {
  name: 'ssrGuard',
  onBefore: (context) => {
    if (isSSR && !context.store) {
      throw new Error(
        'you are using action outside of the provider in a ssr environment, it will cause hydration error'
      );
    }
  },
};
export const ssrGuard = () => {
  if (isSSR) {
    addPlugin(ssrGuardPlugin);
  }
};
