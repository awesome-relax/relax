import { useEffect, useState } from 'react';
import { type RelaxState, type RelaxValue, effect, get, update } from '@relax/core';

export const useRelaxState = <T, R>(relaxState: RelaxState<T, R>) => {
  const [state, setState] = useState<RelaxState<T, R>>(() => get(relaxState) as RelaxState<T, R>);
  useEffect(() => {
    return effect(relaxState, () => {
      setState(get(relaxState) as RelaxState<T, R>);
    });
  }, [relaxState]);
  return [state, (value: R) => update(relaxState, value)] as const;
};

export const useRelaxValue = <T>(state: RelaxValue<T>) => {
  const [value, setValue] = useState<T>(() => get(state) as T);
  useEffect(() => {
    return effect(state, () => {
      setValue(get(state) as T);
    });
  }, [state]);
  return value;
};
