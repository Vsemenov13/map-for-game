import { Card } from 'antd';
import React, { useCallback, useState } from 'react';

import { MapCanvasDesktop } from './MapCanvasDesktop';
import { MapCanvasMobile } from './MapCanvasMobile';
import { MapZoomButtons } from './MapZoomButtons';
import { MAP_IMAGE, MOBILE_BREAKPOINT, SCALE_STEP } from '../constants';
import { useBodyOverflowX, useMediaQuery } from '../hooks';
import type { ImageSize, PlacesMapProps } from '../types';
import { clampScale, computeContentSize, getInitialScale } from '../utils';

/**
 * Карта с кликабельными местами, зумом и адаптивной вёрсткой.
 * @returns Компонент.
 */
export const PlacesMap: React.FC<PlacesMapProps> = ({ places }) => {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
  useBodyOverflowX(isMobile);

  const [scale, setScale] = useState(getInitialScale);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);

  /** Обработчик загрузки изображения карты — сохраняет размер для расчёта контента. */
  const handleImageLoad = useCallback(
    (ev: React.SyntheticEvent<HTMLImageElement>) => {
      const img = ev.currentTarget;
      if (img.naturalWidth && img.naturalHeight) {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      }
    },
    [],
  );

  /** Увеличить масштаб карты на один шаг. */
  const zoomIn = useCallback(() => {
    setScale((scale) => clampScale(scale, SCALE_STEP, isMobile));
  }, [isMobile]);

  /** Уменьшить масштаб карты на один шаг. */
  const zoomOut = useCallback(() => {
    setScale((scale) => clampScale(scale, -SCALE_STEP, isMobile));
  }, [isMobile]);

  const { width: contentWidth, height: contentHeight } = computeContentSize(
    imageSize,
    scale,
  );

  return (
    <Card className="map-page__card" bordered={false}>
      <MapZoomButtons onZoomIn={zoomIn} onZoomOut={zoomOut} />
      <div className="map-page__map">
        {isMobile ? (
          <MapCanvasMobile
            places={places}
            mapImage={MAP_IMAGE}
            contentWidth={contentWidth}
            contentHeight={contentHeight}
            onImageLoad={handleImageLoad}
          />
        ) : (
          <MapCanvasDesktop
            places={places}
            mapImage={MAP_IMAGE}
            onImageLoad={handleImageLoad}
          />
        )}
      </div>
    </Card>
  );
};
