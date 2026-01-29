import { useEffect, useState } from 'react';

/**
 * Подписка на медиа-запрос (max-width: px).
 * @param maxWidthPx - Брейкпоинт в пикселях.
 * @returns true, если viewport уже или равен.
 */
export const useMediaQuery = (maxWidthPx: number): boolean => {
  const query = `(max-width: ${maxWidthPx}px)`;
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
};
