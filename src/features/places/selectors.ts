import type { RootState } from '@store';
import { useSelector } from 'react-redux';

import { config } from '@common/config';

import type { Place, PlaceImage } from './model';

const selectPlacesState = (state: RootState) => state[config.modules.places];

/** Список мест из стора (из конфига). */
export const selectPlaces = (state: RootState): Place[] =>
  selectPlacesState(state).places;

/**
 * Хук: список мест из стора.
 * @returns Список мест.
 */
export const usePlaces = (): Place[] =>
  useSelector((state: RootState) => selectPlaces(state));

/** Изображения места из стора (пустой массив, если ещё не загружены). */
export const selectPlaceImages = (
  state: RootState,
  placeId: string,
): PlaceImage[] => selectPlacesState(state).placeImages[placeId] ?? [];

/**
 * Хук: изображения места для отображения (из стора или статические place.images).
 */
export const usePlaceImages = (
  placeId: string | undefined,
  place: Place | null,
): PlaceImage[] => {
  const images = useSelector((state: RootState) =>
    placeId ? selectPlaceImages(state, placeId) : [],
  );
  if (images.length > 0) {
    return images;
  }
  return place?.images ?? [];
};

export const selectors = {
  selectPlaceImages,
  selectPlaces,
  usePlaceImages,
  usePlaces,
};
