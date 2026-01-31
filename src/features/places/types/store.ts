import type { Place, PlaceImage } from '../model';

/** Состояние фичи places в сторе. */
export type PlacesState = {
  /** Список мест (из конфига на Яндекс.Диске). */
  places: Place[];
  /** Кэш изображений по placeId. */
  placeImages: Record<string, PlaceImage[]>;
};
