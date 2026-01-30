import { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { initProcessWatcher } from '@processes/init';
import { placesProcessWatcher } from '@processes/places';

/**
 * Главная сага — точка входа.
 * @returns — итератор саги.
 */
export function* rootSaga(): SagaIterator {
  yield all([initProcessWatcher, placesProcessWatcher].map(fork));
}
