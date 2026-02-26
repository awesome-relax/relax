/**
 * Relax React Provider
 * Provides Relax store context to React components
 */

import { createStore, DefultStore, type Store } from '@relax-state/store';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

/** Context for storing the Relax store instance */
const Context = createContext<Store>(DefultStore);

/**
 * Provider component that wraps React application and provides Relax store
 * @param props.children - Child components
 */
export const RelaxProvider: React.FC<{ store?: Store; children?: ReactNode }> = ({
  store,
  children,
}) => {
  const _store = useMemo(() => store ?? createStore(), [store]);
  return <Context.Provider value={_store}>{children}</Context.Provider>;
};

/**
 * Hook to access the Relax store from context
 * @returns The Relax store instance
 * @throws Error if used outside of RelaxProvider
 */
export const useRelaxStore = () => {
  return useContext(Context);
};
