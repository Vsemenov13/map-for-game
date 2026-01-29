import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { isNil, not, pathOr } from 'ramda';

import { config } from '@common/config';

import { ErrorsState } from './types';

const errorsSelector = (state: RootState): ErrorsState =>
  state[config.modules.errors];

/** Есть ли глобальная ошибка */
const isErrorExist = createSelector(errorsSelector, (errors): boolean =>
  not(isNil(errors)),
);

/** Получить заголовок ошибки */
const errorTitle = createSelector(errorsSelector, (error): string =>
  pathOr('', ['title'], error),
);

/** Получить текст ошибки */
const errorMessage = createSelector(errorsSelector, (error): string =>
  pathOr('', ['message'], error),
);

/** Получить код ошибки */
const errorCode = createSelector(errorsSelector, (error): string =>
  pathOr('', ['code'], error),
);

export const selectors = {
  isErrorExist,
  errorTitle,
  errorMessage,
  errorCode,
};
