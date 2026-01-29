import { useEffect } from 'react';

/**
 * Блокирует горизонтальный скролл body, когда active true.
 * Восстанавливает предыдущее значение при размонтировании или смене active.
 * @param active - Включить блокировку.
 * @returns Ничего.
 */
export const useBodyOverflowX = (active: boolean): void => {
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = prev;
    };
  }, [active]);
};
