import { SagaIterator } from 'redux-saga';
import { put, all, takeEvery } from 'redux-saga/effects';

import { actions as loadingActions, Loader } from '@common/features/loading';

import { placesActions } from '@features/places';

import { actions as initProcessActions } from './actions';

/**
 * Процесс инициализации приложения.
 * @returns — итератор саги.
 */
function* initProcess(): SagaIterator {
  yield put(loadingActions.switchLoading(Loader.Global));
  yield put(placesActions.getPlacesConfig());
  yield put(loadingActions.switchLoading(Loader.Global));
}

/**
 * Вотчер процесса инициализации приложения
 * @returns {void}
 */
export function* initProcessWatcher(): SagaIterator {
  yield all([takeEvery(initProcessActions.initApp, initProcess)]);
}
