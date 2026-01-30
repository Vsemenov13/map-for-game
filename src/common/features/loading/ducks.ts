import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { config } from '@common/config';

import { initialState } from './constants';
import type { Loader, LoadingState } from './types';

const loadingSlice = createSlice({
  name: config.modules.loading,
  initialState: initialState as LoadingState,
  reducers: {
    /**
     * Переключение флага лоадера (при вызове в начале и в конце загрузки даёт true → false).
     * @param state — текущее состояние.
     * @returns — void.
     */
    switchLoading: (
      state: LoadingState,
      { payload }: PayloadAction<Loader>,
    ): void => {
      state[payload] = !state[payload];
    },
  },
});

export const loadingReducer = loadingSlice.reducer;
export const actions = {
  ...loadingSlice.actions,
};
