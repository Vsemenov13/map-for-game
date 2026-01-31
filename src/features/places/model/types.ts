/** Изображение места (id, src, alt, опционально width/height для резервирования места). */
export type PlaceImage = {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

/** Манифест изображений мест (placeId → массив изображений). */
export type PlacesManifest = Record<string, PlaceImage[]>;

/** Место на карте: id, название, позиция пина, галерея изображений. */
export type Place = {
  id: string;
  title: string;
  pin: {
    top: string;
    left: string;
  };
  images: PlaceImage[];
};
