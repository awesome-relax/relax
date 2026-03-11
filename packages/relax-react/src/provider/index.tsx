/**
 * Relax React Provider
 * Provides Relax store context to React components
 */

import { createStore, getRuntimeStore, type Store } from '@relax-state/store';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { isSSR } from './../ssr';

/** Context for storing the Relax store instance */
const Context = createContext<Store>(getRuntimeStore());

/**
 * Provider component that wraps React application and provides Relax store
 * @param props.children - Child components
 */
export const RelaxProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const _store = useMemo(() => (isSSR ? createStore() : getRuntimeStore()), []);
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
