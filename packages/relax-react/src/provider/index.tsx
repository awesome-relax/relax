import { type Store, DefultStore } from '@relax-state/core';

import { createContext, useContext,type ReactNode } from 'react';
const Context = createContext<Store>(DefultStore);

export const RelaxProvider: React.FC<{ store: Store,children?:ReactNode }> = ({ store, children }) => {
    return <Context.Provider value={store}>{children}</Context.Provider>;
};

export const useRelaxStore = () => {
  return useContext(Context) ;
};
