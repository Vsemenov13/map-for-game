import { SagaIterator } from 'redux-saga';
import { call, put, SagaReturnType } from 'redux-saga/effects';

import { api } from './api';
import { actions } from './ducks';
import type { Place, PlaceImage } from './model';
import { normalizePlace } from './utils';

/**
 * Сага загрузки конфига мест (api.getPlacesConfig).
 * Вызывается из процесса places (с переключением лоадера).
 * @returns — итератор саги.
 */
export function* getPlacesConfigSaga(): SagaIterator {
  const { data }: SagaReturnType<typeof api.getPlacesConfig> = yield call(
    api.getPlacesConfig,
  );
  const rawPlaces = data?.places;
  if (!Array.isArray(rawPlaces)) {
    throw new Error('Конфиг мест: неверный формат.');
  }
  const places = rawPlaces.map(normalizePlace) as Place[];
  yield put(actions.setPlaces(places));
}

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
