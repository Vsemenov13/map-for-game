import type { SyntheticEvent } from 'react';

import type { Place, PlaceImage } from '../model/types';

/** Типы и пропсы компонентов фичи мест. */

/** Размер изображения (ширина и высота в px). */
export type ImageSize = { width: number; height: number };

/** Ширина и высота контента карты в px. */
export type ContentSize = { width: number; height: number };

/** Пропсы компонента карты мест. */
export type PlacesMapProps = {
  /** Список мест для отображения пинов на карте. */
  places: Place[];
};

/** Пропсы кнопок зума карты. */
export type MapZoomButtonsProps = {
  /** Вызывается при нажатии «увеличить». */
  onZoomIn: () => void;
  /** Вызывается при нажатии «уменьшить». */
  onZoomOut: () => void;
};

/** Пропсы пина на карте. */
export type MapPinProps = {
  place: Place;
};

/** Пропсы десктопного канваса карты. */
export type MapCanvasDesktopProps = {
  places: Place[];
  mapImage: string;
  /** Вызывается после загрузки изображения карты. */
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>) => void;
};

/** Пропсы мобильного канваса карты. */
export type MapCanvasMobileProps = {
  places: Place[];
  mapImage: string;
  contentWidth: number;
  contentHeight: number;
  /** Вызывается после загрузки изображения карты. */
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>) => void;
};

/** Пропсы галереи изображений места. */
export type PlaceGalleryProps = {
  /** Список изображений места для отображения в галерее. */
  images: PlaceImage[];
  /** Признак загрузки изображений (показываются скелетоны карточек). */
  loading?: boolean;
};
