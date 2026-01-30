import { SagaIterator } from 'redux-saga';
import { call, put, SagaReturnType } from 'redux-saga/effects';

import { api } from './api';
import { actions } from './ducks';
import type { PlaceImage } from './model';

/**
 * Сага загрузки изображений места (api.getPlaceImages).
 * Вызывается из процесса places (с переключением лоадера).
 * @returns — итератор саги.
 */
export function* getPlaceImagesSaga({
  payload: placeId,
}: ReturnType<typeof actions.getPlaceImages>): SagaIterator {
  const { data }: SagaReturnType<typeof api.getPlaceImages> = yield call(
    api.getPlaceImages,
    placeId,
  );
  const images = data?.images;
  if (images !== undefined) {
    yield put(
      actions.setPlaceImages({ placeId, images: images as PlaceImage[] }),
    );
  } else {
    throw new Error('Не удалось загрузить изображения.');
  }
}
