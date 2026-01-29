import { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { initProcessWatcher } from '@processes/init';

/**
 * Главная сага - точка входа
 * @returns {void}
 */
export function* rootSaga(): SagaIterator {
  yield all([initProcessWatcher].map(fork));
}
