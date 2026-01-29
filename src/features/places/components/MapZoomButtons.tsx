import { Button } from 'antd';
import React from 'react';

import type { MapZoomButtonsProps } from '../types';

/**
 * Кнопки увеличения и уменьшения масштаба карты.
 * @returns Компонент.
 */
export const MapZoomButtons: React.FC<MapZoomButtonsProps> = ({
  onZoomIn,
  onZoomOut,
}) => (
  <div className="map-page__zoom">
    <Button size="small" onClick={onZoomIn} aria-label="Увеличить карту">
      +
    </Button>
    <Button size="small" onClick={onZoomOut} aria-label="Уменьшить карту">
      –
    </Button>
  </div>
);
