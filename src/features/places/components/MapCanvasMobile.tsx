import React from 'react';

import { MapPin } from './MapPin';
import type { MapCanvasMobileProps } from '../types';

/**
 * Стили ширины и высоты для скролл-контента и обёртки на мобилке.
 * @param width - Ширина в px.
 * @param height - Высота в px.
 * @returns Объект стилей.
 */
const mobileSizeStyle = (
  width: number,
  height: number,
): React.CSSProperties => ({
  width,
  height,
  minWidth: width,
  minHeight: height,
});

/**
 * Канвас карты для мобилки (скролл, img и пины).
 * @returns Компонент.
 */
export const MapCanvasMobile: React.FC<MapCanvasMobileProps> = ({
  places,
  mapImage,
  contentWidth,
  contentHeight,
  onImageLoad,
}) => {
  const size = mobileSizeStyle(contentWidth, contentHeight);
  const canvasStyle: React.CSSProperties = {
    ...size,
    backgroundImage: `url(${mapImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="map-page__scroll-content" style={size}>
      <div className="map-page__canvas-wrapper" style={size}>
        <div
          className="map-page__canvas map-page__canvas_mobile"
          style={canvasStyle}
        >
          <img
            className="map-page__image map-page__image_preload"
            src={mapImage}
            alt=""
            aria-hidden
            onLoad={onImageLoad}
          />
          {places.map((place) => (
            <MapPin key={place.id} place={place} />
          ))}
        </div>
      </div>
    </div>
  );
};
