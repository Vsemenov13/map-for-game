import type { Place } from '../model';

/**
 * Поиск места по идентификатору.
 * @param places — список мест.
 * @param placeId — идентификатор места.
 * @returns Найденное место или undefined.
 */
export const getPlaceById = (
  places: Place[],
  placeId: string,
): Place | undefined => places.find((place) => place.id === placeId);
