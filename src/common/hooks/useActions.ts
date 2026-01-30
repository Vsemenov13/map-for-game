import { ActionCreatorsMapObject, bindActionCreators } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Связывает объект экшенов с dispatch и возвращает обёрнутые экшены.
 * @param actions — объект с экшенами.
 * @returns — тот же объект с экшенами, обёрнутыми в dispatch.
 */
export const useActions = <T extends ActionCreatorsMapObject>(
  actions: T,
): T => {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(actions, dispatch),
    [actions, dispatch],
  );
};
