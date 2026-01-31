import { Image } from 'antd';
import React from 'react';

import { GallerySkeleton } from './GallerySkeleton';
import { LazyGalleryImage } from './LazyGalleryImage';
import type { PlaceGalleryProps } from '../types';

/**
 * Галерея изображений места.
 * Изображения загружаются по мере скролла через Intersection Observer.
 * @param props - Свойства компонента.
 * @returns Компонент.
 */
export const PlaceGallery: React.FC<PlaceGalleryProps> = ({
  images,
  loading = false,
}) => {
  if (loading) {
    return <GallerySkeleton />;
  }

  return (
    <Image.PreviewGroup>
      <div className="place-page__grid">
        {images.map((image) => (
          <LazyGalleryImage key={image.id} image={image} />
        ))}
      </div>
    </Image.PreviewGroup>
  );
};
