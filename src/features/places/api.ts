import { AxiosPromise } from 'axios';

import { request } from '@common/utils';

import type { PlaceImage } from './model';

type PlaceImagesResponse = {
  images?: PlaceImage[];
};

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
};
