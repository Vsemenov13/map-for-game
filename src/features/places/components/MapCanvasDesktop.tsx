import { Image } from 'antd';
import React from 'react';

import { MapPin } from './MapPin';
import type { MapCanvasDesktopProps } from '../types';

/**
 * Канвас карты для десктопа (Image и пины).
 * @returns Компонент.
 */
export const MapCanvasDesktop: React.FC<MapCanvasDesktopProps> = ({
  places,
  mapImage,
  onImageLoad,
}) => (
  <div className="map-page__canvas">
    <Image
      className="map-page__image"
      src={mapImage}
      alt="Карта с местами"
      preview={false}
      onLoad={onImageLoad}
    />
    {places.map((place) => (
      <MapPin key={place.id} place={place} />
    ))}
  </div>
);
