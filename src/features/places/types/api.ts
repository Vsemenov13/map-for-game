import type { Place, PlaceImage } from '../model';

/** Ответ API списка изображений места. */
export type PlaceImagesResponse = {
  images?: PlaceImage[];
};

/** Ответ API конфига мест. */
export type PlacesConfigResponse = {
  places?: Array<Omit<Place, 'images'> & { images?: PlaceImage[] }>;
};
