import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { config } from '@common/config';
import { useActions } from '@common/hooks';

import { initialState } from './constants';
import type { Place, PlaceImage } from './model';

const placesSlice = createSlice({
  name: config.modules.places,
  initialState,
  reducers: {
    /**
     * Установка списка мест из конфига.
     * @param state — состояние слайса.
     * @returns — void.
     */
    setPlaces(state, { payload }: PayloadAction<Place[]>) {
      state.places = payload;
    },
    /**
     * Установка изображений места в стор.
     * @param state — состояние слайса.
     * @returns — void.
     */
    setPlaceImages(
      state,
      { payload }: PayloadAction<{ placeId: string; images: PlaceImage[] }>,
    ) {
      const { placeId, images } = payload;
      state.placeImages[placeId] = images;
    },
  },
});

/** Экшен запроса загрузки конфига мест (обрабатывается процессом). */
const getPlacesConfig = createAction(
  `${config.modules.places}/getPlacesConfig`,
);

/** Экшен запроса загрузки изображений места (обрабатывается процессом, не редьюсером). */
const getPlaceImages = createAction<string>(
  `${config.modules.places}/getPlaceImages`,
);
export const actions = {
  ...placesSlice.actions,
  getPlaceImages,
  getPlacesConfig,
};
export const placesReducer = placesSlice.reducer;

/**
 * Хук экшенов фичи places (без useDispatch в компонентах).
 * @returns — объект экшенов фичи places.
 */
export const usePlacesActions = (): typeof actions => useActions(actions);
