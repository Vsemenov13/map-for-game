import { useEffect, useState } from 'react';

import type { PlaceImage } from '../model';

/** Манифест изображений мест (placeId → массив изображений). */
export type PlacesManifest = Record<string, PlaceImage[]>;

const MANIFEST_URL = '/places-manifest.json';

/**
 * Загружает манифест изображений с Яндекс.Диска (после sync-images).
 * @returns Данные манифеста или null, если не загружен / нет файла.
 */
export const usePlacesManifest = (): PlacesManifest | null => {
  const [data, setData] = useState<PlacesManifest | null>(null);

  useEffect(() => {
    fetch(MANIFEST_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return data;
};
