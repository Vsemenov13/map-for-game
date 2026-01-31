import { Card, Image } from 'antd';
import React from 'react';

import type { PlaceGalleryProps } from '../types';

import { GallerySkeleton } from './GallerySkeleton';

/**
 * Галерея изображений места.
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
          <Card
            key={image.id}
            className="place-page__card"
            hoverable
            bordered={false}
          >
            <Image src={image.src} alt={image.alt} placeholder={false} />
          </Card>
        ))}
      </div>
    </Image.PreviewGroup>
  );
};
