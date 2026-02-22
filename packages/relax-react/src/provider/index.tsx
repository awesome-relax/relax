/**
 * Relax React Provider
 * Provides Relax store context to React components
 */

import { DefultStore, type Store } from '@relax-state/core';
import { createContext, type ReactNode, useContext } from 'react';

/** Context for storing the Relax store instance */
const Context = createContext<Store>(DefultStore);

/**
 * Provider component that wraps React application and provides Relax store
 * @param props.store - The Relax store instance to use (defaults to DefultStore)
 * @param props.children - Child components
 */
export const RelaxProvider: React.FC<{ store: Store; children?: ReactNode }> = ({
  store,
  children,
}) => {
  return <Context.Provider value={store}>{children}</Context.Provider>;
};

/**
 * Hook to access the Relax store from context
 * @returns The Relax store instance
 * @throws Error if used outside of RelaxProvider
 */
export const useRelaxStore = () => {
  return useContext(Context);
};
