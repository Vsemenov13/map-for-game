import { AxiosPromise } from 'axios';

import { request } from '@common/utils';

import type { PlaceImagesResponse, PlacesConfigResponse } from './types';

/**
 * Получить конфиг мест с API (Яндекс.Диск, places-config.json).
 * @returns — промис с ответом API.
 */
const getPlacesConfig = (): AxiosPromise<PlacesConfigResponse> =>
  request.get<PlacesConfigResponse>({
    url: 'api/places/config',
    version: '',
  });

/**
 * Получить список изображений места с API (Яндекс.Диск).
 * @param placeId — идентификатор места (папка на Диске).
 * @returns — промис с ответом API.
 */
const getPlaceImages = (placeId: string): AxiosPromise<PlaceImagesResponse> =>
  request.get<PlaceImagesResponse>({
    url: `api/places/${encodeURIComponent(placeId)}/images`,
    version: '',
  });

export const api = {
  getPlaceImages,
  getPlacesConfig,
};
