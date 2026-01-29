import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import type { MapPinProps } from '../types';

/**
 * Один пин (ссылка и кнопка с названием места) на карте.
 * @returns Компонент.
 */
export const MapPin: React.FC<MapPinProps> = ({ place }) => (
  <Link
    to={`/place/${place.id}`}
    className="map-page__pin"
    style={{ top: place.pin.top, left: place.pin.left }}
    aria-label={`Открыть ${place.title}`}
    data-title={place.title}
  >
    <Button size="small" className="map-page__pin-button">
      <span className="map-page__pin-label">{place.title}</span>
    </Button>
  </Link>
);
