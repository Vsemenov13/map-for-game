import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { actions as errorActions } from '@common/features/errors';
import { actions as loadingActions, Loader } from '@common/features/loading';

import {
  placesActions,
  getPlaceImagesSaga,
  getPlacesConfigSaga,
} from '@features/places';

/**
 * Процесс загрузки конфига мест с Яндекс.Диска.
 * @returns — итератор саги.
 */
function* getPlacesConfigProcess(): SagaIterator {
  try {
    yield put(loadingActions.switchLoading(Loader.GetPlacesConfig));
    yield call(getPlacesConfigSaga);
  } catch (error) {
    yield put(
      errorActions.setError({
        title: 'Ошибка загрузки конфига мест',
        message:
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить конфиг мест.',
      }),
    );
  } finally {
    yield put(loadingActions.switchLoading(Loader.GetPlacesConfig));
  }
}

/**
 * Процесс загрузки изображений места: переключает лоадер и вызывает сагу фичи.
 * @param action — экшен getPlaceImages с placeId в payload.
 * @returns — итератор саги.
 */
function* getPlaceImagesProcess(
  action: ReturnType<typeof placesActions.getPlaceImages>,
): SagaIterator {
  try {
    yield put(loadingActions.switchLoading(Loader.GetPlaceImages));
    yield call(getPlaceImagesSaga, action);
  } catch (error) {
    yield put(
      errorActions.setError({
        title: 'Ошибка загрузки изображений',
        message:
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить изображения.',
      }),
    );
  } finally {
    yield put(loadingActions.switchLoading(Loader.GetPlaceImages));
  }
}

/**
 * Вотчер процессов фичи places.
 * @returns — итератор саги.
 */
export function* placesProcessWatcher(): SagaIterator {
  yield takeEvery(placesActions.getPlacesConfig, getPlacesConfigProcess);
  yield takeEvery(placesActions.getPlaceImages, getPlaceImagesProcess);
}
