import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { config } from '@common/config';

import { ErrorsState } from './types';

const initialState: ErrorsState = null;

/**
 * Обработчик установки ошибки
 * @param state - Текущее состояние глобальных ошибок
 * @param payload - Объект описывающий ошибку
 * @returns Новый стейт модуля errors
 */
const toSetError = (
  state: ErrorsState,
  {
    payload: { title, message, code = '' },
  }: PayloadAction<NonNullable<ErrorsState>>,
): ErrorsState => ({
  title,
  message,
  code,
});

/**
 * Сброс состояния до начального
 * @returns Значение по умолчанию для модуля errors
 */
const toClearError = (): ErrorsState => initialState;

const errorsSlice = createSlice({
  name: config.modules.errors,
  initialState,
  reducers: {
    setError: toSetError,
    clearError: toClearError,
  },
});

export const errorsReducer = errorsSlice.reducer;

export const actions = {
  ...errorsSlice.actions,
};
