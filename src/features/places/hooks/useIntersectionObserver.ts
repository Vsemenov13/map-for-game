import { useEffect, useRef, useState } from 'react';

/** Опции для Intersection Observer. */
type UseIntersectionObserverOptions = {
  /** Отступ от viewport (px) для ранней загрузки. */
  rootMargin?: string;
  /** Порог пересечения (0–1). */
  threshold?: number;
  /** Отслеживать только при монтировании. */
  triggerOnce?: boolean;
};

/**
 * Хук отслеживания появления элемента в viewport через Intersection Observer.
 * @param options - Опции observer.
 * @returns Кортеж [ref для элемента, флаг видимости].
 */
export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
): [React.RefObject<T | null>, boolean] => {
  const {
    rootMargin = '200px 0px',
    threshold = 0.01,
    triggerOnce = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || (triggerOnce && isVisible)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
        setIsVisible(true);
        if (triggerOnce) {
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce, isVisible]);

  return [ref, isVisible];
};
