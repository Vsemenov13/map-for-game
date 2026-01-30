import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { config } from '@common/config';

import type { LoaderPayload } from './types';

const loadingSelector = (state: RootState) => state[config.modules.loading];

const makeSomeLoadingSelector = () =>
  createSelector(
    loadingSelector,
    (_: RootState, loaders: LoaderPayload) => loaders,
    (state, loaders) => {
      if (Array.isArray(loaders)) {
        return loaders.some((name) => state[name]);
      }
      return !!state[loaders];
    },
  );

/** Хук: включён ли хотя бы один из указанных лоадеров. */
export const useLoading = (loaders: LoaderPayload): boolean => {
  const selector = useMemo(makeSomeLoadingSelector, []);
  return useSelector((state: RootState) => selector(state, loaders));
};

/** Селектор для глобального лоадера (используется в GlobalLoader). */
export const isGlobal = createSelector(
  loadingSelector,
  (state: Record<string, boolean> | undefined) => !!state?.Global,
);

export const selectors = {
  useLoading,
  isGlobal,
};
