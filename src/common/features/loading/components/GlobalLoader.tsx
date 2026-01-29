import { Spin } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../selectors';

/**
 * Компонент глобального лоадера
 * @returns - Компонент
 */
export const GlobalLoader: React.FC = ({ children }) => {
  const isGlobal = useSelector(selectors.isGlobal);

  if (isGlobal) {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  return <>{children}</>;
};
