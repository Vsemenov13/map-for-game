/** Изображение места (id, src, alt). */
export type PlaceImage = {
  id: string;
  src: string;
  alt: string;
};

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
