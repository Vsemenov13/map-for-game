import React from 'react';

const GALLERY_SKELETON_COUNT = 6;

/**
 * Скелетоны карточек галереи при загрузке фото.
 * @returns Компонент.
 */
export const GallerySkeleton: React.FC = () => (
  <div className="place-page__grid">
    {Array.from({ length: GALLERY_SKELETON_COUNT }, (_, index) => (
      <div key={index} className="place-page__card place-page__card_skeleton">
        <div className="place-page__skeleton-image" />
      </div>
    ))}
  </div>
);
