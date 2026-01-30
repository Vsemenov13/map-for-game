import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { actions as errorActions } from '@common/features/errors';
import { actions as loadingActions, Loader } from '@common/features/loading';

import { placesActions, getPlaceImagesSaga } from '@features/places';

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
 * Вотчер процесса загрузки изображений мест.
 * @returns — итератор саги.
 */
export function* placesProcessWatcher(): SagaIterator {
  yield takeEvery(placesActions.getPlaceImages, getPlaceImagesProcess);
}
