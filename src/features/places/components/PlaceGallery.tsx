import { Card, Image } from 'antd';
import React from 'react';

import { PlaceImage } from '../model/types';

/** Пропсы компонента. */
type PlaceGalleryProps = {
  images: PlaceImage[];
};

/**
 * Галерея изображений места.
 * @param props - Свойства компонента.
 * @returns Компонент.
 */
export const PlaceGallery: React.FC<PlaceGalleryProps> = ({ images }) => (
  <Image.PreviewGroup>
    <div className="place-page__grid">
      {images.map((image) => (
        <Card
          key={image.id}
          className="place-page__card"
          hoverable
          bordered={false}
        >
          <Image src={image.src} alt={image.alt} />
        </Card>
      ))}
    </div>
  </Image.PreviewGroup>
);
