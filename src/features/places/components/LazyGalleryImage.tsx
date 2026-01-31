import { Card, Image } from 'antd';
import React from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { PlaceImage } from '../model/types';

/** Data URL плейсхолдера для резервирования места до загрузки. */
const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='3' viewBox='0 0 4 3'%3E%3Crect fill='%23f0f0f0' width='4' height='3'/%3E%3C/svg%3E";

/** Пропсы компонента ленивой карточки изображения. */
type LazyGalleryImageProps = {
  image: PlaceImage;
};

/**
 * Карточка изображения с ленивой загрузкой через Intersection Observer.
 * src устанавливается только при появлении в viewport.
 * width/height резервируют место через aspect-ratio box (Pinterest без скачков).
 * @param props - Свойства компонента.
 * @returns Компонент.
 */
export const LazyGalleryImage: React.FC<LazyGalleryImageProps> = ({
  image,
}) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '300px 0px',
    triggerOnce: true,
  });

  const { width, height } = image;
  const aspectRatio =
    width && height && height > 0 ? `${width} / ${height}` : undefined;

  const imageNode = (
    <Image
      src={isVisible ? image.src : PLACEHOLDER_SRC}
      alt={image.alt}
      placeholder={false}
      preview={{ src: image.src }}
      wrapperClassName={aspectRatio ? 'place-page__card-image-fill' : undefined}
    />
  );

  return (
    <div ref={ref}>
      <Card className="place-page__card" hoverable bordered={false}>
        {aspectRatio ? (
          <div className="place-page__card-aspect" style={{ aspectRatio }}>
            {imageNode}
          </div>
        ) : (
          imageNode
        )}
      </Card>
    </div>
  );
};
