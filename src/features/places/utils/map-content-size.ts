import {
  MAX_SCALE,
  MIN_SCALE,
  MIN_SCALE_MOBILE,
  MOBILE_BASE_WIDTH,
  MOBILE_BREAKPOINT,
} from '../constants';
import type { ContentSize, ImageSize } from '../types';

/**
 * Начальный масштаб по медиа-запросу (мобилка — MIN_SCALE_MOBILE, иначе 1).
 * @returns Начальный масштаб.
 */
export const getInitialScale = (): number => {
  if (typeof window === 'undefined') {
    return 1;
  }
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
    ? MIN_SCALE_MOBILE
    : 1;
};

/**
 * Масштаб с учётом границ (isMobile — свой минимум).
 * @param scale - Текущий масштаб.
 * @param delta - Изменение (положительное или отрицательное).
 * @param isMobile - Учитывать мобильный минимум.
 * @returns Новый масштаб в границах.
 */
export const clampScale = (
  scale: number,
  delta: number,
  isMobile: boolean,
): number => {
  const min = isMobile ? MIN_SCALE_MOBILE : MIN_SCALE;
  const next = Number((scale + delta).toFixed(2));
  return Math.min(MAX_SCALE, Math.max(min, next));
};

/**
 * Ширина и высота контента карты по размеру изображения и масштабу.
 * @param imageSize - Размер изображения или null до загрузки.
 * @param scale - Масштаб.
 * @returns Ширина и высота контента.
 */
export const computeContentSize = (
  imageSize: ImageSize | null,
  scale: number,
): ContentSize => {
  const width = imageSize
    ? Math.round(imageSize.width * scale)
    : Math.round(MOBILE_BASE_WIDTH * scale);
  const height = imageSize
    ? Math.round(width * (imageSize.height / imageSize.width))
    : Math.round(MOBILE_BASE_WIDTH * 0.71 * scale);
  return { width, height };
};
