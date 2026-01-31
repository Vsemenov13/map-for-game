import type { Place, PlaceImage } from '../model';

/**
 * Нормализует место из API (добавляет пустой массив images при отсутствии).
 * @param raw — сырые данные места из API.
 * @returns Нормализованное место.
 */
export const normalizePlace = (
  raw: Omit<Place, 'images'> & { images?: PlaceImage[] },
): Place => ({
  ...raw,
  images: raw.images ?? [],
});
