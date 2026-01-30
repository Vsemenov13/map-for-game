import type { PlaceImage } from '../model';

/** Состояние фичи places в сторе. */
export type PlacesState = {
  /** Кэш изображений по placeId. */
  placeImages: Record<string, PlaceImage[]>;
};
