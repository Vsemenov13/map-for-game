import { SagaIterator } from 'redux-saga';
import { put, all, takeEvery } from 'redux-saga/effects';

import { actions as loadingActions } from '@common/features/loading';

import { actions as initProcessActions } from './actions';

/**
 * Процесс инициализации приложения
 * @returns {void}
 */
function* initProcess(): SagaIterator {
  yield put(
    loadingActions.setLoading({
      isLoading: true,
      isGlobal: true,
    }),
  );

  yield put(
    loadingActions.setLoading({
      isLoading: false,
      isGlobal: false,
    }),
  );
}

/**
 * Вотчер процесса инициализации приложения
 * @returns {void}
 */
export function* initProcessWatcher(): SagaIterator {
  yield all([takeEvery(initProcessActions.initApp, initProcess)]);
}
