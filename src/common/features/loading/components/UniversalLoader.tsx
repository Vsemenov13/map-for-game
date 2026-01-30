import { Spin } from 'antd';
import React, { PropsWithChildren } from 'react';

/** Свойства универсального лоадера. */
type UniversalLoaderProps = {
  /** Признак загрузки. */
  loading?: boolean;
};

/**
 * Лоадер для универсальных задач (пока загрузка — показывается спиннер и текст).
 * @returns - Компонент.
 */
export const UniversalLoader: React.FC<
  PropsWithChildren<UniversalLoaderProps>
> = ({ children, loading = true }) => {
  if (loading) {
    return (
      <div className="universal-loader">
        <Spin size="large" />
        <p className="universal-loader__text">Загрузка...</p>
      </div>
    );
  }

  return <>{children}</>;
};
